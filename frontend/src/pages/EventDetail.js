import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime } from '../utils/dateUtils';

const EventDetail = () => {
  const { id }                            = useParams();
  const [event, setEvent]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [registering, setRegistering]     = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { user }                          = useAuth();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    setRegistering(true);
    try {
      await axios.post(`/api/events/${id}/register`);
      toast.success('Successfully registered for the event!');
      fetchEvent(); // Refresh event data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setRegistering(false);
      setConfirmDialog(false);
    }
  };

  if (loading) {
    return <Typography>Loading event...</Typography>;
  }

  if (!event) {
    return <Typography>Event not found</Typography>;
  }

  const isUserRegistered = user && event.registrations.some(reg => reg.user_id === user.id);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {event.image_url && (
              <Box sx={{ mb: 3 }}>
                <img
                  src={event.image_url}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}

            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>

            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={event.status} color="success" />
              {event.is_full && <Chip label="FULL" color="error" />}
              {isUserRegistered && <Chip label="REGISTERED" color="info" />}
            </Box>

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {event.description}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Start Date
                </Typography>
                <Typography>
                  {formatDate(event.start_date)}
                </Typography>
                <Typography>
                  {formatTime(event.start_date)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  End Date
                </Typography>
                <Typography>
                  {formatDate(event.end_date)}
                </Typography>
                <Typography>
                  {formatTime(event.end_date)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Location
                </Typography>
                <Typography>{event.location}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Registration
            </Typography>

            {event.max_participants && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Participants: {event.registration_count} / {event.max_participants}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available spots: {event.available_spots}
                </Typography>
              </Box>
            )}

            {!user ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please login to register for this event
              </Alert>
            ) : isUserRegistered ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                You are registered for this event
              </Alert>
            ) : event.is_full ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                This event is full
              </Alert>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => setConfirmDialog(true)}
                disabled={registering}
                sx={{ mb: 2 }}
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </Button>
            )}

            <Typography variant="body2" color="text.secondary">
              Registration is free and you can cancel anytime before the event starts.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Registration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to register for "{event.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleRegister} variant="contained" disabled={registering}>
            {registering ? 'Registering...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetail;