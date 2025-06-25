
import React from 'react';

export const MagicalParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating magical particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-magical-gold rounded-full animate-sparkle opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
      
      {/* Larger floating orbs */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute w-3 h-3 bg-gradient-to-br from-magical-gold/40 to-magical-bronze/40 rounded-full animate-levitate shadow-lg shadow-magical-gold/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        />
      ))}

      {/* Magical dust trails */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 bg-magical-silver rounded-full animate-sparkle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${1.5 + Math.random() * 2.5}s`
          }}
        />
      ))}

      {/* Golden sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-magical-gold rounded-full animate-magical-glow opacity-25"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Floating embers */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`ember-${i}`}
          className="absolute w-1.5 h-1.5 bg-gradient-to-br from-magical-crimson/30 to-magical-bronze/30 rounded-full animate-levitate"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 7}s`,
            animationDuration: `${5 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};
