import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/admin/EventForm';
import './AdminStyles.css';

const CreateEvents = () => {
  const initialValues = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: '',
    image_url: '',
    status: 'active'
  };

  const navigate      = useNavigate();
  const handleSuccess = () => navigate('/admin/events');

  return (
    <Box className="fade-in">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          className="page-section-title"
          sx={{ 
            fontWeight: 500,
            color: '#333',
            position: 'relative',
          }}
        >
          Create New Event
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin/events')}
          sx={{
            borderRadius: '12px',
            boxShadow: 'none',
            px: 3
          }}
        >
          Back to Events
        </Button>
      </Box>

      <EventForm
        mode="create"
        submitUrl="/api/events"
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={() => navigate('/admin/events')}
      />
    </Box>
  );
};

export default CreateEvents;