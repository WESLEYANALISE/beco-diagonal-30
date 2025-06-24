
import React from 'react';

export const MagicalParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating magical particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-magical-gold rounded-full animate-sparkle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
      
      {/* Larger floating orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-full animate-levitate"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Magical dust trails */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 bg-magical-silver rounded-full animate-sparkle opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};
