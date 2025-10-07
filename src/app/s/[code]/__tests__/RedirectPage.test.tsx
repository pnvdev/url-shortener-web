import { render, screen, act } from '@testing-library/react';
import RedirectPage from '../page';

// Mock next/navigation
const mockParams = { code: 'abc123' };

jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
}));

describe('RedirectPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders redirecting message', () => {
    render(<RedirectPage />);
    
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  it('displays the wait message', () => {
    render(<RedirectPage />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    const { container } = render(<RedirectPage />);
    
    // Progress bar is a div with width style
    const progressBar = container.querySelector('.h-full.bg-gray-900');
    expect(progressBar).toBeInTheDocument();
  });

  it('redirects after timeout', () => {
    // Mock window.location.href setter
    delete (window as unknown as { location: unknown }).location;
    (window as unknown as { location: { href: string } }).location = { href: '' };

    render(<RedirectPage />);
    
    jest.advanceTimersByTime(1500);
    
    expect(window.location.href).toBe('http://18.116.202.212/s/abc123');
  });

  it('animates progress bar over time', () => {
    const { container } = render(<RedirectPage />);
    
    // Initially progress should be 0
    const progressBar = container.querySelector('.h-full.bg-gray-900') as HTMLElement;
    expect(progressBar).toBeInTheDocument();
    expect(progressBar?.style.width).toBe('0%');
    
    // Progress should increase after some time
    act(() => {
      jest.advanceTimersByTime(300); // Allow enough time for several intervals  
    });
    
    const widthValue = parseInt(progressBar?.style.width || '0%');
    expect(widthValue).toBeGreaterThan(0); // Just verify progress is happening
    expect(widthValue).toBeLessThanOrEqual(100); // But not complete yet
  });

  it('uses correct redirect URL with code from params', () => {
    delete (window as unknown as { location: unknown }).location;
    (window as unknown as { location: { href: string } }).location = { href: '' };

    const testCode = 'test123';
    mockParams.code = testCode;

    render(<RedirectPage />);
    
    jest.advanceTimersByTime(1500);
    
    expect(window.location.href).toBe(`http://18.116.202.212/s/${testCode}`);

    mockParams.code = 'abc123'; // Reset
  });
});
