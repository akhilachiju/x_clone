"use client";

import Image from "next/image";
import Link from "next/link";
import { IoCalendarOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFollow } from "@/contexts/FollowContext";
import { useFollowUser } from "@/hooks/useFollow";
import EditProfileModal from "../model/EditProfileModal";
import UnfollowModal from "../model/UnfollowModal";
import FollowButton from "../ui/FollowButton";

interface ProfileInfoProps {
  displayName: string;
  displayUsername: string;
  isOwnProfile: boolean;
  user?: any;
}

export default function ProfileInfo({ displayName, displayUsername, isOwnProfile, user }: ProfileInfoProps) {
  const { data: session } = useSession();
  const { followingCount, setFollowingCount } = useFollow();
  const [followersCount, setFollowersCount] = useState(0);
  const [joinedDate, setJoinedDate] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { followUser } = useFollowUser();
  const [isFollowing, setIsFollowing] = useState(false);
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

  const handleFollow = async () => {
    if (!user?.id) return;
    
    if (isFollowing) {
      setUnfollowModal({ isOpen: true, userId: user.id, username: user.username });
    } else {
      const result = await followUser(user.id);
      if (result !== null) {
        // Refresh page to sync all components
        window.location.reload();
      }
    }
  };

  const confirmUnfollow = async () => {
    const result = await followUser(unfollowModal.userId);
    if (result !== null) {
      // Refresh page to sync all components
      window.location.reload();
    }
    setUnfollowModal({ isOpen: false, userId: '', username: '' });
  };

  // Check initial follow state when user data loads
  useEffect(() => {
    if (!isOwnProfile && user?.id && session?.user?.email) {
      // Get current user's following list to check if already following this user
      fetch(`/api/users?username=${session.user.email.split('@')[0]}`)
        .then(res => res.json())
        .then(currentUser => {
          if (currentUser && currentUser.followingIds) {
            setIsFollowing(currentUser.followingIds.includes(user.id));
          }
        })
        .catch(console.error);
    }
  }, [user, session, isOwnProfile]);

  // Listen for follow state changes from other components
  useEffect(() => {
    const handleFollowStateChange = (event: any) => {
      const { userId, isFollowing: newFollowState } = event.detail;
      if (userId === user?.id) {
        setIsFollowing(newFollowState);
      }
    };

    window.addEventListener('followStateChanged', handleFollowStateChange);
    return () => window.removeEventListener('followStateChanged', handleFollowStateChange);
  }, [user?.id]);
  const [profileData, setProfileData] = useState({
    name: displayName,
    bio: '',
    profileImage: session?.user?.image || '',
    coverImage: ''
  });

  const handleSaveProfile = async (data: { name: string; bio: string; profileImage?: string; coverImage?: string }) => {
    try {
      const response = await fetch('/api/profile', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
      });
      
      if (response.ok) {
        setProfileData(prev => ({ 
          ...prev, 
          ...data,
          profileImage: data.profileImage || prev.profileImage
        }));
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  useEffect(() => {
    if (isOwnProfile) {
      // Only fetch profile data for own profile
      const fetchProfile = async () => {
        if (session?.user?.email) {
          try {
            const response = await fetch('/api/profile');
            if (response.ok) {
              const userData = await response.json();
              setProfileData({
                name: userData.name || displayName,
                bio: userData.bio || '',
                profileImage: userData.image || session.user.image || '',
                coverImage: userData.coverImage || ''
              });
              
              // Format the joined date
              if (userData.createdAt) {
                const date = new Date(userData.createdAt);
                const formattedDate = date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                });
                setJoinedDate(formattedDate);
              }
            }
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
        }
      };
      fetchProfile();
    } else {
      // For other users, use the passed user data
      if (user) {
        setProfileData({
          name: user.name || displayName,
          bio: user.bio || '',
          profileImage: user.image || '',
          coverImage: user.coverImage || ''
        });
        
        // Format the joined date
        if (user.createdAt) {
          const date = new Date(user.createdAt);
          const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          });
          setJoinedDate(formattedDate);
        }
      }
    }
  }, [session, displayName, isOwnProfile, user]);

  useEffect(() => {
    if (isOwnProfile) {
      const fetchCounts = async () => {
        if (session?.user?.email) {
          try {
            const response = await fetch(`/api/user/stats?email=${session.user.email}`);
            if (response.ok) {
              const { following, followers } = await response.json();
              setFollowingCount(following);
              setFollowersCount(followers);
            }
          } catch (error) {
            console.error('Failed to fetch user stats:', error);
          }
        }
      };
      fetchCounts();
    } else {
      // For other users, use their follower/following arrays
      if (user) {
        setFollowersCount(user.followerIds?.length || 0);
        setFollowingCount(user.followingIds?.length || 0);
      }
    }
  }, [session, isOwnProfile, user]);

  // Listen for follow changes and refresh counts
  useEffect(() => {
    const handleFollowChange = () => {
      if (user) {
        // Refetch user data to get updated counts
        window.location.reload();
      }
    };

    window.addEventListener('followStateChanged', handleFollowChange);
    return () => window.removeEventListener('followStateChanged', handleFollowChange);
  }, [user]);

  return (
    <>
      {/* Cover Image */}
      <div className="relative h-48 bg-neutral-800 overflow-hidden">
        {profileData.coverImage && (
          <Image
            src={profileData.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="relative px-4 pb-4">
      {/* Profile Picture */}
      <div className="absolute -top-16 left-4 border-4 border-black rounded-full w-32 h-32 overflow-hidden">
        <div className={`w-full h-full flex items-center justify-center ${profileData.profileImage ? "bg-gray-600" : getRandomColor(user?.id || "default")}`}>
          {profileData.profileImage ? (
            <Image
              src={profileData.profileImage}
              alt={profileData.name || displayName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-3xl">
              {(profileData.name || displayName)?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        {isOwnProfile ? (
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="border border-neutral-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-neutral-900 transition-colors"
          >
            Edit profile
          </button>
        ) : (
          <FollowButton 
            isFollowing={isFollowing}
            onClick={handleFollow}
            className="px-6 py-2"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{profileData.name}</h2>
        <p className="text-neutral-500">@{session?.user?.email?.split('@')[0] || user?.username || displayUsername}</p>
        {profileData.bio && (
          <p className="text-white mt-3">{profileData.bio}</p>
        )}

        <div className="flex items-center gap-2 mt-3 text-neutral-500">
          <IoCalendarOutline size={16} />
          <span className="text-sm">Joined {joinedDate}</span>
        </div>

        <div className="flex gap-6 mt-3">
          <Link href={`/${session?.user?.email?.split('@')[0] || user?.username || displayUsername}/following`} className="text-sm hover:underline cursor-pointer">
            <span className="font-bold text-white">{followingCount}</span>{" "}
            <span className="text-neutral-500">Following</span>
          </Link>
          <Link href={`/${session?.user?.email?.split('@')[0] || user?.username || displayUsername}/followers`} className="text-sm hover:underline cursor-pointer">
            <span className="font-bold text-white">{followersCount}</span>{" "}
            <span className="text-neutral-500">Followers</span>
          </Link>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialValues={{
          name: profileData.name,
          bio: profileData.bio,
          avatarUrl: profileData.profileImage,
          coverImage: profileData.coverImage
        }}
      />

      <UnfollowModal
        isOpen={unfollowModal.isOpen}
        onClose={() => setUnfollowModal({ isOpen: false, userId: '', username: '' })}
        onConfirm={confirmUnfollow}
        username={unfollowModal.username}
      />
      </div>
    </>
  );
}