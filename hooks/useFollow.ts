import { useState } from 'react';

export const useFollowUser = () => {
  const [loading, setLoading] = useState(false);

  const followUser = async (userId: string) => {
    if (loading) return null;
    
    setLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      });

      if (response.ok) {
        const { following } = await response.json();
        return following;
      }
      return null;
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { followUser, loading };
};
