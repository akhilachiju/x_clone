"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ProfileCard from "@/components/profile/ProfileCard";
import { fetchUserByUsername, fetchUsersByIds } from "@/lib/userUtils";
import { useFollowSystem } from "@/hooks/useFollowSystem";
import Header from "../ui/Header";
import Loading from "../ui/Loading";

interface FollowListPageProps {
  type: 'followers' | 'following';
}

export default function FollowListPage({ type }: FollowListPageProps) {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { performFollow } = useFollowSystem();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserByUsername(username);
        setUser(userData);

        const targetIds = type === 'followers' ? userData.followerIds : userData.followingIds;
        if (targetIds && targetIds.length > 0) {
          const filteredUsers = await fetchUsersByIds(targetIds);
          setUsers(filteredUsers);
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
  }, [username, type]);

  useEffect(() => {
    const handleFollowChange = (event: any) => {
      const { userId, isFollowing } = event.detail;
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing } : user
      ));
    };

    window.addEventListener('followStateChanged', handleFollowChange);
    return () => window.removeEventListener('followStateChanged', handleFollowChange);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const title = type === 'followers' ? 'Followers' : 'Following';
  const count = type === 'followers' ? user?.followerIds?.length || 0 : user?.followingIds?.length || 0;

  return (
    <div className="bg-black text-white min-h-screen">
      <Header 
        title={user?.name || username}
        backHref={`/${username}`}
      >
        <div className="px-4 pb-2">
          <p className="text-sm text-neutral-500">{count} {title}</p>
        </div>
      </Header>

      <div className="max-w-2xl mx-auto">
        {users.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <p>No {type} yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {users.map((user) => (
              <ProfileCard
                key={user.id}
                user={user}
                onFollow={(userId) => {
                  performFollow(userId);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
