"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ProfileCard from "@/components/profile/ProfileCard";
import { useFollowManager } from "@/hooks/useFollowManager";

export default function FollowingPage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<any>(null);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { performFollow } = useFollowManager();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users?username=${username}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Fetch following users
          if (userData.followingIds && userData.followingIds.length > 0) {
            const followingResponse = await fetch('/api/users');
            if (followingResponse.ok) {
              const allUsers = await followingResponse.json();
              const following = allUsers.filter((u: any) => userData.followingIds.includes(u.id));
              setFollowingUsers(following);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  // Listen for follow state changes and update the list
  useEffect(() => {
    const handleFollowChange = (event: any) => {
      const { userId, isFollowing } = event.detail;
      
      if (!isFollowing) {
        // User was unfollowed, remove from the following list
        setFollowingUsers(prev => prev.filter(user => user.id !== userId));
      }
    };

    window.addEventListener('followStateChanged', handleFollowChange);
    return () => window.removeEventListener('followStateChanged', handleFollowChange);
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId }),
      });
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      // Always refresh to update the lists
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen border-x border-neutral-800">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md p-4">
        <div className="flex items-center gap-4">
          <Link href={`/${username}`} className="p-2 hover:bg-neutral-900 rounded-full">
            <IoArrowBack size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{user?.name || username}</h1>
            <p className="text-sm text-neutral-500">@{user?.email?.split('@')[0] || user?.username || username}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <div className="flex">
          <Link 
            href={`/${username}/followers`}
            className="flex-1 py-4 text-center font-medium transition-colors text-neutral-500 hover:bg-neutral-900"
          >
            Followers
          </Link>
          <button className="flex-1 py-4 text-center font-medium transition-colors relative text-white">
            Following
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-sky-500 h-1 rounded-full" 
              style={{ width: `${9 * 8}px` }}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading...</div>
      ) : followingUsers.length > 0 ? (
        <div>
          {followingUsers.map((followingUser) => (
            <div key={followingUser.id} className="px-4 py-3">
              <ProfileCard
                user={followingUser}
                onFollow={performFollow}
                compact={true}
                showBio={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 mx-8">
          <h2 className="text-3xl font-bold mb-4">Be in the know</h2>
          <p className="text-neutral-400 mb-6 max-w-md">
            Following accounts is an easy way to curate your timeline and know what's happening with the topics and people you're interested in.
          </p>
          <Link 
            href="/connect"
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Find people to follow
          </Link>
        </div>
      )}
    </div>
  );
}
