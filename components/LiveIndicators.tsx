import React, { useState, useEffect } from 'react';

interface LiveIndicatorsProps {
  className?: string;
}

interface VisitorStats {
  currentViewers: number;
  totalVisits: number;
}

export function LiveIndicators({ className = '' }: LiveIndicatorsProps): React.ReactNode {
  const [currentViewers, setCurrentViewers] = useState<number>(0);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [visitorId] = useState<string>(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const fetchStats = async (action: string = 'stats', retries = 3): Promise<VisitorStats | null> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const baseUrl = window.location.origin;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const response = await fetch(`${baseUrl}/api/visitors?action=${action}&visitorId=${visitorId}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setIsConnected(true);
          setLastUpdate(Date.now());
          return await response.json();
        }
      } catch (error) {
        if (attempt === retries - 1) {
          console.warn('Failed to fetch visitor stats after retries:', error);
          setIsConnected(false);
        }
        // Wait before retry (exponential backoff)
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    return null;
  };

  useEffect(() => {
    let pingInterval: NodeJS.Timeout;
    let statsInterval: NodeJS.Timeout;

    const init = async () => {
      // Join as a new visitor
      const stats = await fetchStats('join');
      if (stats) {
        setCurrentViewers(stats.currentViewers);
        setTotalVisits(stats.totalVisits);
      }

      // Ping every 20 seconds to maintain presence
      pingInterval = setInterval(async () => {
        await fetchStats('ping');
      }, 20000);

      // Update stats every 2 seconds for faster updates
      statsInterval = setInterval(async () => {
        const stats = await fetchStats('stats');
        if (stats) {
          setCurrentViewers(stats.currentViewers);
          setTotalVisits(stats.totalVisits);
        }
      }, 2000);
    };

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        fetchStats('leave');
      } else {
        fetchStats('join');
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      fetchStats('leave');
    };

    init();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(pingInterval);
      clearInterval(statsInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      fetchStats('leave');
    };
  }, [visitorId]);

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {/* Current Viewers Indicator */}
      <div className={`bg-black/80 backdrop-blur-sm border rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg transition-all duration-300 ${
        isConnected ? 'border-green-500/30' : 'border-red-500/30'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isConnected 
            ? 'bg-green-500 animate-pulse' 
            : 'bg-red-500 animate-ping'
        }`}></div>
        <span className={`text-sm font-medium ${
          isConnected ? 'text-green-400' : 'text-red-400'
        }`}>
          {currentViewers} online
        </span>
        {!isConnected && (
          <span className="text-xs text-red-300">•</span>
        )}
      </div>

      {/* Total Visits Indicator */}
      <div className="bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-blue-400 text-sm font-medium">
          {totalVisits.toLocaleString()} visits
        </span>
      </div>

      {/* Connection Status (when disconnected) */}
      {!isConnected && (
        <div className="bg-red-900/80 backdrop-blur-sm border border-red-500/30 rounded-lg px-2 py-1">
          <span className="text-red-300 text-xs">
            Reconnecting...
          </span>
        </div>
      )}
    </div>
  );
}
