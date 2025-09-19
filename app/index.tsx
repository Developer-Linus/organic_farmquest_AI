import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Add a small delay to ensure Root Layout is mounted before navigation
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
