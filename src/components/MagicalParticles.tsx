
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
  type: 'sparkle' | 'star' | 'glow' | 'float';
}

export const MagicalParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouseTrail, setMouseTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const particleColors = [
    'bg-magical-gold',
    'bg-magical-bronze', 
    'bg-magical-silver',
    'bg-magical-starlight',
    'bg-magical-emerald'
  ];

  const particleTypes: Particle['type'][] = ['sparkle', 'star', 'glow', 'float'];

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 4 + 2,
          delay: Math.random() * 3,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  // Mouse trail effect
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / window.innerWidth) * 100;
      const y = ((e.clientY - rect.top) / window.innerHeight) * 100;
      
      setMouseTrail(prev => {
        const newTrail = [...prev, { x, y, id: trailId++ }].slice(-5);
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clear mouse trail after inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setMouseTrail([]);
    }, 2000);
    return () => clearTimeout(timer);
  }, [mouseTrail]);

  const getParticleAnimation = (type: Particle['type']) => {
    switch (type) {
      case 'sparkle':
        return 'animate-sparkle';
      case 'star':
        return 'animate-magical-glow';
      case 'glow':
        return 'animate-pulse';
      case 'float':
        return 'animate-levitate';
      default:
        return 'animate-sparkle';
    }
  };

  const getParticleShape = (type: Particle['type']) => {
    switch (type) {
      case 'star':
        return 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'sparkle':
        return 'clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)';
      default:
        return '';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main magical particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${particle.color} rounded-full ${getParticleAnimation(particle.type)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            clipPath: getParticleShape(particle.type),
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px currentColor`
          }}
        />
      ))}

      {/* Mouse trail magical effect */}
      {mouseTrail.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute w-3 h-3 bg-magical-gold rounded-full animate-sparkle pointer-events-none"
          style={{
            left: `${trail.x}%`,
            top: `${trail.y}%`,
            opacity: (index + 1) / mouseTrail.length * 0.6,
            transform: `scale(${(index + 1) / mouseTrail.length})`,
            animationDelay: `${index * 0.1}s`,
            filter: 'blur(1px)',
            boxShadow: '0 0 10px #D4AF37'
          }}
        />
      ))}

      {/* Floating magical orbs */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-magical-gold rounded-full animate-levitate opacity-30" style={{animationDelay: '0s', filter: 'blur(2px)'}} />
      <div className="absolute top-32 right-20 w-6 h-6 bg-magical-bronze rounded-full animate-magical-glow opacity-25" style={{animationDelay: '2s', filter: 'blur(1px)'}} />
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-magical-silver rounded-full animate-sparkle opacity-40" style={{animationDelay: '4s'}} />
      <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-magical-emerald rounded-full animate-levitate opacity-20" style={{animationDelay: '6s', filter: 'blur(1.5px)'}} />

      {/* Magical aurora effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-magical-mysticalPurple/5 via-transparent to-magical-emerald/5 animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute inset-0 bg-gradient-to-tl from-magical-gold/3 via-transparent to-magical-bronze/3 animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}} />
    </div>
  );
};
