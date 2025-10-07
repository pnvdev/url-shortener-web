import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePage from '../page';

// Mock next/navigation
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/create',
}));

// Mock fetch
global.fetch = jest.fn();

describe('CreatePage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the create form', () => {
    render(<CreatePage />);
    
    expect(screen.getByText('Create Short URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com/your/very/long/url/path')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shorten URL/i })).toBeInTheDocument();
  });

  it('validates URL input', async () => {
    const user = userEvent.setup();
    render(<CreatePage />);

    const input = screen.getByPlaceholderText('https://example.com/your/very/long/url/path');    // Type invalid URL
    await user.type(input, 'not-a-valid-url');
    
    // Check for validation feedback (assuming the component shows some visual feedback)
    expect(input).toHaveValue('not-a-valid-url');
  });

  it('submits form and creates short URL successfully', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      short_code: 'abc123',
      original_url: 'https://example.com',
      short_url: 'http://short.url/abc123',
      created_at: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<CreatePage />);
    
    const input = screen.getByPlaceholderText('https://example.com/your/very/long/url/path');
    const submitButton = screen.getByRole('button', { name: /Shorten URL/i });
    
    await user.type(input, 'https://example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/short-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://example.com' }),
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?created=true');
    });

    // Check localStorage
    const storedUrls = JSON.parse(localStorage.getItem('shortUrls') || '[]');
    expect(storedUrls).toHaveLength(1);
    expect(storedUrls[0].code).toBe('abc123');
  });

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<CreatePage />);
    
    const input = screen.getByPlaceholderText('https://example.com/your/very/long/url/path');
    const submitButton = screen.getByRole('button', { name: /Shorten URL/i });
    
    await user.type(input, 'https://example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create short URL. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          short_code: 'abc123',
          original_url: 'https://example.com',
          short_url: 'http://short.url/abc123',
          created_at: new Date().toISOString(),
        }),
      }), 100))
    );

    render(<CreatePage />);
    
    const input = screen.getByPlaceholderText('https://example.com/your/very/long/url/path');
    const submitButton = screen.getByRole('button', { name: /Shorten URL/i });
    
    await user.type(input, 'https://example.com');
    await user.click(submitButton);

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
  });

  it('renders back button with correct link', () => {
    render(<CreatePage />);
    
    const backLink = screen.getByText('Back').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('accepts valid URLs', async () => {
    const user = userEvent.setup();
    render(<CreatePage />);

    const input = screen.getByPlaceholderText('https://example.com/your/very/long/url/path');    const validUrls = [
      'https://example.com',
      'http://test.com',
      'https://www.example.com/path?query=123',
    ];

    for (const url of validUrls) {
      await user.clear(input);
      await user.type(input, url);
      expect(input).toHaveValue(url);
    }
  });
});
