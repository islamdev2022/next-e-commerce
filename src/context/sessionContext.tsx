"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

// Create the context with a default value
const SessionContextG = createContext<SessionContextType | undefined>(undefined);

// Define the type for the provider props
interface SessionProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SessionProviderG: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <SessionContextG.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContextG.Provider>
  );
};

// Custom hook to use the SessionContext
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContextG);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
