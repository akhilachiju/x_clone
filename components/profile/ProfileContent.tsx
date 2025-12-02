"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WhoToFollow from "./WhoToFollow";
import { IoLockClosed } from "react-icons/io5";

interface ProfileContentProps {
  activeTab: string;
}

export default function ProfileContent({ activeTab }: ProfileContentProps) {
  const pathname = usePathname();
  // Show WhoToFollow for Posts and Replies exactly like in screenshots
  if (activeTab === "Posts" || activeTab === "Replies") {
    return <WhoToFollow compact={false} showBio={true} />;
  }

  // Special handling for Likes tab with privacy notice
  if (activeTab === "Likes") {
    return (
      <div>
        {/* Privacy Notice Bar */}
        <div className="bg-blue-900/30 mx-1 mt-1 p-3 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <IoLockClosed className="text-white text-xs" />
          </div>
          <span className="text-blue-300 text-sm">Your likes are private. Only you can see them.</span>
        </div>
        
        {/* Content */}
        <div className="py-12">
          <div className="max-w-md mx-auto px-10 text-left">
            <h2 className="text-white text-3xl font-bold mb-3">You don&apos;t have any likes yet</h2>
            <p className="text-neutral-500 text-base leading-relaxed mb-6">Tap the heart on any post to show it some love. When you do, it&apos;ll show up here.</p>
          </div>
        </div>
      </div>
    );
  }

  const getTabContent = () => {
    switch (activeTab) {
      case "Highlights":
        return {
          title: "Highlight on your profile",
          subtitle: "You must be subscribed to Premium to highlight posts on your profile.",
          showButton: true,
          buttonText: "Subscribe to Premium",
          buttonStyle: "bg-white text-black hover:bg-neutral-200"
        };
      case "Articles":
        return {
          title: "Write Articles on X",
          subtitle: "You must be subscribed to Premium+ to write Articles on X",
          showButton: true,
          buttonText: "Upgrade to Premium+",
          buttonStyle: "bg-white text-black hover:bg-neutral-200"
        };
      case "Media":
        return {
          title: "Lights, camera … attachments!",
          subtitle: "When you post photos or videos, they will show up here.",
          showButton: false
        };
      default:
        return {
          title: "No content yet",
          subtitle: "Content will appear here.",
          showButton: false
        };
    }
  };

  const content = getTabContent();

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto px-10 text-left">
        <h2 className="text-white text-3xl font-bold mb-3">{content.title}</h2>
        <p className="text-neutral-500 text-base leading-relaxed mb-6">{content.subtitle}</p>
        
        {content.showButton && (
          <Link href="/premium_sign_up" className={`inline-block px-8 py-3 rounded-full font-bold text-base transition-colors ${content.buttonStyle}`}>
            {content.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
