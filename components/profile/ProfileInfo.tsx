"use client";

import Image from "next/image";
import { IoCalendarOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFollow } from "@/contexts/FollowContext";
import EditProfileModal from "../model/EditProfileModal";

interface ProfileInfoProps {
  displayName: string;
  displayUsername: string;
}

export default function ProfileInfo({ displayName, displayUsername }: ProfileInfoProps) {
  const { data: session } = useSession();
  const { followingCount, setFollowingCount } = useFollow();
  const [followersCount, setFollowersCount] = useState(0);
  const [joinedDate, setJoinedDate] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  }, [session, displayName]);

  useEffect(() => {
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
  }, [session, setFollowingCount]);

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
        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
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

      {/* Edit Profile Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="border border-neutral-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-neutral-900 transition-colors"
        >
          Edit profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{profileData.name}</h2>
        <p className="text-neutral-500">@{displayUsername}</p>
        {profileData.bio && (
          <p className="text-white mt-3">{profileData.bio}</p>
        )}

        <div className="flex items-center gap-2 mt-3 text-neutral-500">
          <IoCalendarOutline size={16} />
          <span className="text-sm">Joined {joinedDate}</span>
        </div>

        <div className="flex gap-6 mt-3">
          <span className="text-sm">
            <span className="font-bold text-white">{followingCount}</span>{" "}
            <span className="text-neutral-500">Following</span>
          </span>
          <span className="text-sm">
            <span className="font-bold text-white">{followersCount}</span>{" "}
            <span className="text-neutral-500">Followers</span>
          </span>
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
      </div>
    </>
  );
}
