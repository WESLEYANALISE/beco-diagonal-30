
import { useUserPreferences } from '@/hooks/useUserPreferences';

export const UserGreeting = () => {
  const { preferences, getGreeting } = useUserPreferences();

  if (!preferences.userName) return null;

  return (
    <div className="text-white/90 text-sm">
      {getGreeting()}
    </div>
  );
};
