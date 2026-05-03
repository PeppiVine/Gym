import { DialogContent, Stack, TextField } from '@mui/material';
import type { CustomerFormData } from './CustomerDialog';

interface CustomerFormProps {
    formData: CustomerFormData;
    setFormData: React.Dispatch<React.SetStateAction<CustomerFormData>>;
}

export default function CustomerForm({ formData, setFormData }: CustomerFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                    label="First name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Last name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Address"
                    name="streetaddress"
                    value={formData.streetaddress}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Postal code"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    size="small"
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="small"
                />
            </Stack>
        </DialogContent>
    );
}
