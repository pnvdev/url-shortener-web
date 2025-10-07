import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Test utilities for URL Shortener application
 */

/**
 * Setup localStorage with mock URLs
 */
export const setupMockUrls = (count = 3) => {
  const mockUrls = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    code: `code${i + 1}`,
    original_url: `https://example${i + 1}.com`,
    short_url: `http://short.url/code${i + 1}`,
    created_at: new Date(Date.now() - i * 1000000).toISOString(),
  }));

  localStorage.setItem('shortUrls', JSON.stringify(mockUrls));
  return mockUrls;
};

/**
 * Clear all localStorage data
 */
export const clearMockStorage = () => {
  localStorage.clear();
};

/**
 * Setup mock fetch response
 */
export const mockFetchSuccess = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => data,
  });
};

/**
 * Setup mock fetch error
 */
export const mockFetchError = (status = 500, error = 'Internal server error') => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ error }),
  });
};

/**
 * Setup mock fetch network error
 */
export const mockFetchNetworkError = (message = 'Network error') => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(message));
};

/**
 * Wait for element to appear and return it
 */
export const waitForElement = async (text: string | RegExp) => {
  return await screen.findByText(text);
};

/**
 * Check if toast notification appears
 */
export const expectToast = (message: string) => {
  expect(screen.getByText(message)).toBeInTheDocument();
};

/**
 * Setup user event with realistic delays
 */
export const setupUser = () => {
  return userEvent.setup({ delay: null });
};

/**
 * Fill form input
 */
export const fillInput = async (placeholder: string, value: string) => {
  const user = setupUser();
  const input = screen.getByPlaceholderText(placeholder);
  await user.clear(input);
  await user.type(input, value);
  return input;
};

/**
 * Click button by text
 */
export const clickButton = async (text: string | RegExp) => {
  const user = setupUser();
  const button = screen.getByRole('button', { name: text });
  await user.click(button);
  return button;
};

/**
 * Mock clipboard API
 */
export const mockClipboard = () => {
  const writeText = jest.fn(() => Promise.resolve());
  Object.assign(navigator, {
    clipboard: {
      writeText,
      readText: jest.fn(() => Promise.resolve('')),
    },
  });
  return { writeText };
};

/**
 * Mock window.confirm
 */
export const mockConfirm = (returnValue = true) => {
  window.confirm = jest.fn(() => returnValue);
  return window.confirm;
};

/**
 * Mock window.location
 */
export const mockLocation = () => {
  const originalLocation = window.location;
  const windowWithLocation = window as { location?: Location };
  delete windowWithLocation.location;
  windowWithLocation.location = { ...originalLocation, href: '' } as Location;
  
  return () => {
    (window as { location?: Location }).location = originalLocation;
  };
};

/**
 * Get table rows
 */
export const getTableRows = () => {
  const table = screen.getByRole('table');
  const tbody = within(table).getAllByRole('rowgroup')[1];
  return within(tbody).getAllByRole('row');
};

/**
 * Assert URL in list
 */
export const assertUrlInList = (code: string, originalUrl: string) => {
  expect(screen.getByText(code)).toBeInTheDocument();
  expect(screen.getByText(originalUrl)).toBeInTheDocument();
};

/**
 * Assert URL not in list
 */
export const assertUrlNotInList = (code: string) => {
  expect(screen.queryByText(code)).not.toBeInTheDocument();
};

/**
 * Create mock short URL response
 */
export const createMockShortUrlResponse = (overrides = {}) => ({
  short_code: 'abc123',
  original_url: 'https://example.com',
  short_url: 'http://short.url/abc123',
  created_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Wait for loading to complete
 */
export const waitForLoading = async () => {
  const loadingElement = screen.queryByText('Loading...');
  if (loadingElement) {
    await screen.findByText(/./i, {}, { timeout: 3000 });
  }
};

/**
 * Assert empty state
 */
export const assertEmptyState = () => {
  expect(screen.getByText('No URLs yet')).toBeInTheDocument();
  expect(screen.getByText('Create your first shortened URL')).toBeInTheDocument();
};

/**
 * Assert loading state
 */
export const assertLoadingState = () => {
  expect(screen.getByText('Loading...')).toBeInTheDocument();
};
