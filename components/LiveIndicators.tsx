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
  const [visitorId] = useState<string>(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const fetchStats = async (action: string = 'stats'): Promise<VisitorStats | null> => {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/visitors?action=${action}&visitorId=${visitorId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch visitor stats:', error);
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

      // Ping every 30 seconds to maintain presence
      pingInterval = setInterval(async () => {
        await fetchStats('ping');
      }, 30000);

      // Update stats every 5 seconds
      statsInterval = setInterval(async () => {
        const stats = await fetchStats('stats');
        if (stats) {
          setCurrentViewers(stats.currentViewers);
          setTotalVisits(stats.totalVisits);
        }
      }, 5000);
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
      <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-sm font-medium">
          {currentViewers} online
        </span>
      </div>

      {/* Total Visits Indicator */}
      <div className="bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-2 flex items-center space-x-2 shadow-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-blue-400 text-sm font-medium">
          {totalVisits.toLocaleString()} visits
        </span>
      </div>
    </div>
  );
}
