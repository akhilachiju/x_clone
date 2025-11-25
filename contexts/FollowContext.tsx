"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface FollowContextType {
  followingCount: number;
  setFollowingCount: (count: number) => void;
  incrementFollowing: () => void;
  decrementFollowing: () => void;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followingCount, setFollowingCount] = useState(0);

  const incrementFollowing = () => setFollowingCount(prev => prev + 1);
  const decrementFollowing = () => setFollowingCount(prev => prev - 1);

  return (
    <FollowContext.Provider value={{
      followingCount,
      setFollowingCount,
      incrementFollowing,
      decrementFollowing
    }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}
