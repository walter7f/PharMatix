import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Primary Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100" />
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="pharmaceutical-grid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <rect x="8" y="8" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pharmaceutical-grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full blur-lg animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-success/5 rounded-full blur-2xl animate-pulse delay-2000" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-warning/5 rounded-full blur-xl animate-pulse delay-3000" />

      {/* Molecular Structure Overlay */}
      <div className="absolute inset-0 opacity-3">
        <svg
          className="absolute top-1/4 left-1/4 w-64 h-64 text-primary"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <circle cx="150" cy="50" r="4" fill="currentColor" />
          <circle cx="100" cy="100" r="4" fill="currentColor" />
          <circle cx="50" cy="150" r="4" fill="currentColor" />
          <circle cx="150" cy="150" r="4" fill="currentColor" />
          
          <line x1="50" y1="50" x2="150" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="150" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="50" y2="150" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="150" y2="150" stroke="currentColor" strokeWidth="1" />
        </svg>

        <svg
          className="absolute bottom-1/4 right-1/4 w-48 h-48 text-accent"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="75" cy="25" r="3" fill="currentColor" />
          <circle cx="125" cy="75" r="3" fill="currentColor" />
          <circle cx="75" cy="125" r="3" fill="currentColor" />
          <circle cx="25" cy="75" r="3" fill="currentColor" />
          <circle cx="75" cy="75" r="3" fill="currentColor" />
          
          <line x1="75" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="75" x2="125" y2="75" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="75" x2="75" y2="125" stroke="currentColor" strokeWidth="1" />
          <line x1="75" y1="75" x2="25" y2="75" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundPattern;