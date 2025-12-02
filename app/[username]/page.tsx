"use client";

import { useSession } from "next-auth/react";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { fetchUserByUsername } from "@/lib/userUtils";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  followingIds?: string[];
  followerIds?: string[];
}

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
  activeTab?: string;
}

export default function UserProfile({ params, activeTab: propActiveTab }: ProfilePageProps) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(propActiveTab || "Posts");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect to /posts if on base profile URL
  useEffect(() => {
    if (!propActiveTab) {
      router.replace(`/${username}/posts`);
    }
  }, [propActiveTab, username, router]);

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

    const handleFollowStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string; isFollowing: boolean }>;
      const { userId } = customEvent.detail;
      
      // Refetch user data when follow state changes to update counts
      // Check if the followed user is the one whose profile we're viewing
      if (user?.id === userId) {
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

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('followStateChanged', handleFollowStateChange);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('followStateChanged', handleFollowStateChange);
    };
  }, [username, session?.user?.email, user?.id]);

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
      
      <ProfileTabs activeTab={activeTab} isOwnProfile={isOwnProfile} username={username} />
      
      <ProfileContent activeTab={activeTab} user={user} isOwnProfile={isOwnProfile} />
    </div>
  );
}
