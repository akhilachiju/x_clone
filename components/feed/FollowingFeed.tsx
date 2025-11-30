"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../ui/Loading";
import Avatar from "../ui/Avatar";

export default function FollowingFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/posts/following');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch following posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingPosts();
  }, [session]);

  if (loading) {
    return <Loading message="Loading posts from people you follow..." className="p-8 text-center" fullScreen={false} />;
  }

  if (posts.length === 0) {
    return (
      <div className="mx-32 mt-10">
        <h2 className="text-3xl font-bold mb-4">Welcome to X!</h2>
        <p className="text-neutral-500 mb-6 max-w-md">
          This is the best place to see what&apos;s happening in your world. Find some people and topics to follow now.
        </p>
        <Link href="/connect" className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors inline-block">
          Let&apos;s go!
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <div key={post.id} className="border-b border-neutral-800 p-4">
          <div className="flex items-start gap-3">
            <Avatar 
              src={post.author?.image} 
              alt={post.author?.name || 'User'}
              fallbackText={post.author?.name?.charAt(0)}
              className="bg-gray-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{post.author?.name}</span>
                <span className="text-gray-500">@{post.author?.username}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1">{post.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
