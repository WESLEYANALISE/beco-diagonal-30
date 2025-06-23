
import React from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';

interface GreetingProps {
  userName?: string;
}

export const Greeting = ({ userName }: GreetingProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Bom dia',
        icon: Sun,
        color: 'text-yellow-500'
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        text: 'Boa tarde',
        icon: Sun,
        color: 'text-orange-500'
      };
    } else {
      return {
        text: 'Boa noite',
        icon: Moon,
        color: 'text-blue-400'
      };
    }
  };

  const greeting = getGreeting();
  const IconComponent = greeting.icon;

  if (!userName) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 animate-fade-in">
      <IconComponent className={`w-4 h-4 ${greeting.color}`} />
      <span className="text-white text-sm font-medium">
        {greeting.text}, {userName}!
      </span>
    </div>
  );
};
