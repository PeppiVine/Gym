import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import CustomerForm from './CustomerForm';

export interface CustomerFormData {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
}

export const EMPTY_CUSTOMER: CustomerFormData = {
  firstname: '',
  lastname: '',
  streetaddress: '',
  postcode: '',
  city: '',
  email: '',
  phone: '',
};

interface CustomerDialogProps {
  open: boolean;
  customerData: CustomerFormData | null;
  onClose: () => void;
  onSave: (data: CustomerFormData) => void;
}

export default function CustomerDialog({ open, customerData, onClose, onSave }: CustomerDialogProps) {
  const [formData, setFormData] = useState<CustomerFormData>(EMPTY_CUSTOMER);

  // EXTRA: Täyttää lomakkeen muokkausdatalla tai tyhjentää kentät uuden asiakkaan lisäyksessä.
  useEffect(() => {
    setFormData(customerData ?? EMPTY_CUSTOMER);
  }, [customerData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{customerData ? 'Edit customer' : 'Add new customer'}</DialogTitle>
      <CustomerForm formData={formData} setFormData={setFormData} />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formData)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
