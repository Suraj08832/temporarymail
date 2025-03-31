import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import BlockIcon from '@mui/icons-material/Block';

const Premium = () => {
  const features = [
    {
      title: 'Extended Expiration',
      description: 'Keep your temporary email active for up to 30 days',
      icon: <SpeedIcon />,
    },
    {
      title: 'Custom Domains',
      description: 'Choose from multiple domain options for your temporary email',
      icon: <StarIcon />,
    },
    {
      title: 'Ad-Free Experience',
      description: 'Enjoy a clean, distraction-free interface',
      icon: <BlockIcon />,
    },
    {
      title: 'Enhanced Security',
      description: 'Additional security features and priority support',
      icon: <SecurityIcon />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Upgrade to Premium
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Get access to exclusive features and enhance your temporary email experience
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Premium Plan
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              $5
              <Typography component="span" variant="subtitle1" color="text.secondary">
                /month
              </Typography>
            </Typography>
            <List sx={{ width: '100%', mb: 3 }}>
              {features.map((feature) => (
                <ListItem key={feature.title}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.title}
                    secondary={feature.description}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 'auto' }}
            >
              Upgrade Now
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Free Plan
            </Typography>
            <Typography variant="h3" color="text.secondary" gutterBottom>
              $0
              <Typography component="span" variant="subtitle1" color="text.secondary">
                /month
              </Typography>
            </Typography>
            <List sx={{ width: '100%', mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="24-hour Expiration"
                  secondary="Standard temporary email expiration"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Basic Features"
                  secondary="Essential temporary email functionality"
                />
              </ListItem>
            </List>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{ mt: 'auto' }}
            >
              Current Plan
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Why Choose Premium?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Premium; 