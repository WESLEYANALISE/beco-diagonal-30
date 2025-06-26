
import React, { memo } from 'react';

export const MagicalParticles = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Reduzido de 30 para 8 partículas principais */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-magical-gold rounded-full animate-sparkle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            willChange: 'opacity, transform'
          }}
        />
      ))}
      
      {/* Reduzido de 15 para 5 orbes flutuantes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-full animate-levitate shadow-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${5 + Math.random() * 2}s`,
            willChange: 'transform'
          }}
        />
      ))}

      {/* Reduzido de 25 para 7 partículas de poeira */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 bg-magical-silver rounded-full animate-sparkle opacity-15"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            willChange: 'opacity'
          }}
        />
      ))}
    </div>
  );
});

MagicalParticles.displayName = 'MagicalParticles';
