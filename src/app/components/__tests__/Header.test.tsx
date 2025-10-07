import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the header with correct title', () => {
    render(<Header />);
    
    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
  });

  it('renders the Create URL button', () => {
    render(<Header />);
    
    const createButton = screen.getByText('Create URL');
    expect(createButton).toBeInTheDocument();
    expect(createButton.closest('a')).toHaveAttribute('href', '/create');
  });

  it('has correct styling classes', () => {
    const { container } = render(<Header />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800');
  });
});
