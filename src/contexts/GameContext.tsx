import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '@/lib/database';
import { account } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';
import type { GameContextType, User, Story, StoryNode } from '@/types';

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // --- initialization logic stays the same ---
  useEffect(() => {
    initializeUserSession();
  }, []);

  const initializeUserSession = async () => {
    try {
      setIsLoading(true);
      
      // Try to get current session
      const session = await account.getSession('current');
      if (session) {
        // User is logged in, get their profile
        const userAccount = await account.get();
        const userProfile: User = {
          id: userAccount.$id,
          name: userAccount.name,
          email: userAccount.email,
          games_won: 0, // This should be fetched from database
        };
        setCurrentUser(userProfile);
        setIsGuest(false);
      } else {
        // No session, create guest session
        await createGuestSession();
      }
    } catch (error) {
      console.error('Session initialization error:', error);
      // If there's an error, create guest session as fallback
      await createGuestSession();
    } finally {
      setIsLoading(false);
    }
  };

  const createGuestSession = async () => {
    try {
      // Create anonymous session
      const session = await account.createAnonymousSession();
      const guestUser: User = {
        id: session.userId,
        name: 'Guest Player',
        email: '',
        games_won: 0,
      };
      setCurrentUser(guestUser);
      setIsGuest(true);
    } catch (error) {
      console.error('Guest session creation error:', error);
      // Even if guest session fails, set a temporary user
      const tempUser: User = {
        id: 'temp-' + Date.now(),
        name: 'Temporary Player',
        email: '',
        games_won: 0,
      };
      setCurrentUser(tempUser);
      setIsGuest(true);
    }
  };

  const loginUser = async (userProfile: User) => {
    setCurrentUser(userProfile);
  };

  const logoutUser = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setCurrentStory(null);
    setCurrentNode(null);
    setIsGuest(false);
  };

  const createNewStory = async (topic: string) => {
    if (!currentUser) throw new Error("No user logged in");
    const story = await databaseService.createStory({
      user_id: currentUser.id,
      topic,
      status: "active",
    });
    setCurrentStory(story);

    const firstNode = await databaseService.getStoryStartNode(story.story_id);
    setCurrentNode(firstNode);
  };

  const makeChoice = async (choiceId: string) => {
    if (!currentStory || !currentNode) throw new Error("No active story");
    const nextNode = await databaseService.getNextNode(currentNode.node_id, choiceId);
    setCurrentNode(nextNode);
  };

  const value: GameContextType = {
    currentUser,
    currentStory,
    currentNode,
    isLoading,
    isGuest,
    createNewStory,
    makeChoice,
    loginUser,
    logoutUser,
    initializeUserSession,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// --- Unified custom hook ---
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
