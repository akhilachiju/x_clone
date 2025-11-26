"use client";

import Share from "@/components/layouts/Share";
import { useState } from "react";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div>
      <div className="flex justify-center font-semibold border-b border-b-neutral-800">
        {/* TAB 1: FOR YOU */}
        <div className="flex-1 flex justify-center px-4 pt-4 hover:bg-[#181818]">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`pb-3 flex items-center ${
              activeTab === "for-you"
                ? "text-neutral-300 border-b-4 border-sky-500"
                : "text-neutral-500"
            }`}
          >
            For You
          </button>
        </div>

        {/* TAB 2: FOLLOWING */}
        <div className="flex-1 flex justify-center px-4 pt-4 hover:bg-[#181818]">
          <button
            onClick={() => setActiveTab("following")}
            className={`pb-3 flex items-center ${
              activeTab === "following"
                ? "text-neutral-300 border-b-4 border-sky-500"
                : "text-neutral-500"
            }`}
          >
            Following
          </button>
        </div>     
      </div>
      
      <div className="border-b border-neutral-800">
        <Share />
      </div>
      
      {/* Tab Content */}
      {activeTab === "for-you" && (
        <div>
          {/* Add posts feed here later */}
        </div>
      )}
      
      {activeTab === "following" && (
        <div className="mx-32 mt-10">
          <h2 className="text-3xl font-bold mb-4">Welcome to X!</h2>
          <p className="text-neutral-500 mb-6 max-w-md">
            This is the best place to see what&apos;s happening in your world. Find some people and topics to follow now.
          </p>
          <button className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors">
            Let&apos;s go!
          </button>
        </div>
      )}  
    </div>
  );
};

export default Homepage;
