import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { CaseForm } from '../../components/cases/CaseForm';
import { caseService } from '../../services/api';
import { Case } from '../../types';

export const NewCasePage: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useMutation(caseService.createCase, {
    onSuccess: () => {
      navigate('/cases');
    },
  });

  const handleSubmit = (data: Partial<Case>) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        New Legal Case
      </Typography>
      <Paper sx={{ p: 4, mt: 4 }}>
        <CaseForm
          onSubmit={handleSubmit}
          isLoading={mutation.isLoading}
        />
      </Paper>
    </div>
  );
};