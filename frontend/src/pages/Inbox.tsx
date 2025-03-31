import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';

interface Email {
  id: number;
  sender: string;
  subject: string;
  body: string;
  html_body: string | null;
  received_at: string;
}

const Inbox = () => {
  const { emailAddress } = useParams<{ emailAddress: string }>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/email/${emailAddress}/messages`
        );
        setEmails(response.data);
      } catch (err) {
        setError('Failed to fetch emails. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (emailAddress) {
      fetchEmails();
      // Poll for new emails every 30 seconds
      const interval = setInterval(fetchEmails, 30000);
      return () => clearInterval(interval);
    }
  }, [emailAddress]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inbox: {emailAddress}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <List>
              {emails.map((email) => (
                <React.Fragment key={email.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedEmail?.id === email.id}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <ListItemText
                        primary={email.subject}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {email.sender}
                            </Typography>
                            {' — '}
                            {new Date(email.received_at).toLocaleString()}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {emails.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No emails yet"
                    secondary="Emails sent to this address will appear here"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {selectedEmail ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedEmail.subject}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  From: {selectedEmail.sender}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {new Date(selectedEmail.received_at).toLocaleString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {selectedEmail.html_body ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html_body }}
                  />
                ) : (
                  <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedEmail.body}
                  </Typography>
                )}
              </>
            ) : (
              <Typography color="text.secondary" align="center">
                Select an email to view its contents
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Inbox; 