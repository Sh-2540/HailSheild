import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db } from './services/storage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KhetKavach App Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      db.resetToDefaults();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center p-6 text-stone-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-emerald-200 shadow-sm p-1 bg-white">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_8.59.20_AM_bf57edc3.jpeg"
                alt="KhetKavach Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-emerald-950">
                KhetKavach – HailShield
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Protection for Every Harvest
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-900 p-3.5 rounded-xl text-xs border border-emerald-100 text-left">
              <p className="font-semibold text-emerald-950 mb-1">
                Field System Recovery
              </p>
              <p className="text-stone-600">
                The application encountered a temporary display issue. Click below to restore normal monitoring operations.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              Restore & Reload System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
