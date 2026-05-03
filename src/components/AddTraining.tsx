import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import TrainingForm from './TrainingForm';

export interface CustomerOption {
  name: string;
  url: string;
}

export interface TrainingFormData {
  date: string;
  duration: number;
  activity: string;
  customer: string;
}

interface AddTrainingProps {
  open: boolean;
  customers: CustomerOption[];
  onClose: () => void;
  onSave: (data: TrainingFormData) => void;
}

interface FormState {
  date: Dayjs | null;
  duration: string;
  activity: string;
  customer: string;
}

const EMPTY_FORM_STATE: FormState = {
  date: dayjs(),
  duration: '',
  activity: '',
  customer: '',
};

export default function AddTraining({ open, customers, onClose, onSave }: AddTrainingProps) {
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM_STATE);

  // EXTRA: Nollaa lomakekentät aina, kun avataan uusi harjoitus kohta.
  useEffect(() => {
    if (open) {
      setFormData(EMPTY_FORM_STATE);
    }
  }, [open]);

  // EXTRA: Tarkistaa pakolliset kentät ja lähettää tiedot parent-komponentille.
  const handleSave = () => {
    if (!formData.date || !formData.duration || !formData.activity || !formData.customer) return;

    onSave({
      date: formData.date.toISOString(),
      duration: Number(formData.duration),
      activity: formData.activity,
      customer: formData.customer,
    });
    setFormData(EMPTY_FORM_STATE);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add new training</DialogTitle>
      <TrainingForm formData={formData} setFormData={setFormData} customers={customers} />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
