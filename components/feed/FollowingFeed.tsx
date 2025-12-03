"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../ui/Loading";
import Avatar from "../ui/Avatar";

interface Post {
  id: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };
}

export default function FollowingFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
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

    // Listen for follow state changes to refresh feed
    const handleFollowStateChange = () => {
      fetchFollowingPosts();
    };

    window.addEventListener('followStateChanged', handleFollowStateChange);
    return () => window.removeEventListener('followStateChanged', handleFollowStateChange);
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
      {posts.map((post) => (
        <div key={post.id} className="border-b border-neutral-800 p-4">
          <div className="flex items-start gap-3">
            <Avatar 
              src={post.user?.image} 
              alt={post.user?.name || 'User'}
              fallbackText={post.user?.name?.charAt(0)}
              className="bg-gray-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{post.user?.name}</span>
                <span className="text-gray-500">@{post.user?.username}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="mt-1">{post.body}</p>
              
              {/* Post Interaction Icons */}
              <div className="flex items-center justify-between gap-4 lg:gap-16 mt-4 text-gray-500">
                <div className="flex items-center justify-between flex-1">
                  <button className="flex items-center gap-2 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-blue-500" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
                    </svg>
                    <span className="group-hover:text-blue-500 text-sm">0</span>
                  </button>
                  
                  <button className="flex items-center gap-2 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-green-500" d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"/>
                    </svg>
                    <span className="group-hover:text-green-500 text-sm">0</span>
                  </button>
                  
                  <button className="flex items-center gap-2 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-pink-500" d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                    </svg>
                    <span className="group-hover:text-pink-500 text-sm">0</span>
                  </button>
                  
                  <button className="flex items-center gap-2 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-blue-500" d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
                    </svg>
                    <span className="group-hover:text-blue-500 text-sm">0</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-blue-500" d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
                    </svg>
                  </button>
                  
                  <button className="cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path className="fill-gray-500 group-hover:fill-blue-500" d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
