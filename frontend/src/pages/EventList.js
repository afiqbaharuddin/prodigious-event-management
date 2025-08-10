import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  CardMedia,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDateTime } from '../utils/dateUtils';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SortIcon from '@mui/icons-material/Sort';

const EventList = () => {
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [location, setLocation]     = useState('');
  const [sortBy, setSortBy]         = useState('start_date');
  const [sortOrder, setSortOrder]   = useState('asc');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, [search, location, sortBy, sortOrder, page]);

  const fetchEvents = async () => {
    try {
      const params = {
        page,
        search: search || undefined,
        location: location || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const response = await axios.get('/api/events', { params });
      setEvents(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <Typography variant="body1" color="text.secondary">Loading events...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 300, 
          letterSpacing: 1, 
          mb: 4,
          color: theme.palette.text.primary 
        }}
      >
        UPCOMING EVENTS
      </Typography>

      {/* Filters */}
      <Box 
        sx={{ 
          mb: 5, 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 3,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <TextField
          placeholder="Search events..."
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 1 }
          }}
        />
        
        <TextField
          placeholder="Filter by location"
          variant="outlined"
          value={location}
          onChange={handleLocationChange}
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 1 }
          }}
        />

        <FormControl sx={{ 
          minWidth: 150,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
            sx={{ borderRadius: 1 }}
            IconComponent={SortIcon}
          >
            <MenuItem value="start_date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="location">Location</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ 
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Order"
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.length === 0 ? (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No events found matching your search criteria.
            </Typography>
          </Box>
        ) : (
          events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`,
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
                elevation={0}
              >
                {event.image_url && (
                  <Box sx={{ overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={event.image_url}
                      alt={event.title}
                      sx={{ 
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      fontWeight: 500, 
                      letterSpacing: 0.5,
                      color: theme.palette.text.primary
                    }}
                  >
                    {event.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ opacity: 0.8, mb: 2 }}
                  >
                    {event.description.length > 50
                      ? `${event.description.substring(0, 50)}...`
                      : event.description
                    }
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="body2"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.palette.text.primary,
                        '& strong': {
                          color: theme.palette.primary.main,
                          marginRight: '8px',
                          fontWeight: 500
                        }
                      }}
                    >
                      <strong>Date:</strong> 
                      {formatDateTime(event.start_date, 'MMM dd, yyyy HH:mm')}
                    </Typography>
                    
                    <Typography 
                      variant="body2"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.palette.text.primary,
                        '& strong': {
                          color: theme.palette.primary.main,
                          marginRight: '8px',
                          fontWeight: 500
                        }
                      }}
                    >
                      <strong>Location:</strong> {event.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {event.max_participants && (
                      <Chip
                        label={`${event.registration_count}/${event.max_participants} spots`}
                        color={event.is_full ? 'error' : 'primary'}
                        size="small"
                        sx={{ 
                          borderRadius: 1,
                          backgroundColor: event.is_full 
                            ? alpha(theme.palette.error.main, 0.15)
                            : alpha(theme.palette.primary.main, 0.15),
                          color: event.is_full 
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                          fontWeight: 400,
                          letterSpacing: 0.3
                        }}
                      />
                    )}
                    
                    <Chip
                      label={event.status}
                      color="success"
                      size="small"
                      sx={{ 
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.success.main, 0.15),
                        color: theme.palette.success.main,
                        fontWeight: 400,
                        letterSpacing: 0.3
                      }}
                    />
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/events/${event.id}`}
                    sx={{ 
                      color: theme.palette.text.primary,
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      textTransform: 'none',
                      letterSpacing: 0.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: theme.palette.text.primary,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default EventList;