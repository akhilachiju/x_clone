"use client";

import { useSession } from "next-auth/react";
import { useState, use, useEffect } from "react";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { fetchUserByUsername } from "@/lib/userUtils";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContent from "@/components/profile/ProfileContent";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfile({ params }: ProfilePageProps) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Posts");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserByUsername(username);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  // Separate useEffect for profile update listener
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (session?.user?.email?.split('@')[0] === username) {
        // Only refetch if this is the current user's profile
        const fetchUser = async () => {
          try {
            const userData = await fetchUserByUsername(username);
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user:', error);
          }
        };
        fetchUser();
      }
    };

    const handleFollowStateChange = () => {
      // Refetch user data when follow state changes to update counts
      const fetchUser = async () => {
        try {
          const userData = await fetchUserByUsername(username);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      fetchUser();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('followStateChanged', handleFollowStateChange);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('followStateChanged', handleFollowStateChange);
    };
  }, [username, session?.user?.email]);

  // Loading state
  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading...</div>;
  }

  // User not found
  if (!user) {
    return <div className="p-8 text-center text-neutral-500">User not found</div>;
  }

  // Check if viewing own profile
  const isOwnProfile = user.email === session?.user?.email;

  // Require login to view profiles
  if (!session?.user?.email) {
    return <div className="p-8 text-center text-neutral-500">Please log in to view profiles</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader displayName={user.name || user.username} activeTab={activeTab} />
      
      <ProfileInfo 
        displayName={user.name || user.username} 
        displayUsername={user.username}
        isOwnProfile={isOwnProfile}
        user={user}
      />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />
      
      <div className="p-8 text-center text-neutral-500">
        {activeTab === "Posts" && <p>@{user.username} hasn&apos;t posted anything yet</p>}
        {activeTab === "Replies" && <p>@{user.username} hasn&apos;t replied to anything yet</p>}
        {activeTab === "Media" && <p>@{user.username} hasn&apos;t shared any photos or videos yet</p>}
      </div>
    </div>
  );
}
