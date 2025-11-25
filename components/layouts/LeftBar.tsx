"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";

const menuList = [
  {
    id: 1,
    name: "Home",
    link: "/",
    icon: "home.svg",
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
     link: "/",
     icon: "logo_2.png",
   },
  {
    id: 10,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
];

const LeftBar = () => {
  const { data: session } = useSession();

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pb-2">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-xl items-center xl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818] ">
          <Image src="/icons/logo_2.png" alt="logo" width={35} height={35} />
        </Link>
        {/* MENU LIST */}
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
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
          ))}
          {/* LOGOUT */}
          <button
            onClick={() => {
              toast.success('Logged out successfully');
              setTimeout(() => {
                signOut();
              }, 800);
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
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xl:hidden"
        >
          <Image src="/icons/post.svg" alt="new post" width={32} height={32} />
        </Link>
        <Link
          href="/compose/post"
          className="hidden xl:block bg-white text-black rounded-full font-bold text-sm py-4 px-25"
        >
          Post
        </Link>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between xl:justify-start w-full p-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session?.user?.name || "User"}
                width={100}
                height={100}
                className="object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="font-bold">{session?.user?.name || "User"}</span>
            <span className="text-sm text-neutral-500">@{session?.user?.email?.split('@')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
