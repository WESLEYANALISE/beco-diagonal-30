
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Book, Star, Wand2, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/hooks/useFavorites";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { favoritesCount } = useFavorites();

  // Only show on mobile and tablet, hide on desktop
  if (!isMobile) {
    return null;
  }

  // Hide bottom navigation on specific pages
  if (location.pathname === '/explorar') {
    return null;
  }

  const navItems = [{
    icon: Star,
    label: 'Favoritos',
    path: '/favoritos',
    activeColor: 'from-magical-crimson to-magical-gold',
    showBadge: true,
    badgeCount: favoritesCount
  }, {
    icon: Home,
    label: 'Início',
    path: '/',
    activeColor: 'from-magical-gold to-magical-bronze'
  }, {
    icon: Book,
    label: 'Categorias',
    path: '/categorias',
    activeColor: 'from-magical-mysticalPurple to-magical-deepPurple'
  }, {
    icon: Wand2,
    label: 'Magia',
    path: '/magia',
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
              className={`relative flex flex-col items-center justify-center min-h-[60px] px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                active 
                  ? `bg-gradient-to-br ${item.activeColor} text-white shadow-lg shadow-magical-gold/25` 
                  : 'text-magical-starlight/80 hover:text-magical-gold hover:bg-magical-gold/10'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-1 ${active ? 'animate-pulse' : ''}`} />
                {item.showBadge && item.badgeCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-xs bg-magical-crimson text-white rounded-full flex items-center justify-center px-1">
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                  </Badge>
                )}
              </div>
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
