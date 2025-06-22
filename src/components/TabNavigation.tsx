
import React from 'react';
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  showingNewest: boolean;
  showingAI: boolean;
  onTabChange: (tab: 'featured' | 'newest' | 'ai') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  showingNewest,
  showingAI,
  onTabChange
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <Button
        variant={!showingNewest && !showingAI ? 'default' : 'outline'}
        onClick={() => onTabChange('featured')}
        className={`${!showingNewest && !showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
      >
        🔥 Mais Vendidos
      </Button>
      <Button
        variant={showingNewest && !showingAI ? 'default' : 'outline'}
        onClick={() => onTabChange('newest')}
        className={`${showingNewest && !showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
      >
        ✨ Novidades
      </Button>
      <Button
        variant={showingAI ? 'default' : 'outline'}
        onClick={() => onTabChange('ai')}
        className={`${showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
      >
        🤖 Me Ajuda Escolher
      </Button>
    </div>
  );
};
