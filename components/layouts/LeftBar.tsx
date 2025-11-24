import Link from "next/link";
import Image from "next/image";

const menuList = [
  {
    id: 1,
    name: "Home",
    link: "/",
    icon: "home.svg",
  },
  // {
  //   id: 2,
  //   name: "Explore",
  //   link: "/",
  //   icon: "explore.svg",
  // },
  {
    id: 3,
    name: "Notifications",
    link: "/",
    icon: "notification.svg",
  },
  // {
  //   id: 4,
  //   name: "Messages",
  //   link: "/",
  //   icon: "message.svg",
  // },
  // {
  //   id: 5,
  //   name: "Bookmarks",
  //   link: "/",
  //   icon: "bookmark.svg",
  // },
  // {
  //   id: 6,
  //   name: "Lists",
  //   link: "/",
  //   icon: "lists.png",
  // },
  // {
  //   id: 7,
  //   name: "Grok",
  //   link: "/",
  //   icon: "grok.png",
  // },
  // {
  //   id: 8,
  //   name: "Communities",
  //   link: "/",
  //   icon: "community.svg",
  // },
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
  // {
  //   id: 11,
  //   name: "More",
  //   link: "/",
  //   icon: "more.svg",
  // },
];

const LeftBar = () => {
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
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src="/general/avatar_1.png"
              alt="akhila chandran"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="font-bold">Akhila</span>
            <span className="text-sm text-neutral-500">@akhilachandran</span>
          </div>
        </div>
        <div className="hidden xl:block cursor-pointer font-bold absolute right-0.5">...</div>
      </div>
    </div>
  );
};

export default LeftBar;
