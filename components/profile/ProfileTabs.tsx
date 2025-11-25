"use client";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = ["Posts", "Replies", "Highlights", "Articles", "Media", "Likes"];

  return (
    <div className="border-b border-neutral-800">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${
              activeTab === tab
                ? "text-white"
                : "text-neutral-500 hover:bg-neutral-900"
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
