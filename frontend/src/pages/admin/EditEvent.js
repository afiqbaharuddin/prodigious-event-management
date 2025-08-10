import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import EventForm from '../../components/admin/EventForm';
import { formatForInput } from '../../utils/dateUtils';

const EditEvent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: '',
    image_url: '',
    status: 'active'
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const navigate                            = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        const event = response.data.event;

        setFormData({
          title: event.title,
          description: event.description,
          start_date: formatForInput(event.start_date),
          end_date: formatForInput(event.end_date),
          location: event.location,
          max_participants: event.max_participants || '',
          image_url: event.image_url || '',
          status: event.status
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/admin/events');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSuccess = () => navigate('/admin/events');

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Event
      </Typography>
      <EventForm
        mode="edit"
        submitUrl={`/api/events/${id}`}
        initialValues={formData}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/admin/events')}
      />
    </Box>
  );
};

export default EditEvent;