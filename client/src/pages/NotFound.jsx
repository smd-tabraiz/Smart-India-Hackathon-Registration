import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="text-center bg-slate-950 border border-slate-800 p-8 rounded-2xl max-w-md shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">The page you are looking for does not exist or has been moved.</p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
