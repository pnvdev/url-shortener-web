// Mock fetch before importing the route
global.fetch = jest.fn();

// Mock NextRequest properly
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}));

describe('API Route: /api/short-urls', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('successfully creates a short URL', async () => {
    const mockResponse = {
      short_code: 'abc123',
      original_url: 'https://example.com',
      short_url: 'http://short.url/abc123',
      created_at: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    // Dynamically import after mocks are set up
    const { POST } = await import('../route');

    const request = {
      json: async () => ({ url: 'https://example.com' }),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://18.116.202.212/api/short-urls',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
        },
      })
    );

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    });

    const { POST } = await import('../route');

    const request = {
      json: async () => ({ url: 'https://example.com' }),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { POST } = await import('../route');

    const request = {
      json: async () => ({ url: 'https://example.com' }),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to create short URL' });
  });

  it('forwards request body correctly', async () => {
    const testUrl = 'https://test-example.com/very/long/url';
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ short_code: 'test' }),
    });

    const { POST } = await import('../route');

    const request = {
      json: async () => ({ url: testUrl }),
    } as any;

    await POST(request);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    
    expect(requestBody).toEqual({ url: testUrl });
  });
});
