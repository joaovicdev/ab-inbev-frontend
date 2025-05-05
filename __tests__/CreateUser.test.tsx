import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateUserPage from '../app/users/new/page';
import userEvent from '@testing-library/user-event';
import { wrapper } from '@/utils/wrapper';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
jest.spyOn(window, 'alert').mockImplementation(() => {});
jest.mock('@/hooks/useCreateUser', () => ({
  useCreateUser: () => ({
    mutate: jest.fn((data, { onSuccess, onError }) => {
      if (data.email === 'existing@email.com') {
        const error = {
          response: {
            status: 409,
          },
        };
        onError?.(error);
      } else {
        onSuccess?.();
      }
    }),
    isPending: false,
  }),
}));

describe('CreateUserPage', () => {
  it('should create user', async () => {
    render(<CreateUserPage />, { wrapper: wrapper });
  
    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit-button');
  
    await userEvent.type(nameInput, 'João da Silva');
    await userEvent.type(emailInput, 'joao@email.com');
  
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/users');
    });
  });

  it('should validate required inputs', async () => {
    render(<CreateUserPage />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should try create user that alredy exists', async () => {
    render(<CreateUserPage />, { wrapper });

    const nameInput = screen.getByTestId('name');
    const emailInput = screen.getByTestId('email');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(nameInput, 'João da Silva');
    await userEvent.type(emailInput, 'existing@email.com');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Este e-mail já está em uso.');
    });
  });
});
