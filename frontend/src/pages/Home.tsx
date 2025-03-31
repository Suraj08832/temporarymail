import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateEmail = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/email/create`);
      setEmailAddress(response.data.address);
      navigate(`/inbox/${response.data.address}`);
    } catch (err) {
      setError('Failed to generate email address. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    if (emailAddress) {
      try {
        await navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError('Failed to copy email address to clipboard.');
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Temporary Email Service
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate a disposable email address to protect your privacy
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Your Temporary Email"
              value={emailAddress || ''}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={copyToClipboard}
              disabled={!emailAddress}
            >
              {copied ? 'Copied!' : 'Copy Email'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={generateEmail}
          disabled={!!emailAddress}
        >
          Generate New Email
        </Button>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Instant Generation
              </Typography>
              <Typography>
                Create a temporary email address instantly with just one click
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Secure & Private
              </Typography>
              <Typography>
                Your temporary email is completely private and secure
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Auto-Expiration
              </Typography>
              <Typography>
                Emails automatically expire after 24 hours
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 