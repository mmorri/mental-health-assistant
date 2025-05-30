import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

test('renders form and handles input', () => {
  render(<App />);
  expect(screen.getByLabelText(/describe the patient challenge/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/describe the patient challenge/i), { target: { value: 'Test challenge' } });
  expect(screen.getByDisplayValue('Test challenge')).toBeInTheDocument();
});
