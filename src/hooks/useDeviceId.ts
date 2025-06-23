
import { useState, useEffect } from 'react';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    // Gerar ou recuperar device ID único
    let storedDeviceId = localStorage.getItem('device-id');
    
    if (!storedDeviceId) {
      // Gerar ID único baseado em características do dispositivo
      const userAgent = navigator.userAgent;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      
      const fingerprint = btoa(`${userAgent}-${screenResolution}-${timezone}-${language}-${Date.now()}`);
      storedDeviceId = fingerprint.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      localStorage.setItem('device-id', storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);
  }, []);

  return deviceId;
};
