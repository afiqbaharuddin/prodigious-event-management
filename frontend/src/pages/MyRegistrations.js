import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatDateTime, formatDate } from '../utils/dateUtils';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, registration: null });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('/api/my-registrations');
      setRegistrations(response.data.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registration) => {
    try {
      await axios.delete(`/api/registrations/${registration.id}`);
      toast.success('Registration cancelled successfully');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to cancel registration');
    } finally {
      setCancelDialog({ open: false, registration: null });
    }
  };

  if (loading) {
    return <Typography>Loading your registrations...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Event Registrations
      </Typography>

      {registrations.length === 0 ? (
        <Typography>
          You haven't registered for any events yet.{' '}
          <Link to="/events">Browse events</Link>
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {registrations.map((registration) => (
            <Grid item xs={12} md={6} key={registration.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {registration.event.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {registration.event.description.length > 100
                      ? `${registration.event.description.substring(0, 100)}...`
                      : registration.event.description
                    }
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Date:</strong> {formatDateTime(registration.event.start_date, 'MMM dd, yyyy HH:mm')}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Location:</strong> {registration.event.location}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Registered:</strong> {formatDate(registration.registered_at, 'MMM dd, yyyy')}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={registration.status}
                      color="success"
                      size="small"
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/events/${registration.event.id}`}
                  >
                    View Event
                  </Button>
                  
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setCancelDialog({ open: true, registration })}
                  >
                    Cancel Registration
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, registration: null })}
      >
        <DialogTitle>Cancel Registration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your registration for "
            {cancelDialog.registration?.event.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, registration: null })}>
            Keep Registration
          </Button>
          <Button
            onClick={() => handleCancel(cancelDialog.registration)}
            color="error"
            variant="contained"
          >
            Cancel Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyRegistrations;