import { useState, useCallback } from 'react';

export const useFollowManager = () => {
  const [loading, setLoading] = useState(false);

  const performFollow = useCallback(async (userId: string) => {
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
        
        // Dispatch global event for all components to listen
        window.dispatchEvent(new CustomEvent('followStateChanged', { 
          detail: { userId, isFollowing: following } 
        }));
        
        return following;
      } else {
        // Even if API fails, try to toggle the state optimistically
        console.log('API failed, but updating UI optimistically');
        window.dispatchEvent(new CustomEvent('followStateChanged', { 
          detail: { userId, isFollowing: false } // Assume unfollow for now
        }));
        return false;
      }
    } catch (error) {
      console.error('Follow operation failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { performFollow, loading };
};
