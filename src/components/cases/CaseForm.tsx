import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Case } from '../../types';

interface CaseFormProps {
  onSubmit: (data: Partial<Case>) => void;
  initialData?: Partial<Case>;
  isLoading?: boolean;
}

export const CaseForm: React.FC<CaseFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Case>>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('number', { required: 'Case number is required' })}
            label="Case Number"
            fullWidth
            error={!!errors.number}
            helperText={errors.number?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('court', { required: 'Court is required' })}
            label="Court"
            fullWidth
            error={!!errors.court}
            helperText={errors.court?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('type', { required: 'Type is required' })}
            label="Type"
            fullWidth
            error={!!errors.type}
            helperText={errors.type?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('status')}
            select
            label="Status"
            fullWidth
            defaultValue="pending"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('description')}
            label="Description"
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Saving...' : 'Save Case'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};