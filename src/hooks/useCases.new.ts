// TODO: Implementar caseService antes de usar este hook
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { caseService } from '../services/caseService';

export const useCases = () => {
  // Implementação temporária até o caseService ser criado
  return {
    cases: [],
    isLoading: false,
    error: null,
    createCase: () => {},
    updateCase: () => {},
    deleteCase: () => {},
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  };
};
