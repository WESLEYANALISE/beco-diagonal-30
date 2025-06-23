
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStoredDeviceId } from '@/utils/deviceFingerprint';

interface AppUser {
  id: string;
  device_id: string;
  created_at: string;
  preferences: Record<string, any>;
}

export const useAppUser = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const deviceId = getStoredDeviceId();
      
      // Try to find existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('app_users')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        setIsLoading(false);
        return;
      }

      if (existingUser) {
        // Update last_seen
        await supabase
          .from('app_users')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', existingUser.id);
        
        setUser(existingUser);
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('app_users')
          .insert([{ device_id: deviceId }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
        } else {
          setUser(newUser);
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: Record<string, any>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('app_users')
        .update({ preferences })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating preferences:', error);
      } else {
        setUser({ ...user, preferences });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return {
    user,
    isLoading,
    updatePreferences,
    deviceId: getStoredDeviceId()
  };
};
