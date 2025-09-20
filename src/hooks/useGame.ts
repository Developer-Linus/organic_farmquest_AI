import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import type { GameContextType } from "@types";
// Custom hook to consume GameContext
export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    
    if (!context) {
      throw new Error("useGame must be used within a GameProvider");
    }
    return context;
  };