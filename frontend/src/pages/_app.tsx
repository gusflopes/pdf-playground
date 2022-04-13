import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Add classes to HTML and Body
    document.querySelector('html')?.classList.add('h-full');
    document.querySelector('html')?.classList.add('bg-gray-100');
    document.querySelector('body')?.classList.add('h-full');
  }, []);

  return (
    // <div className="h-full bg-gray-100">
    // <div className="h-full">
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    // </div>
    // </div>
  );
}

export default MyApp;
