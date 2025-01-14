import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { caseService } from '../../services/api';
import { Case } from '../../types';

const columns: GridColDef[] = [
  { field: 'number', headerName: 'Case Number', width: 150 },
  { field: 'court', headerName: 'Court', width: 200 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString();
    },
  },
];

export const CaseList: React.FC = () => {
  const { data: cases, isLoading } = useQuery<Case[]>('cases', caseService.getCases);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={cases || []}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </div>
  );
};