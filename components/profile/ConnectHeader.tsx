"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack, IoSettingsOutline } from "react-icons/io5";

interface ConnectHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ConnectHeader({ activeTab, setActiveTab }: ConnectHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-neutral-800/50">
      <div className="flex items-center justify-between px-4 py-1">
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-neutral-900 transition-colors"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Connect</h1>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-neutral-900 transition-colors">
          <IoSettingsOutline size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex">
        {["Who to follow", "Creators for you"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${
              activeTab === tab
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-sky-500 h-1 rounded-full" 
                style={{ width: `${tab.length * 8}px` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
