"use client";

import React, { useState } from "react";
import Image from "next/image";

// Type for post settings
type ShareSettings = {
  type: "original" | "wide" | "square";
  sensitive: boolean;
};

// Placeholder share action
const shareAction = async (formData: FormData, settings: ShareSettings) => {
  console.log("Post submitted:", formData.get("desc"), settings);
};

const Share = () => {
  const [desc, setDesc] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desc.trim()) return; // Prevent empty post

    const formData = new FormData();
    formData.append("desc", desc);

    await shareAction(formData, { type: "original", sensitive: false });

    window.dispatchEvent(new Event("refreshFeed"));
    setDesc(""); // Reset input
  };

  return (
    <form className="p-4 flex gap-4" onSubmit={handleSubmit}>
      {/* AVATAR */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src="/general/avatar_1.png"
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>

      {/* INPUT + ACTIONS */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          name="desc"
          placeholder="What's happening?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-transparent outline-none placeholder:text-gray-500 text-xl w-full"
        />

        {/* ICONS ROW */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            <Image src="/icons/image.svg" alt="Image" width={20} height={20} className="cursor-pointer" />
            <Image src="/icons/gif.svg" alt="GIF" width={20} height={20} className="cursor-pointer" />
            <Image src="/icons/poll.svg" alt="Poll" width={20} height={20} className="cursor-pointer" />
            <Image src="/icons/emoji.svg" alt="Emoji" width={20} height={20} className="cursor-pointer" />
            <Image src="/icons/schedule.svg" alt="Schedule" width={20} height={20} className="cursor-pointer" />
            <Image src="/icons/location.svg" alt="Location" width={20} height={20} className="cursor-pointer" />
          </div>

          {/* POST BUTTON LEFT-ALIGNED */}
          <button
            type="submit"
            className="bg-white text-black font-bold rounded-full py-1 px-4 hover:bg-gray-200 transition"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default Share;
