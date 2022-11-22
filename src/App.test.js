import { render, screen } from '@testing-library/react';
import {BrowserRouter, MemoryRouter} from 'react-router-dom'
import App from './App';

test('renders learn react link', () => {
  render(<App />, {wrapper: MemoryRouter});
  const linkElement = screen.getByText(/Nimbus/i);
  expect(linkElement).toBeInTheDocument();
});
