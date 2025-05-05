import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type UpdateUserDTO = {
  name: string;
  email: string;
};

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserDTO) => {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', id],
      });
    },
  });
}
