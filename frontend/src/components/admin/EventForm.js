import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../utils/dateUtils';

const defaultValues = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  max_participants: '',
  image_url: '',
  status: 'active'
};

export default function EventForm({
  mode = 'create',
  initialValues = {},
  submitUrl,
  onSuccess,
  onCancel
}) {
  const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const hasImage = useMemo(() => Boolean(formData.image_url), [formData.image_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: file, image_url: previewUrl }));
    if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
  };

  const formatDate = (value) => {
    if (!value) return 'TBD';
    return formatDateTime(value, 'MMM dd, yyyy HH:mm') || 'TBD';
  };

  const statusColor = {
    active: 'success',
    cancelled: 'error',
    completed: 'default'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const data = new FormData();
      if (mode === 'edit') data.append('_method', 'PUT');
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('start_date', formData.start_date);
      data.append('end_date', formData.end_date);
      data.append('location', formData.location);

      if (formData.max_participants)
        data.append('max_participants', String(parseInt(formData.max_participants)));
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      } else if (formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      await axios.post(submitUrl, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(mode === 'edit' ? 'Event updated successfully!' : 'Event created successfully!');
      onSuccess && onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(mode === 'edit' ? 'Failed to update event' : 'Failed to create event');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* basic info */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title?.[0]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                minRows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description?.[0]}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* schedule */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Schedule</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Start Date & Time"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
                error={!!errors.start_date}
                helperText={errors.start_date?.[0]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="End Date & Time"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
                error={!!errors.end_date}
                helperText={errors.end_date?.[0]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* details */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location?.[0]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Participants"
                name="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={handleChange}
                error={!!errors.max_participants}
                helperText={errors.max_participants?.[0] || 'Leave empty for unlimited'}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* banner n status */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Banner & Status</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Button component="label" variant="outlined" sx={{ borderRadius: 2, height: 56, justifyContent: 'flex-start' }}>
                  Upload Banner Image
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {(errors.image || errors.image_url) && (
                  <Typography variant="caption" color="error">
                    {errors.image?.[0] || errors.image_url?.[0]}
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2 }}>
                <Box sx={{
                  height: 180,
                  backgroundColor: hasImage ? 'transparent' : 'rgba(63,81,181,0.06)',
                  backgroundImage: hasImage ? `url(${formData.image_url})` : 'linear-gradient(135deg, rgba(63,81,181,0.08), rgba(83,109,254,0.08))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                      {formData.title || 'Event Title'}
                    </Typography>
                    <Chip size="small" label={formData.status} color={statusColor[formData.status] || 'default'} sx={{ textTransform: 'capitalize' }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(formData.start_date)} — {formatDate(formData.end_date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.location || 'Location TBD'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* action */}
        <Divider />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel} sx={{ px: 3, py: 1, borderRadius: '12px' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              px: 4,
              py: 1,
              borderRadius: '12px',
              background: loading ? 'rgba(63, 81, 181, 0.7)' : 'linear-gradient(45deg, #3f51b5, #536dfe)',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(63, 81, 181, 0.2)',
              '&:hover': { boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)' }
            }}
          >
            {loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Event' : 'Create Event')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
