import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/users/[id]/edit/page';
import userEvent from '@testing-library/user-event';
import { wrapper } from '@/utils/wrapper';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    id: '1',
  }),
}));

jest.spyOn(window, 'alert').mockImplementation(() => {});

jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(() => ({
    data: { name: 'João da Silva', email: 'joao@email.com' },
    isLoading: false,
    error: null,
  })),
}));

jest.mock('@/hooks/useUpdateUser', () => ({
  useUpdateUser: () => ({
    mutate: jest.fn((data, { onSuccess, onError }) => {
      if (data.email === 'error@email.com') {
        onError?.();
      } else {
        onSuccess?.();
      }
    }),
    isPending: false,
  }),
}));

describe('UpdateUserPage', () => {
  it('should update user successfully', async () => {
    render(<Page />, { wrapper });

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'João Atualizado');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'joao.atualizado@email.com');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/users');
    });
  });

  it('should validate required inputs', async () => {
    render(<Page />, { wrapper });

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.clear(nameInput);
    await userEvent.clear(emailInput);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should show error when API fails', async () => {
    render(<Page />, { wrapper: wrapper });

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(nameInput, 'João Atualizado');
    await userEvent.type(emailInput, 'error@email.com');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao atualizar usuário.');
    });
  });
});