"use client";

import Image from "next/image";
import { useState } from "react";
import UnfollowModal from "../model/UnfollowModal";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  isFollowing?: boolean;
}

interface ProfileCardProps {
  user: User;
  showBio?: boolean;
  compact?: boolean;
  onFollow: (userId: string) => void;
}

export default function ProfileCard({ user, showBio = false, compact = false, onFollow }: ProfileCardProps) {
  const [unfollowModal, setUnfollowModal] = useState<{ isOpen: boolean; userId: string; username: string }>({
    isOpen: false,
    userId: '',
    username: ''
  });

  const getRandomColor = (userId: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleFollow = () => {
    if (user.isFollowing) {
      setUnfollowModal({ isOpen: true, userId: user.id, username: user.username });
    } else {
      onFollow(user.id);
    }
  };

  return (
    <div className={`flex items-start justify-between hover:bg-neutral-950 px-4-mx-4 ${compact ? "rounded-lg" : ""} transition-colors`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${user.image ? "bg-gray-600" : getRandomColor(user.id)}`}>
          {user.image ? (
            <Image src={user.image} alt={user.name || user.username} width={40} height={40} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-sm">
              {user.name?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-md font-bold">{user.name || user.username}</h1>
          <span className="text-gray-500 text-sm">@{user.username}</span>
          {showBio && user.bio && user.bio.trim() && (
            <p className="text-white text-sm font-medium">{user.bio}</p>
          )}
        </div>
      </div>

      <button 
        onClick={handleFollow}
        className={`py-1 px-4 mt-2 font-semibold rounded-full transition-colors group ${
          user.isFollowing 
            ? 'bg-black border border-neutral-600 text-white hover:text-red-500 hover:border-red-500' 
            : 'bg-white text-black hover:bg-gray-200'
        }`}
      >
        <span className={user.isFollowing ? 'group-hover:hidden' : ''}>
          {user.isFollowing ? 'Following' : 'Follow'}
        </span>
        {user.isFollowing && (
          <span className="hidden group-hover:inline text-red-500">Unfollow</span>
        )}
      </button>

      <UnfollowModal
        isOpen={unfollowModal.isOpen}
        onClose={() => setUnfollowModal({ isOpen: false, userId: '', username: '' })}
        onConfirm={() => onFollow(unfollowModal.userId)}
        username={unfollowModal.username}
      />
    </div>
  );
}
