'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from './components/Header';

type ShortUrl = {
  id: number;
  code: string;
  original_url: string;
  short_url: string;
  created_at: string;
};

export default function Home() {
  const searchParams = useSearchParams();
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load URLs from localStorage on mount and when window regains focus
  useEffect(() => {
    const loadUrls = () => {
      const stored = localStorage.getItem('shortUrls');
      if (stored) {
        try {
          setShortUrls(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading URLs from localStorage:', error);
          localStorage.removeItem('shortUrls');
        }
      }
      setIsLoaded(true);
    };

    // Load on mount
    loadUrls();

    // Show success message if coming from create page
    if (searchParams.get('created') === 'true') {
      showToast('Short URL created successfully!');
      // Clean up URL parameter
      window.history.replaceState({}, '', '/');
    }

    // Reload when user navigates back to this page
    window.addEventListener('focus', loadUrls);
    
    return () => {
      window.removeEventListener('focus', loadUrls);
    };
  }, [searchParams]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteUrl = (code: string) => {
    const updated = shortUrls.filter(item => item.code !== code);
    setShortUrls(updated);
    // Update localStorage
    if (updated.length === 0) {
      localStorage.removeItem('shortUrls');
    } else {
      localStorage.setItem('shortUrls', JSON.stringify(updated));
    }
    showToast('URL deleted successfully');
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all shortened URLs?')) {
      setShortUrls([]);
      localStorage.removeItem('shortUrls');
      showToast('All URLs cleared');
    }
  };

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast('Short URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy URL', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-3 rounded border ${
            toast.type === 'success' 
              ? 'bg-white dark:bg-gray-800 border-green-500 text-gray-900 dark:text-white' 
              : 'bg-white dark:bg-gray-800 border-red-500 text-gray-900 dark:text-white'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Shortened URLs list */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My URLs</h2>
                {isLoaded && shortUrls.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({shortUrls.length})
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {shortUrls.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Clear all URLs"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
          
            {!isLoaded ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : shortUrls.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No URLs yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create your first shortened URL</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm font-medium rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create URL</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Code</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Original URL</th>
                      <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {shortUrls.map((item, index) => (
                      <tr key={item.code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-6">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {item.code}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <div className="max-w-md">
                            <p className="text-sm text-gray-900 dark:text-white truncate mb-0.5" title={item.original_url}>
                              {item.original_url}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => copyToClipboard(item.short_url)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                              title="Copy short URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <Link
                              href={`/s/${item.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                              title="Test redirect"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => deleteUrl(item.code)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
