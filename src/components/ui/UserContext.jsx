import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const UserContext = ({ isCollapsed = false }) => {
  const [user, setUser] = useState({
    name: 'Dr. Sarah Chen',
    role: 'Quality Manager',
    initials: 'SC',
    sessionStatus: 'active',
    lastActivity: new Date()
  });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 0) {
          // Handle session timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
    setShowDropdown(false);
  };

  const handleExtendSession = () => {
    setSessionTimeLeft(1800); // Reset to 30 minutes
    setShowDropdown(false);
  };

  const getSessionStatusColor = () => {
    if (sessionTimeLeft <= 300) return 'text-error'; // 5 minutes or less
    if (sessionTimeLeft <= 600) return 'text-warning'; // 10 minutes or less
    return 'text-success';
  };

  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          title={`${user?.name} - ${user?.role}`}
        >
          {user?.initials}
        </button>
        {showDropdown && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-border rounded-lg shadow-modal z-50">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-popover-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-muted-foreground">Session expires in:</span>
                <span className={`font-mono font-medium ${getSessionStatusColor()}`}>
                  {formatTimeLeft(sessionTimeLeft)}
                </span>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={handleExtendSession}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="Clock" size={14} />
                  <span>Extend Session</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="LogOut" size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors duration-200 group"
      >
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          {user?.initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className="text-muted-foreground group-hover:text-foreground transition-colors duration-200" 
        />
      </button>
      {showDropdown && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-popover border border-border rounded-lg shadow-modal z-50">
          <div className="p-3">
            <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-border">
              <span className="text-muted-foreground">Session expires in:</span>
              <span className={`font-mono font-medium ${getSessionStatusColor()}`}>
                {formatTimeLeft(sessionTimeLeft)}
              </span>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={handleExtendSession}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
              >
                <Icon name="Clock" size={14} />
                <span>Extend Session</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
              >
                <Icon name="LogOut" size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContext;