'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RedirectPage() {
  const params = useParams();
  const code = params.code as string;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 15);

    // Redirect to the backend URL after a brief moment
    const timer = setTimeout(() => {
      window.location.href = `http://18.116.202.212/s/${code}`;
    }, 1500); // 1.5 seconds delay

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title and Message */}
        <div className="mb-6 space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Redirecting...
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{code}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Redirecting Text */}
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Please wait...
        </p>
      </div>
    </div>
  );
}
