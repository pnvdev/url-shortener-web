import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  // Create stable instances to avoid infinite re-renders
  const mockSearchParams = new URLSearchParams();
  return {
    ...actual,
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    })),
    useSearchParams: jest.fn(() => mockSearchParams),
    usePathname: jest.fn(() => '/'),
    useParams: jest.fn(() => ({})),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
});

// Suppress specific console errors in tests
const originalError = console.error;
const originalWarn = console.warn;

global.console = {
  ...console,
  error: jest.fn((...args) => {
    const message = args[0]?.toString() || '';
    // Suppress JSDOM navigation warnings and React act() warnings
    if (message.includes('Not implemented: navigation') || 
        message.includes('not wrapped in act')) {
      return;
    }
    originalError.call(console, ...args);
  }),
  warn: jest.fn((...args) => {
    const message = args[0]?.toString() || '';
    // Suppress specific warnings if needed
    if (message.includes('Not implemented')) {
      return;
    }
    originalWarn.call(console, ...args);
  }),
};
