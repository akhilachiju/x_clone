"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import { useProfile } from "@/hooks/useProfile";

const LeftBar = () => {
  const { data: session } = useSession();
  const { image: profileImage, name: profileName, username } = useProfile();

  const displayName = profileName || session?.user?.name || "User";

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  const menuList = [
    {
      id: 1,
      name: "Home",
      link: "/",
      icon: "home.svg",
      onClick: handleHomeClick,
    },
    {
      id: 3,
      name: "Notifications",
      link: "/",
      icon: "notification.svg",
    },
     {
       id: 9,
       name: "Premium",
       link: "/premium_sign_up",
       icon: "logo_2.png",
     },
    {
      id: 10,
      name: "Profile",
      link: `/${session?.user?.email?.split('@')[0] || 'profile'}`,
      icon: "profile.svg",
    },
  ];

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pb-2">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-xl items-center xl:items-start">
        {/* LOGO */}
        <button onClick={handleHomeClick} className="p-2 rounded-full hover:bg-[#181818] ">
          <Image src="/icons/logo_2.png" alt="logo" width={35} height={35} />
        </button>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            item.onClick ? (
              <button
                key={item.id}
                onClick={item.onClick}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <Image
                  src={`/icons/${item.icon}`}
                  alt={item.name}
                  width={28}
                  height={28}
                />
                <span className="hidden xl:inline text-xl">{item.name}</span>
              </button>
            ) : (
              <Link
                href={item.link}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                key={item.id}
              >
                <Image
                  src={`/icons/${item.icon}`}
                  alt={item.name}
                  width={28}
                  height={28}
                />
                <span className="hidden xl:inline text-xl">{item.name}</span>
              </Link>
            )
          ))}
          {/* LOGOUT */}
          <button
            onClick={() => {
              toast.success('Logged out successfully');
              setTimeout(() => {
                signOut();
              }, 500);
            }}
            className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
          >
            <BiLogOut size={28} />
            <span className="hidden xl:inline text-xl">Logout</span>
          </button>
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xl:hidden hover:bg-neutral-200 transition-colors"
        >
          <Image src="/icons/post.svg" alt="new post" width={32} height={32} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xl:block bg-white text-black rounded-full font-bold text-sm py-4 px-25 hover:bg-neutral-200"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between xl:justify-start w-full rounded-full hover:bg-[#181818] p-2">
        <div className="flex items-center gap-2">
          <Avatar 
            src={profileImage} 
            alt={displayName || "User"}
            fallbackText={displayName?.charAt(0)}
            className="bg-gray-600"
          />
          <div className="hidden xl:flex flex-col">
            <span className="font-bold">{displayName}</span>
            <span className="text-sm text-neutral-500">@{username || session?.user?.email?.split('@')[0]}</span>
          </div>
        </div>
        <div className="hidden xl:block cursor-pointer font-bold pl-10">...</div>
      </div>
    </div>
  );
};

export default LeftBar;
