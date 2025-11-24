"use client";

import { useState } from "react";
import Share from "./components/layouts/Share";

const Homepage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");

  return (
    <div>
      <div className="px-4 pt-4 flex justify-center font-semibold border-b border-b-neutral-800">
        {/* TAB 1: FOR YOU */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`pb-3 flex items-center ${
              activeTab === "for-you"
                ? "text-neutral-300 border-b-4 border-blue-400"
                : "text-neutral-500"
            }`}
          >
            For You
          </button>
        </div>

        {/* TAB 2: FOLLOWING */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setActiveTab("following")}
            className={`pb-3 flex items-center ${
              activeTab === "following"
                ? "text-neutral-300 border-b-4 border-blue-400"
                : "text-neutral-500"
            }`}
          >
            Following
          </button>
        </div>     
      </div>
        <Share />
    </div>
  );
};

export default Homepage;
