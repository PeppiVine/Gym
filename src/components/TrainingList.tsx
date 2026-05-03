import { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import AddTraining from './AddTraining';
import EditTraining from './EditTraining';
import type { TrainingFormData, CustomerOption } from './AddTraining';
import ConfirmDialog from './ConfirmDialog';
import DataTable from './DataTable';
import { CUSTOMERS_URL, TRAININGS_URL, deleteResource, fetchJson, sendJson } from '../api';

interface Training {
  id: string;
  date: string;
  duration: number;
  activity: string;
  customer: string;
  customerName: string;
}

// OSA 1: Tämä komponentti on harjoitusten oma listasivu.
export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    fetchTrainings();
    fetchCustomers();
  }, []);

  // EXTRA: Hakee asiakkaat AddTraining-valintalistaa varten.
  const fetchCustomers = async () => {
    try {
      const data = await fetchJson<{
        _embedded: {
          customers: Array<{ firstname: string; lastname: string; _links: { self: { href: string } } }>;
        };
      }>(CUSTOMERS_URL);
      setCustomers(
        data._embedded.customers.map((customer) => ({
          name: `${customer.firstname} ${customer.lastname}`,
          url: customer._links.self.href,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // EXTRA: Hakee harjoitukset ja liittää jokaiseen asiakkaan nimen kalenteri- ja taulukkonäkymää varten.
  const fetchTrainings = async () => {
    try {
      const data = await fetchJson<{
        _embedded: {
          trainings: Array<{
            date: string;
            duration: number;
            activity: string;
            _links: { self: { href: string }; customer: { href: string } };
          }>;
        };
      }>(TRAININGS_URL);

      const rows: Training[] = await Promise.all(
        data._embedded.trainings.map(async (training) => {
          let customerName = '';
          try {
            const customer = await fetchJson<{ firstname: string; lastname: string }>(training._links.customer.href);
            customerName = `${customer.firstname} ${customer.lastname}`;
          } catch {
            customerName = 'Unknown';
          }

          return {
            id: training._links.self.href,
            date: training.date,
            duration: training.duration,
            activity: training.activity,
            customer: training._links.customer.href,
            customerName,
          };
        })
      );
      setTrainings(rows);
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 2: Lisää uuden harjoituksen.
  const handleAdd = async (formData: TrainingFormData) => {
    setAddDialogOpen(false);

    try {
      await sendJson(TRAININGS_URL, 'POST', formData);
      await fetchTrainings();
      setSnackbarMsg('Training added');
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 2: Päivittää harjoituksen.
  const handleUpdate = async (url: string, formData: TrainingFormData) => {
    try {
      await sendJson(url, 'PUT', formData);
      await fetchTrainings();
      setSnackbarMsg('Training updated');
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 2: Poistaa harjoituksen vasta kun on kysytty vahvistus.
  const handleDelete = async () => {
    if (!deleteUrl) return;

    setDeleteUrl(null);

    try {
      await deleteResource(deleteUrl);
      await fetchTrainings();
      setSnackbarMsg('Training deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.2,
      minWidth: 170,
      // OSA 1: Tämä pistää päivämäärän taulukkoon muotoon pp.kk.vvvv hh:mm.
      valueFormatter: (value: string) =>
        value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '',
    },
    {
      field: 'duration',
      headerName: 'Duration (min)',
      type: 'number',
      flex: 0.8,
      minWidth: 110,
    },
    // OSA 1: Näyttää training kohdassa asiakkaan nimen.
    { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 140 },
    { field: 'customerName', headerName: 'Customer', flex: 1.2, minWidth: 160 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 110,
      filterable: false,
      hideable: false,
      // EXTRA: Toiminnot-sarake sisältää rivikohtaisen muokkaus- ja poistopainikkeen.
      getActions: (params) => [
        <EditTraining
          key={`edit-${params.id}`}
          training={params.row as Training}
          customers={customers}
          onClose={() => { }}
          onSave={(data) => handleUpdate(params.id as string, data)}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => setDeleteUrl(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <>
      <div style={{ padding: '16px 16px 0' }}>
        {/* OSA 2: Avaa valintahomman uuden harjoituksen lisäämistä varten. */}
        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add training
        </Button>
      </div>
      <DataTable rows={trainings} columns={columns} />

      <AddTraining
        open={addDialogOpen}
        customers={customers}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAdd}
      />

      <ConfirmDialog
        open={deleteUrl !== null}
        title="Delete training"
        content="Are you sure you want to delete this training?"
        onClose={() => setDeleteUrl(null)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={snackbarMsg !== ''}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
        message={snackbarMsg}
      />
    </>
  );
}
