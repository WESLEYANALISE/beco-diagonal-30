
import React from 'react';
import { Wand2, Zap, Crown } from 'lucide-react';

interface MagicalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const MagicalLogo: React.FC<MagicalLogoProps> = ({ 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Magical circle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-magical-gold to-magical-bronze rounded-full animate-magical-glow opacity-20"></div>
        
        {/* Main logo container */}
        <div className="relative w-full h-full bg-gradient-to-br from-magical-deepPurple to-magical-mysticalPurple rounded-full border-2 border-magical-gold flex items-center justify-center overflow-hidden">
          {/* Lightning bolt */}
          <Zap className="absolute top-1 right-1 w-3 h-3 text-magical-gold animate-sparkle" />
          
          {/* Wand icon */}
          <Wand2 className="w-5 h-5 text-magical-gold" />
          
          {/* Crown/sorting hat element */}
          <Crown className="absolute bottom-0 left-1 w-2 h-2 text-magical-bronze opacity-70" />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-magical font-bold text-magical-gold tracking-wide`}>
            Universo Potter
          </h1>
          <p className="text-xs text-magical-silver opacity-80 font-enchanted">
            Artefatos Mágicos
          </p>
        </div>
      )}
    </div>
  );
};
