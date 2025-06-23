
import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  hasSeenTutorial: boolean;
  deviceId: string;
}

export const useTutorialAndUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Gerar um ID único para o dispositivo
  const generateDeviceId = () => {
    return 'device_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  // Carregar dados do usuário
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
        setShowTutorial(!parsed.hasSeenTutorial);
      } else {
        // Primeiro acesso - mostrar tutorial
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setShowTutorial(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Completar tutorial
  const completeTutorial = (userName: string) => {
    const newUserData: UserData = {
      name: userName,
      hasSeenTutorial: true,
      deviceId: generateDeviceId()
    };
    
    setUserData(newUserData);
    setShowTutorial(false);
    
    try {
      localStorage.setItem('user_data', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  // Pular tutorial
  const skipTutorial = () => {
    const newUserData: UserData = {
      name: '',
      hasSeenTutorial: true,
      deviceId: generateDeviceId()
    };
    
    setUserData(newUserData);
    setShowTutorial(false);
    
    try {
      localStorage.setItem('user_data', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  return {
    userData,
    showTutorial,
    isLoading,
    completeTutorial,
    skipTutorial
  };
};
