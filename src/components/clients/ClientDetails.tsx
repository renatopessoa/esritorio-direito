import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { User, Case } from '../../types';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ClientDetailsProps {
  client: User;
  cases?: Case[];
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client, cases }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              {client.name}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Mail size={20} />
              <Typography>{client.email}</Typography>
            </Box>
            
            {client.phone && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Phone size={20} />
                <Typography>{client.phone}</Typography>
              </Box>
            )}
            
            {client.address && (
              <Box display="flex" alignItems="center" gap={1}>
                <MapPin size={20} />
                <Typography>{client.address}</Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>Active Cases</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {cases?.map(case_ => (
                <Chip
                  key={case_.id}
                  label={case_.number}
                  color={case_.status === 'active' ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};