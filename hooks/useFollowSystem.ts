"use client";

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const useFollowSystem = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  // Fetch current user's follow counts
  const fetchFollowCounts = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/user/stats?email=${session.user.email}`);
      if (response.ok) {
        const { following, followers } = await response.json();
        setFollowingCount(following);
        setFollowersCount(followers);
      }
    } catch (error) {
      console.error('Failed to fetch follow counts:', error);
    }
  }, [session?.user?.email]);

  // Perform follow/unfollow action
  const performFollow = useCallback(async (userId: string) => {
    if (loading || !session?.user?.email) return null;
    
    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      });

      if (response.ok) {
        const { following } = await response.json();
        
        // Update local counts
        if (following) {
          setFollowingCount(prev => prev + 1);
        } else {
          setFollowingCount(prev => prev - 1);
        }
        
        // Dispatch global event for all components to listen
        window.dispatchEvent(new CustomEvent('followStateChanged', { 
          detail: { userId, isFollowing: following } 
        }));
        
        return following;
      }
      return null;
    } catch (error) {
      console.error('Follow operation failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading, session?.user?.email]);

  // Initialize counts on mount
  useEffect(() => {
    fetchFollowCounts();
  }, [fetchFollowCounts]);

  return {
    followingCount,
    followersCount,
    followUser: performFollow, // Alias for compatibility
    performFollow,
    loading,
    refreshCounts: fetchFollowCounts,
    // Context compatibility methods
    setFollowingCount,
    incrementFollowing: () => setFollowingCount(prev => prev + 1),
    decrementFollowing: () => setFollowingCount(prev => prev - 1)
  };
};
