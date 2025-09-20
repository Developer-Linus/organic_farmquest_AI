import React, { createContext, useContext, useState } from 'react';
import { databaseService } from '@/lib/database';
import type { GameContextType, User, Story, StoryNode } from '@/types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({children})=> {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentStory, setCurrentStory] = useState<Story | null>(null);
    const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
    // --- Actions ---
  // Start a new story for the current user
  const createNewStory = async (topic: string) => {
    if (!currentUser) throw new Error("No user logged in");

    const story = await databaseService.createStory({
      user_id: currentUser.user_id,
      topic,
      status: "active",
    });

    setCurrentStory(story);

    // TODO: fetch first node of the story
    const firstNode = await databaseService.getStoryStartNode(story.story_id);
    setCurrentNode(firstNode);
  };

  // Progress to the next story node based on a choice
  const makeChoice = async (choiceId: string) => {
    if (!currentStory || !currentNode) throw new Error("No active story");

    const nextNode = await databaseService.getNextNode(currentNode.node_id, choiceId);
    setCurrentNode(nextNode);
  };

  // --- Context value ---
  const value: GameContextType = {
    currentUser,
    currentStory,
    currentNode,
    createNewStory,
    makeChoice,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}