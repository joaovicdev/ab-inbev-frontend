'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
});

type UserFormData = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const createUser = useCreateUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => router.push('/users'),
      onError: (error) => {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 409) {
          alert('Este e-mail já está em uso.');
        }
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criar Usuário</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium" htmlFor="name">Nome</label>
          <input
            data-testid="name"
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium" htmlFor="email">Email</label>
          <input
            data-testid="email"
            type="email"
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
          disabled={createUser.isPending}
        >
          {createUser.isPending ? 'Salvando...' : 'Salvar'}
        </button>
        <Link href="/users" className="ml-4 text-white hover:underline">
          Voltar
        </Link>
      </form>
    </div>
  );
}
