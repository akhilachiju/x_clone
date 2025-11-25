"use client";

import Image from "next/image";
import { IoCalendarOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFollow } from "@/contexts/FollowContext";

interface ProfileInfoProps {
  displayName: string;
  displayUsername: string;
}

export default function ProfileInfo({ displayName, displayUsername }: ProfileInfoProps) {
  const { data: session } = useSession();
  const { followingCount, setFollowingCount } = useFollow();
  const [followersCount, setFollowersCount] = useState(0);

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
    <div className="relative px-4 pb-4">
      {/* Profile Picture */}
      <div className="absolute -top-16 left-4 border-4 border-black rounded-full w-32 h-32 overflow-hidden">
        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={displayName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-3xl">
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="flex justify-end pt-4">
        <button className="border border-neutral-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-neutral-900 transition-colors">
          Edit profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{displayName}</h2>
        <p className="text-neutral-500">@{displayUsername}</p>

        <div className="flex items-center gap-2 mt-3 text-neutral-500">
          <IoCalendarOutline size={16} />
          <span className="text-sm">Joined October 2025</span>
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
    </div>
  );
}
