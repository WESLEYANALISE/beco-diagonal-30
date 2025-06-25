
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Book, Star, Wand2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/hooks/useFavorites";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { favoritesCount } = useFavorites();

  // Hide bottom navigation on /explorar page
  if (location.pathname === '/explorar') {
    return null;
  }

  // Only show on mobile and tablet, hide on desktop
  if (!isMobile) {
    return null;
  }

  const navItems = [{
    icon: Star,
    label: 'Favoritos',
    path: '/favoritos',
    activeColor: 'from-magical-gold to-magical-bronze',
    featured: true, // Destacado em primeiro
    badge: favoritesCount > 0 ? favoritesCount : null
  }, {
    icon: Home,
    label: 'Inicio',
    path: '/',
    activeColor: 'from-magical-mysticalPurple to-magical-deepPurple'
  }, {
    icon: Book,
    label: 'Categorias',
    path: '/categorias',
    activeColor: 'from-magical-deepPurple to-magical-mysticalPurple'
  }, {
    icon: Sparkles,
    label: 'Mágia',
    path: '/magia',
    activeColor: 'from-magical-emerald to-magical-gold'
  }, {
    icon: Wand2,
    label: 'Novidades',
    path: '/novos',
    activeColor: 'from-magical-crimson to-magical-darkGold'
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
              className={`flex flex-col items-center justify-center min-h-[60px] px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 relative ${
                active 
                  ? `bg-gradient-to-br ${item.activeColor} text-white shadow-lg shadow-magical-gold/25 ${item.featured ? 'ring-2 ring-magical-gold/50' : ''}` 
                  : 'text-magical-starlight/80 hover:text-magical-gold hover:bg-magical-gold/10'
              } ${item.featured ? 'transform scale-110' : ''}`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'animate-pulse' : ''} ${item.featured && active ? 'text-magical-midnight' : ''}`} />
              <span className={`text-xs font-medium truncate max-w-full font-enchanted ${active ? 'text-white' : ''} ${item.featured ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              
              {/* Badge para contagem de favoritos */}
              {item.badge && (
                <div className="absolute -top-1 -right-1 bg-magical-crimson text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold animate-magical-glow">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
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
