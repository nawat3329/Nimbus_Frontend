import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import {configure} from '@testing-library/dom'
import App from './App';



const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  }
}

test('render home page', async () => {
  render(<App />, { wrapper: BrowserRouter });
  const linkElement = screen.getByText(/Nimbus/i);
  await waitFor(() => expect(linkElement).toBeInTheDocument());
  const getInput = screen.getByPlaceholderText('Write Something!');
  await waitFor(() => expect(getInput).toBeInTheDocument());
});

test('go to login page', async () => {
  render(<App />, { wrapper: BrowserRouter });
  const loginA = screen.getByText('Login').closest('a');
  await waitFor(() => expect(loginA).toHaveAttribute('href'));
  fireEvent.click(loginA);
  const loginButton = screen.getByRole('button', {
    name: /Login/i,
  });
  await waitFor(() => expect(loginButton).toBeInTheDocument());
});

const login = async (container) => {
  const inputEl = container.querySelector(`input[name="username"]`);
  const passwordEl = container.querySelector(`input[name="password"]`);
  fireEvent.change(inputEl, { target: { value: 'JestTest' } });
  fireEvent.change(passwordEl, { target: { value: 'JestTest' } });
  const loginButton = screen.getByRole('button', {
    name: /Login/i,
  });
  fireEvent.click(loginButton);
}

test('login', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  await waitFor(() => expect(screen.getByText(/JestTest/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText(/Setting/i)).toBeInTheDocument());
});

test('post', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  const homeA = screen.getByText('Home').closest('a');
  fireEvent.click(homeA);
  const getInput = screen.getByPlaceholderText('Write Something!');
  fireEvent.change(getInput, { target: { value: 'Hello from Testing Library Jest!' } });
  const postButton = screen.getByRole('button', {
    name: /Publish/i,
  });
  fireEvent.click(postButton);
  await waitFor(() => expect(getInput).not.toBe("Hello from Testing Library Jest!"));
});

test('check post exist', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  await waitFor(() => expect(screen.getByText(/Hello from Testing Library Jest!/i)).toBeInTheDocument());
});

test('delete post', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  await waitFor(() => expect(screen.getByText(/Hello from Testing Library Jest!/i)).toBeInTheDocument());
  const deleteButton =  await waitFor(() => screen.getByRole('button', {
    name: /Delete/i,
  }));
  fireEvent.click(deleteButton);
});

test('check post is now deleted', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  expect(screen.queryByText(/Hello from Testing Library Jest!/i)).not.toBeInTheDocument();
});

test('logout', async () => {
  const { container } = renderWithRouter(<App />, { route: '/login' })
  await login(container)
  const logoutA = screen.getByText('LogOut').closest('a');
  fireEvent.click(logoutA);
  expect(screen.queryByText(/JestTest/i)).not.toBeInTheDocument();
});


