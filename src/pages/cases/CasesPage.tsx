import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Plus } from 'lucide-react';
import { CaseList } from '../../components/cases/CaseList';
import { useNavigate } from 'react-router-dom';

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Legal Cases
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={20} />}
          onClick={() => navigate('/cases/new')}
        >
          New Case
        </Button>
      </Box>
      <CaseList />
    </div>
  );
};