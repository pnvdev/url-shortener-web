import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

describe('Home Page Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with suspense fallback and then content', async () => {
    render(<Home />);
    
    // Should show header
    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
    
    // Content should load - check for heading specifically
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My URLs' })).toBeInTheDocument();
    });
  });

  it('displays empty state initially', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('No URLs yet')).toBeInTheDocument();
    });
  });

  it('renders the header component', () => {
    render(<Home />);
    
    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
    expect(screen.getAllByText('Create URL').length).toBeGreaterThan(0);
  });
});
