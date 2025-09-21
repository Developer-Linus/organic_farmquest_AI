import { useEffect } from 'react';
import { router } from 'expo-router';
import { useGame } from '../src/contexts/GameContext';

export default function Index() {
  const { currentUser, isLoading } = useGame();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined
    
    // Add a small delay to ensure Root Layout is mounted before navigation
    const timer = setTimeout(() => {
      if (currentUser && !currentUser.isGuest) {
        // User is authenticated, go to tabs
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, show welcome screen
        router.replace('/welcome');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, isLoading]);

  return null;
}
