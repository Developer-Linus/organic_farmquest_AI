import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { GameState, GameSession, Story, User, GameTopic, GameDifficulty } from '../types';

// Initial state
const initialState: GameState = {
  user: null,
  currentSession: null,
  currentStory: null,
  isLoading: false,
  error: null,
  totalScore: 0,
  achievements: [],
  gameHistory: []
};

// Action types
type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'START_GAME_SESSION'; payload: { topic: GameTopic; difficulty: GameDifficulty } }
  | { type: 'END_GAME_SESSION' }
  | { type: 'SET_CURRENT_STORY'; payload: Story | null }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'ADD_ACHIEVEMENT'; payload: string }
  | { type: 'RESET_GAME_STATE' };

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'START_GAME_SESSION':
      const newSession: GameSession = {
        id: `session_${Date.now()}`,
        userId: state.user?.id || 'anonymous',
        topic: action.payload.topic,
        difficulty: action.payload.difficulty,
        startTime: new Date(),
        endTime: null,
        score: 0,
        storiesCompleted: 0,
        isActive: true
      };
      return {
        ...state,
        currentSession: newSession,
        currentStory: null,
        error: null
      };
    
    case 'END_GAME_SESSION':
      if (!state.currentSession) return state;
      
      const endedSession: GameSession = {
        ...state.currentSession,
        endTime: new Date(),
        isActive: false
      };
      
      return {
        ...state,
        currentSession: null,
        currentStory: null,
        gameHistory: [...state.gameHistory, endedSession],
        totalScore: state.totalScore + endedSession.score
      };
    
    case 'SET_CURRENT_STORY':
      return { ...state, currentStory: action.payload };
    
    case 'UPDATE_SCORE':
      const updatedSession = state.currentSession ? {
        ...state.currentSession,
        score: state.currentSession.score + action.payload,
        storiesCompleted: state.currentSession.storiesCompleted + 1
      } : null;
      
      return {
        ...state,
        currentSession: updatedSession
      };
    
    case 'ADD_ACHIEVEMENT':
      if (state.achievements.includes(action.payload)) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      };
    
    case 'RESET_GAME_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  startGame: (topic: GameTopic, difficulty: GameDifficulty) => void;
  endGame: () => void;
  updateScore: (points: number) => void;
  setCurrentStory: (story: Story | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  addAchievement: (achievement: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Helper functions
  const startGame = (topic: GameTopic, difficulty: GameDifficulty) => {
    dispatch({ type: 'START_GAME_SESSION', payload: { topic, difficulty } });
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME_SESSION' });
  };

  const updateScore = (points: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: points });
  };

  const setCurrentStory = (story: Story | null) => {
    dispatch({ type: 'SET_CURRENT_STORY', payload: story });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const addAchievement = (achievement: string) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME_STATE' });
  };

  const value: GameContextType = {
    state,
    dispatch,
    startGame,
    endGame,
    updateScore,
    setCurrentStory,
    setLoading,
    setError,
    setUser,
    addAchievement,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Selectors for common state access patterns
export const useGameSelectors = () => {
  const { state } = useGame();
  
  return {
    isGameActive: state.currentSession?.isActive ?? false,
    currentScore: state.currentSession?.score ?? 0,
    totalScore: state.totalScore,
    isLoading: state.isLoading,
    error: state.error,
    user: state.user,
    currentStory: state.currentStory,
    achievements: state.achievements,
    gameHistory: state.gameHistory,
    currentTopic: state.currentSession?.topic,
    currentDifficulty: state.currentSession?.difficulty,
    storiesCompleted: state.currentSession?.storiesCompleted ?? 0
  };
};