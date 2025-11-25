import Link from "next/link";
import Image from "next/image";

const Recommendations = () => {
  return (
    <div className="p-4 rounded-2xl border border-neutral-800 flex flex-col gap-4">
       {/* HEADING */}
      <h2 className="font-bold text-xl">Who to follow</h2>
      {/* USER CARD 1 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image
              src="/general/avatar_1.png"
              alt="Anna Rose"
              width={100}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-md font-bold">Anna Rose</h1>
            <span className="text-gray-500 text-sm">@annarose</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
          Follow
        </button>
      </div>

      {/* USER CARD 2 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image
              src="/general/avatar_1.png"
              alt="Jones Bunny"
              width={100}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-md font-bold">Jones Bunny</h1>
            <span className="text-gray-500 text-sm">@jonesbunny</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
          Follow
        </button>
      </div>

      {/* USER CARD 3 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image
              src="/general/avatar_1.png"
              alt="Danny Fahn"
              width={100}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-md font-bold">Danny Fahn</h1>
            <span className="text-gray-500 text-sm">@dannyfahn</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
          Follow
        </button>
      </div>

      <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm transition-colors">
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
