import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, event: null });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const fetchEvents = async () => {
    try {
      const params = search ? { search } : {};
      const response = await axios.get('/api/events', { params });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event) => {
    try {
      await axios.delete(`/api/events/${event.id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setDeleteDialog({ open: false, event: null });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading events...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/admin/events/create"
        >
          Create Event
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search events..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description.length > 60
                      ? `${event.description.substring(0, 60)}...`
                      : event.description
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  {formatDate(event.start_date, 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  {event.registration_count}
                  {event.max_participants && ` / ${event.max_participants}`}
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.status}
                    color={getStatusColor(event.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    component={Link}
                    to={`/events/${event.id}`}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/admin/events/${event.id}/edit`}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteDialog({ open: true, event })}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, event: null })}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.event?.title}"?
            This action cannot be undone and will also cancel all registrations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, event: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.event)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEvents;