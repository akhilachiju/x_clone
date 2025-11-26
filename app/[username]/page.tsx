"use client";

import { useSession } from "next-auth/react";
import { useState, use, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContent from "@/components/profile/ProfileContent";
import WhoToFollow from "@/components/profile/WhoToFollow";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfile({ params }: ProfilePageProps) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Posts");
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const userData = await response.json();
            setProfileData({
              name: userData.name || session.user.name || username,
              username: session.user.email?.split('@')[0] || username,
              email: session.user.email || ''
            });
          } else {
            // Fallback to session data
            setProfileData({
              name: session.user.name || username,
              username: session.user.email?.split('@')[0] || username,
              email: session.user.email || ''
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setProfileData({
            name: session.user.name || username,
            username: session.user.email?.split('@')[0] || username,
            email: session.user.email || ''
          });
        }
      }
    };

    fetchProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [session, username]);

  const displayName = profileData.name || username;
  const displayUsername = profileData.username || username;

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader displayName={displayName} activeTab={activeTab} />
      
      <ProfileInfo displayName={displayName} displayUsername={displayUsername} />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <ProfileContent activeTab={activeTab} />
    </div>
  );
}
