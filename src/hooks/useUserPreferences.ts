
import { useState, useEffect } from 'react';
import { useDeviceId } from './useDeviceId';

interface UserPreferences {
  userName: string;
  firstVisit: boolean;
  tutorialCompleted: boolean;
  lastVisit: string;
}

export const useUserPreferences = () => {
  const deviceId = useDeviceId();
  const [preferences, setPreferences] = useState<UserPreferences>({
    userName: '',
    firstVisit: true,
    tutorialCompleted: false,
    lastVisit: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;
    
    loadPreferences();
  }, [deviceId]);

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(`user-preferences-${deviceId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          ...parsed,
          firstVisit: false
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem(`user-preferences-${deviceId}`, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = preferences.userName || 'visitante';
    
    if (hour < 12) return `Bom dia, ${name}!`;
    if (hour < 18) return `Boa tarde, ${name}!`;
    return `Boa noite, ${name}!`;
  };

  return {
    preferences,
    updatePreferences,
    getGreeting,
    isLoading,
    deviceId
  };
};
