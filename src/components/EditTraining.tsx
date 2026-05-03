import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import TrainingForm from './TrainingForm';
import type { CustomerOption, TrainingFormData } from './AddTraining';

interface TrainingData {
    id: string;
    date: string;
    duration: number;
    activity: string;
    customer: string;
    customerName: string;
}

interface EditTrainingProps {
    training: TrainingData;
    customers: CustomerOption[];
    onSave: (data: TrainingFormData) => void;
}

interface FormState {
    date: Dayjs | null;
    duration: string;
    activity: string;
    customer: string;
}

// OSA 3: Komponentti muokkaa olemassa olevaa harjoitusta
export default function EditTraining({ training, customers, onSave }: EditTrainingProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<FormState>({
        date: dayjs(),
        duration: '',
        activity: '',
        customer: '',
    });

    // EXTRA: Avaa dialogi ja täyttää se harjoituksen tiedoilla
    const handleClickOpen = () => {
        setFormData({
            date: dayjs(training.date),
            duration: String(training.duration),
            activity: training.activity,
            customer: training.customer,
        });
        setOpen(true);
    };

    // EXTRA: Sulkee muokkaisdialogon
    const handleClose = () => {
        setOpen(false);
    };

    // EXTRA: Validoi lomakkeen ja lähettää päivitetyt tiedot parent
    const handleSave = () => {
        if (!formData.date || !formData.duration || !formData.activity || !formData.customer) return;

        onSave({
            date: formData.date.toISOString(),
            duration: Number(formData.duration),
            activity: formData.activity,
            customer: formData.customer,
        });
        handleClose();
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen} startIcon={<EditIcon />} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit training</DialogTitle>
                <TrainingForm formData={formData} setFormData={setFormData} customers={customers} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
