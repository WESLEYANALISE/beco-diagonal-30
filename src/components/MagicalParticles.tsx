
import React, { memo } from 'react';

export const MagicalParticles = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Reduzido drasticamente de 20+ para apenas 4 partículas principais */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-magical-gold rounded-full animate-pulse opacity-10"
          style={{
            left: `${20 + i * 25}%`,
            top: `${15 + i * 20}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `6s`,
            willChange: 'opacity'
          }}
        />
      ))}
      
      {/* Apenas 2 orbes flutuantes com animação muito suave */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 rounded-full animate-pulse opacity-5"
          style={{
            left: `${30 + i * 40}%`,
            top: `${25 + i * 35}%`,
            animationDelay: `${i * 4}s`,
            animationDuration: `8s`,
            willChange: 'opacity'
          }}
        />
      ))}
    </div>
  );
});

MagicalParticles.displayName = 'MagicalParticles';
