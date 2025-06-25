
import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Sparkles, Star, Package, Wand2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from '@/hooks/useFavorites';

interface SidebarStats {
  totalProducts: number;
  totalCategories: number;
  totalFavorites: number;
}

export const DesktopSidebar = () => {
  const location = useLocation();
  const { favoriteIds } = useFavorites();
  const [stats, setStats] = useState<SidebarStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalFavorites: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar total de produtos da tabela HARRY POTTER
        const { count: productsCount } = await supabase
          .from('HARRY POTTER')
          .select('*', { count: 'exact', head: true });

        // Buscar categorias únicas
        const { data: categoriesData } = await supabase
          .from('HARRY POTTER')
          .select('categoria')
          .not('categoria', 'is', null);

        const uniqueCategories = new Set(categoriesData?.map(item => item.categoria)).size;

        setStats({
          totalProducts: productsCount || 0,
          totalCategories: uniqueCategories,
          totalFavorites: favoriteIds.length
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [favoriteIds.length]);

  const menuItems = useMemo(() => [
    {
      icon: Sparkles,
      label: 'Novos Artefatos',
      href: '/novos',
      color: 'text-magical-gold',
      bgColor: 'bg-magical-gold/20'
    },
    {
      icon: Heart,
      label: 'Grimório',
      href: '/favoritos',
      color: 'text-magical-crimson',
      bgColor: 'bg-magical-crimson/20',
      badge: stats.totalFavorites > 0 ? stats.totalFavorites : undefined
    },
    {
      icon: Package,
      label: 'Explorar Coleção',
      href: '/explorar',
      color: 'text-magical-mysticalPurple',
      bgColor: 'bg-magical-mysticalPurple/20'
    }
  ], [stats.totalFavorites]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-gradient-to-b from-magical-midnight to-magical-deepPurple border-r border-magical-gold/20">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center h-16 px-6 bg-magical-midnight/50 border-b border-magical-gold/30">
          <Link to="/" className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-magical-gold animate-sparkle" />
            <span className="text-magical-starlight font-bold text-lg font-magical">
              Artefatos Mágicos
            </span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="p-4 space-y-3">
          <div className="bg-magical-gold/10 rounded-xl p-4 border border-magical-gold/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-magical-starlight/80 text-sm font-enchanted">Total de Artefatos</p>
                <p className="text-2xl font-bold text-magical-gold font-magical">
                  {loading ? '...' : stats.totalProducts}
                </p>
              </div>
              <Package className="w-8 h-8 text-magical-gold/60" />
            </div>
          </div>

          <div className="bg-magical-mysticalPurple/10 rounded-xl p-4 border border-magical-mysticalPurple/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-magical-starlight/80 text-sm font-enchanted">Categorias Mágicas</p>
                <p className="text-2xl font-bold text-magical-mysticalPurple font-magical">
                  {loading ? '...' : stats.totalCategories}
                </p>
              </div>
              <Star className="w-8 h-8 text-magical-mysticalPurple/60" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                  ${active 
                    ? `${item.bgColor} border ${item.color.replace('text-', 'border-')}/50 shadow-lg` 
                    : 'hover:bg-magical-starlight/10 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? item.color : 'text-magical-starlight/60'} transition-colors duration-300`} />
                  <span className={`font-medium font-enchanted ${active ? item.color : 'text-magical-starlight/80'} transition-colors duration-300`}>
                    {item.label}
                  </span>
                </div>
                
                {item.badge && (
                  <span className="bg-magical-gold text-magical-midnight text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-magical-gold/20">
          <div className="text-center">
            <p className="text-magical-starlight/60 text-sm font-enchanted">
              ✨ Coleção Mágica Premium ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
