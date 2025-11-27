"use client";

import Link from "next/link";
import { IoArrowBack, IoSearch } from "react-icons/io5";

interface ProfileHeaderProps {
  displayName: string;
  activeTab: string;
}

export default function ProfileHeader({ displayName, activeTab }: ProfileHeaderProps) {
  const getHeaderCount = () => {
    const counts = {
      Posts: 0,
      Replies: 0,
      Highlights: 0,
      Articles: 0,
      Media: 0,
      Likes: 0
    };

    switch (activeTab) {
      case "Likes":
        return `${counts.Likes} likes`;
      case "Media":
        return `${counts.Media} photos & videos`;
      default:
        return `${counts.Posts} posts`;
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 py-1">
      <div className="flex items-center gap-8">
        <Link href="/" className="p-2 rounded-full hover:bg-neutral-900 transition-colors">
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{displayName}</h1>
          <p className="text-sm text-neutral-500">{getHeaderCount()}</p>
        </div>
      </div>
      <button className="p-2 rounded-full hover:bg-neutral-900 transition-colors">
        <IoSearch size={20} />
      </button>
    </div>
  );
}
