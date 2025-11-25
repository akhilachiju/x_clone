"use client";

import { useSession } from "next-auth/react";
import { useState, use, useMemo } from "react";
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

  const userData = useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name || username,
        username: session.user.email?.split('@')[0] || username,
        email: session.user.email || '',
        createdAt: new Date().toISOString()
      };
    }
    return null;
  }, [session, username]);

  const displayName = userData?.name || username;
  const displayUsername = userData?.username || username;

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader displayName={displayName} activeTab={activeTab} />
      
      {/* Cover Photo */}
      <div className="h-48 bg-neutral-800"></div>
      
      <ProfileInfo displayName={displayName} displayUsername={displayUsername} />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <ProfileContent activeTab={activeTab} displayUsername={displayUsername} />
      
      {activeTab === "Posts" && <WhoToFollow compact={true} />}
    </div>
  );
}
