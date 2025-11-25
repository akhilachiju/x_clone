"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFollow } from "@/contexts/FollowContext";
import UnfollowModal from "../model/UnfollowModal";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
}

interface WhoToFollowProps {
  title?: string;
  showMore?: boolean;
  limit?: number;
  className?: string;
  compact?: boolean;
}

export default function WhoToFollow({
  title = "Who to follow",
  showMore = true,
  limit = 3,
  className = "",
  compact = false,
}: WhoToFollowProps) {
  const { data: session } = useSession();
  const { incrementFollowing, decrementFollowing } = useFollow();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unfollowModal, setUnfollowModal] = useState<{ isOpen: boolean; userId: string; username: string }>({
    isOpen: false,
    userId: '',
    username: ''
  });

  const handleFollow = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    // If user is currently following, show unfollow modal
    if (user?.isFollowing) {
      setUnfollowModal({
        isOpen: true,
        userId: userId,
        username: user.username
      });
      return;
    }

    // Otherwise, follow directly
    await performFollow(userId);
  };

  const performFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      });

      if (response.ok) {
        const { following } = await response.json();
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isFollowing: following } : user
        ));
        
        // Update global following count
        if (following) {
          incrementFollowing();
        } else {
          decrementFollowing();
        }
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  const getRandomColor = (userId: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const allUsers = await response.json();
          const otherUsers = allUsers.filter(
            (user: User) => user.email !== session?.user?.email
          );
          setTotalUsers(otherUsers.length);
          setUsers(otherUsers.slice(0, limit));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUsers();
    }
  }, [session, limit]);

  if (loading) {
    return (
      <div
        className={`p-4 ${
          compact ? "" : "rounded-2xl border border-neutral-800"
        } flex flex-col gap-4 ${className}`}
      >
        <h2 className="font-bold text-xl">{title}</h2>
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-neutral-700"></div>
              <div>
                <div className="h-4 bg-neutral-700 rounded mb-1 w-20"></div>
                <div className="h-3 bg-neutral-700 rounded w-16"></div>
              </div>
            </div>
            <div className="h-8 bg-neutral-700 rounded-full w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div
        className={`p-4 ${
          compact ? "" : "rounded-2xl border border-neutral-800"
        } flex flex-col gap-4 ${className}`}
      >
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="text-neutral-500 text-sm">
          No users to suggest at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 ${
        compact ? "" : "rounded-2xl border border-neutral-800"
      } flex flex-col gap-4 ${className}`}
    >
      <h2 className="font-bold text-xl">{title}</h2>

      {users.map((user) => (
        <div
          key={user.id}
          className={`flex items-center justify-between ${
            compact ? "p-3 hover:bg-neutral-900 rounded-lg" : ""
          } transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
                user.image ? "bg-gray-600" : getRandomColor(user.id)
              }`}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || user.username}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() ||
                    user.username?.charAt(0)?.toUpperCase() ||
                    "U"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-md font-bold">
                {user.name || user.username}
              </h1>
              <span className="text-gray-500 text-sm">@{user.username}</span>
            </div>
          </div>

          <button 
            onClick={() => handleFollow(user.id)}
            className={`py-1 px-4 font-semibold rounded-full transition-colors ${
              user.isFollowing 
                ? 'bg-black border border-neutral-600 text-white hover:text-red-500 hover:border-red-500' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {user.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}

      {showMore && totalUsers > limit && (
        <Link
          href="/"
          className="text-sky-500 hover:text-sky-600 text-sm transition-colors"
        >
          Show More
        </Link>
      )}

      <UnfollowModal
        isOpen={unfollowModal.isOpen}
        onClose={() => setUnfollowModal({ isOpen: false, userId: '', username: '' })}
        onConfirm={() => performFollow(unfollowModal.userId)}
        username={unfollowModal.username}
      />
    </div>
  );
}
