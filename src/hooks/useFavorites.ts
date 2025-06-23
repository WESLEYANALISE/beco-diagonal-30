
// Updated to use Supabase backend with localStorage fallback
import { useFavoritesSupabase } from './useFavoritesSupabase';

export const useFavorites = () => {
  return useFavoritesSupabase();
};
