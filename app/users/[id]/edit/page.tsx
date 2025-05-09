'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

type UserFormData = z.infer<typeof userSchema>;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoading, error, data } = useUser(id);
  const updateUser = useUpdateUser(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (formData: UserFormData) => {
    updateUser.mutate(formData, {
      onSuccess: () => router.push('/users'),
      onError: () => alert('Erro ao atualizar usuário.'),
    });
  };

  if (isLoading) return <p>Carregando usuário...</p>;
  if (error) return <p>Erro ao carregar dados.</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Usuário</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Nome</label>
          <input
            type="text"
            value={data.name}
            data-testid="name"
            {...register('name')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={data.email}
            data-testid="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          data-testid="submit-button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={updateUser.isPending}
        >
          {updateUser.isPending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <Link href="/users" className="ml-4 text-white hover:underline">
          Voltar
        </Link>
      </form>
    </div>
  );
}
