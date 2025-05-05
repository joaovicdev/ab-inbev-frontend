'use client';

import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { data: users, isLoading, error } = useUsers();
	const router = useRouter();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar usuários.</p>;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex">
				<h1 className="text-2xl font-bold mb-4">Usuários</h1>
				<Link href="/users/new" className="ml-2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
					+
				</Link>
			</div>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Email</th>
						<th className="px-4 py-2 border">Created at</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id} onClick={() => router.push(`/users/${user.id}/edit`)} className="hover:bg-gray-100 hover:text-black cursor-pointer">
              <td className="px-4 py-2 border text-center">{user.id}</td>
              <td className="px-4 py-2 border text-center">{user.name}</td>
              <td className="px-4 py-2 border text-center">{user.email}</td>
							<td className="px-4 py-2 border text-center">{new Date(user.createdAt).toLocaleString('pt-br')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
