import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type CreateUserDTO = {
  name: string;
  email: string;
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      const response = await api.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}
