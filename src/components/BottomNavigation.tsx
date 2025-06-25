import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Book, Star, Wand2, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Only show on mobile and tablet, hide on desktop and hide on Explorar page
  if (!isMobile || location.pathname === '/explorar') {
    return null;
  }

  const navItems = [{
    icon: Home,
    label: 'Inicio',
    path: '/',
    activeColor: 'from-magical-gold to-magical-bronze'
  }, {
    icon: Book,
    label: 'Categorias',
    path: '/categorias',
    activeColor: 'from-magical-mysticalPurple to-magical-deepPurple'
  }, {
    icon: Star,
    label: 'Favoritos',
    path: '/favoritos',
    activeColor: 'from-magical-crimson to-magical-gold'
  }, {
    icon: Wand2,
    label: 'Novidades',
    path: '/novos',
    activeColor: 'from-magical-emerald to-magical-gold'
  }, {
    icon: Compass,
    label: 'Explorar',
    path: '/explorar',
    activeColor: 'from-magical-silver to-magical-gold'
  }];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 border-t border-magical-gold/30 backdrop-blur-xl shadow-2xl">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant="ghost"
              className={`flex flex-col items-center justify-center min-h-[60px] px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                active 
                  ? `bg-gradient-to-br ${item.activeColor} text-white shadow-lg shadow-magical-gold/25` 
                  : 'text-magical-starlight/80 hover:text-magical-gold hover:bg-magical-gold/10'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium truncate max-w-full font-enchanted ${active ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Subtle magical sparkle effects */}
      <div className="absolute top-0 left-1/4 w-0.5 h-0.5 bg-magical-gold rounded-full animate-sparkle opacity-30"></div>
      <div className="absolute top-1 right-1/3 w-0.5 h-0.5 bg-magical-silver rounded-full animate-sparkle opacity-25" style={{
        animationDelay: '1s'
      }}></div>
      <div className="absolute top-0 right-1/4 w-0.5 h-0.5 bg-magical-bronze rounded-full animate-sparkle opacity-20" style={{
        animationDelay: '2s'
      }}></div>
    </div>
  );
};
