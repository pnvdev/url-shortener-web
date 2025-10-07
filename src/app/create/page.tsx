'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';

export default function CreatePage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  const createShortUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/short-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to create short URL');
      }

      const data = await response.json();
      
      // Save to localStorage
      const stored = localStorage.getItem('shortUrls');
      const shortUrls = stored ? JSON.parse(stored) : [];
      
      const newUrl = {
        id: shortUrls.length + 1,
        code: data.short_code,
        original_url: data.original_url,
        short_url: data.short_url,
        created_at: data.created_at
      };
      
      shortUrls.push(newUrl);
      localStorage.setItem('shortUrls', JSON.stringify(shortUrls));
      
      // Redirect to home page with success message
      router.push('/?created=true');
    } catch (err) {
      setError('Failed to create short URL. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (input: string) => {
    try {
      new URL(input);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (value) {
      validateUrl(value);
    } else {
      setIsValidUrl(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
        </div>

        {/* Create Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Create Short URL</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter a URL to shorten</p>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={createShortUrl} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL to shorten
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/your/very/long/url/path"
                  required
                  className={`w-full px-3 py-2 border rounded text-sm transition-colors dark:bg-gray-700 dark:text-white ${
                    !isValidUrl && url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                />
                {!isValidUrl && url && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    Please enter a valid URL (must start with http:// or https://)
                  </p>
                )}
              </div>
              
              {error && (
                <div className="p-3 bg-white dark:bg-gray-800 border border-red-500 rounded text-sm">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || !isValidUrl}
                className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white dark:text-black font-medium py-2 px-4 rounded transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-black border-t-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Shorten URL</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
