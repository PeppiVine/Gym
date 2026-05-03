import { useEffect, useState } from 'react';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button, Snackbar, Stack } from '@mui/material';
import CustomerDialog from './CustomerDialog';
import type { CustomerFormData } from './CustomerDialog';
import ConfirmDialog from './ConfirmDialog';
import DataTable from './DataTable';
import { CUSTOMERS_URL, deleteResource, fetchJson, sendJson } from '../api';

interface Customer extends CustomerFormData {
  id: string;
}

// OSA 1: Asiakkaiden oma listasivu.
export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<{ url: string; data: CustomerFormData } | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  // EXTRA: Hakee asiakkaat backendistä ja muuntaa rivi-ID:ksi self-linkin.
  const fetchCustomers = async () => {
    try {
      const data = await fetchJson<{ _embedded: { customers: Array<Customer & { _links: { self: { href: string } } }> } }>(
        CUSTOMERS_URL,
      );
      const rows: Customer[] = data._embedded.customers.map((customer) => ({
        ...customer,
        id: customer._links.self.href,
      }));
      setCustomers(rows);
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 2: Avaa lomakkeen uuden asiakkaan lisäämistä varten.
  const handleOpenAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  // OSA 2: Avaa lomakkeen asiakkaan muokkausta varten.
  const handleOpenEdit = ({ row }: GridRowParams) => {
    const { id, ...data } = row as Customer;
    setEditData({ url: id, data });
    setDialogOpen(true);
  };

  // OSA 2: Tallentaa asiakkaan.
  const handleSave = async (formData: CustomerFormData) => {
    const url = editData ? editData.url : CUSTOMERS_URL;
    const method = editData ? 'PUT' : 'POST';

    setDialogOpen(false);

    try {
      await sendJson(url, method, formData);
      await fetchCustomers();
      setSnackbarMsg(editData ? 'Customer updated' : 'Customer added');
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 2: Poistaa asiakkaan vasta kun on vavhvistettu jälkeen.
  const handleDelete = async () => {
    if (!deleteUrl) return;

    setDeleteUrl(null);

    try {
      await deleteResource(deleteUrl);
      await fetchCustomers();
      setSnackbarMsg('Customer deleted');
    } catch (err) {
      console.error(err);
    }
  };

  // OSA 3: Vie asiakasdatan CSV-tiedostoksi.
  const handleExportCsv = () => {
    const headers = ['First name', 'Last name', 'Address', 'Postal code', 'City', 'Email', 'Phone'];
    const rows = customers.map(({ firstname, lastname, streetaddress, postcode, city, email, phone }) =>
      [firstname, lastname, streetaddress, postcode, city, email, phone]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 120 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 120 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.2, minWidth: 150 },
    { field: 'postcode', headerName: 'Postal code', flex: 0.8, minWidth: 110 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 160 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 130 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      filterable: false,
      hideable: false,
      // EXTRA: Toiminnot-sarake tarjoaa rivikohtaiset muokkaus- ja poistopainikkeet.
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Edit"
          onClick={() => handleOpenEdit(params)}
        />,
        <GridActionsCellItem
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
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add customer
          </Button>
          {/* OSA 3: Käynnistää asiakaslistan CSV-latauksen. */}
          <Button variant="outlined" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </Stack>
      </div>
      <DataTable rows={customers} columns={columns} />

      <CustomerDialog
        open={dialogOpen}
        customerData={editData?.data ?? null}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteUrl !== null}
        title="Delete customer"
        content="Are you sure you want to delete this customer?"
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
