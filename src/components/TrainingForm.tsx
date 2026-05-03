import { DialogContent, Stack, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { Dayjs } from 'dayjs';
import type { CustomerOption } from './AddTraining';

export interface TrainingFormData {
    date: Dayjs | null;
    duration: string;
    activity: string;
    customer: string;
}

interface TrainingFormProps {
    formData: TrainingFormData;
    setFormData: React.Dispatch<React.SetStateAction<TrainingFormData>>;
    customers: CustomerOption[];
}

export default function TrainingForm({ formData, setFormData, customers }: TrainingFormProps) {
    const handleDateChange = (newDate: Dayjs | null) => {
        setFormData({ ...formData, date: newDate });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
                {/* OSA 2: Harjoituksen päivämäärä ja aika syötetään DateTimePicker */}
                <DateTimePicker
                    label="Date and time"
                    value={formData.date}
                    onChange={handleDateChange}
                    ampm={false}
                    format="DD.MM.YYYY HH:mm"
                />
                <TextField
                    label="Duration (min)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    select
                    label="Customer"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    size="small"
                    slotProps={{ select: { native: true } }}
                >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                        <option key={c.url} value={c.url}>
                            {c.name}
                        </option>
                    ))}
                </TextField>
            </Stack>
        </DialogContent>
    );
}
