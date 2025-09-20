import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '@/lib/database';
import { account } from '@/lib/appwrite';
import type { GameContextType, User, Story, StoryNode } from '@/types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({children})=> {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentStory, setCurrentStory] = useState<Story | null>(null);
    const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user session on app start
    useEffect(() => {
      initializeUserSession();
    }, []);

    const initializeUserSession = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated with Appwrite
        const appwriteUser = await account.get();
        
        // Check if this is a real authenticated user (not a guest)
        if (appwriteUser && appwriteUser.$id && !appwriteUser.$id.startsWith('guest')) {
          // Fetch user profile from our database
          const userProfile = await databaseService.getUserById(appwriteUser.$id);
          
          if (userProfile) {
            setCurrentUser(userProfile);
          } else {
            // If user exists in Appwrite but not in our database, create profile
            // This handles cases where registration was interrupted or failed partially
            try {
              const newUserProfile = await databaseService.createUser({
                name: appwriteUser.name || 'User',
                email: appwriteUser.email,
                hashed_password: 'appwrite_managed',
                games_won: 0
              }, appwriteUser.$id); // Pass the userId as a separate parameter
              setCurrentUser(newUserProfile);
              console.log('Created missing user profile for authenticated user:', appwriteUser.$id);
            } catch (createError: any) {
              console.error('Failed to create user profile for authenticated user:', createError);
              // If we can't create the profile, log out the user to prevent inconsistent state
              try {
                await account.deleteSession('current');
                console.log('Logged out user due to profile creation failure');
              } catch (logoutError) {
                console.error('Failed to logout user after profile creation failure:', logoutError);
              }
              setCurrentUser(null);
            }
          }
        } else {
          // No authenticated user or guest user
          setCurrentUser(null);
        }
      } catch (error: any) {
        // Handle specific Appwrite errors
        if (error.code === 401 || error.message?.includes('missing scopes')) {
          // User is not authenticated or is a guest user without proper scopes
          console.log('No authenticated user session found');
          setCurrentUser(null);
        } else {
          // Other errors
          console.log('Error checking user session:', error);
          setCurrentUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const loginUser = async (userProfile: User) => {
      setCurrentUser(userProfile);
    };

    const logoutUser = async () => {
      try {
        await account.deleteSession('current');
        setCurrentUser(null);
        setCurrentStory(null);
        setCurrentNode(null);
      } catch (error) {
        console.error('Logout error:', error);
        // Clear local state even if logout fails
        setCurrentUser(null);
        setCurrentStory(null);
        setCurrentNode(null);
      }
    };

    // --- Actions ---
  // Start a new story for the current user
  const createNewStory = async (topic: string) => {
    if (!currentUser) throw new Error("No user logged in");

    const story = await databaseService.createStory({
      user_id: currentUser.id,
      topic,
      status: "active",
    });

    setCurrentStory(story);

    // TODO: fetch first node of the story
    const firstNode = await databaseService.getStoryStartNode(story.id);
    setCurrentNode(firstNode);
  };

  // Progress to the next story node based on a choice
  const makeChoice = async (choiceId: string) => {
    if (!currentStory || !currentNode) throw new Error("No active story");

    const nextNode = await databaseService.getNextNode(currentNode.id, choiceId);
    setCurrentNode(nextNode);
  };

  // --- Context value ---
  const value: GameContextType = {
    currentUser,
    currentStory,
    currentNode,
    isLoading,
    createNewStory,
    makeChoice,
    loginUser,
    logoutUser,
    initializeUserSession,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};