import React, { createContext, useContext, useState, useEffect } from "react";
import { databaseService } from "@/lib/database";
import { account, getCurrentUser } from "@/lib/appwrite";
import type { GameContextType, User, Story, StoryNode } from "@/types";

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // --- initialize on mount ---
  useEffect(() => {
    initializeUserSession();
  }, []);

  const initializeUserSession = async () => {
    try {
      setIsLoading(true);

      const userAccount = await getCurrentUser();
      if (!userAccount) {
        throw new Error("No user returned from Appwrite");
      }

      const userProfile: User = {
        id: userAccount.$id,
        name: userAccount.name || "Guest Player",
        email: userAccount.email || "",
        games_won: 0, // Could load from DB later
      };

      setCurrentUser(userProfile);
      setIsGuest(userAccount.email === ""); // guests don’t have email
    } catch (error) {
      console.error("Session initialization error:", error);
      // As last fallback → generate a temporary guest in-memory
      const tempUser: User = {
        id: "temp-" + Date.now(),
        name: "Temporary Player",
        email: "",
        games_won: 0,
      };
      setCurrentUser(tempUser);
      setIsGuest(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (userProfile: User) => {
    setCurrentUser(userProfile);
    setIsGuest(false);
  };

  const logoutUser = async () => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
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

// --- Custom Hook ---
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
