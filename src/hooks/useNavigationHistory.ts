import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationHistoryItem {
  path: string;
  title: string;
  timestamp: number;
}

export const useNavigationHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('navigation-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading navigation history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('navigation-history', JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = useCallback((path: string, title: string) => {
    setHistory(prev => {
      const newItem: NavigationHistoryItem = {
        path,
        title,
        timestamp: Date.now()
      };
      
      // Remove duplicates and keep only last 10 items
      const filtered = prev.filter(item => item.path !== path).slice(-9);
      return [...filtered, newItem];
    });
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const previousItem = history[history.length - 2];
      setHistory(prev => prev.slice(0, -1));
      navigate(previousItem.path);
    } else {
      navigate('/');
    }
  }, [history, navigate]);

  const goHome = useCallback(() => {
    setHistory([]);
    navigate('/');
  }, [navigate]);

  const getCurrentPath = useCallback(() => {
    return location.pathname;
  }, [location.pathname]);

  return {
    history,
    addToHistory,
    goBack,
    goHome,
    getCurrentPath,
    canGoBack: history.length > 1
  };
};
