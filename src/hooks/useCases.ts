import { useQuery, useMutation, useQueryClient } from 'react-query';
import { caseService } from '../services/api';
import { Case } from '../types/models';

export const useCases = () => {
  const queryClient = useQueryClient();

  const casesQuery = useQuery<Case[]>('cases', caseService.getCases);

  const createCaseMutation = useMutation(caseService.createCase, {
    onSuccess: () => {
      queryClient.invalidateQueries('cases');
    },
  });

  const updateCaseMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Case> }) =>
      caseService.updateCase(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cases');
      },
    }
  );

  const deleteCaseMutation = useMutation(caseService.deleteCase, {
    onSuccess: () => {
      queryClient.invalidateQueries('cases');
    },
  });

  return {
    cases: casesQuery.data || [],
    isLoading: casesQuery.isLoading,
    error: casesQuery.error,
    createCase: createCaseMutation.mutate,
    updateCase: updateCaseMutation.mutate,
    deleteCase: deleteCaseMutation.mutate,
    isCreating: createCaseMutation.isLoading,
    isUpdating: updateCaseMutation.isLoading,
    isDeleting: deleteCaseMutation.isLoading,
  };
};