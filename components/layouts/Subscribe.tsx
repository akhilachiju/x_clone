import Link from "next/link";

const SubscribePremium = () => {
  return (
    <div className="p-4 rounded-2xl border border-neutral-800 flex flex-col gap-4">
      {/* HEADING */}
      <h2 className="font-bold text-xl">Subscribe to Premium</h2>
      
      {/* DESCRIPTION */}
      <p className="text-sm text-gray-400">
        Unlock new features and, if eligible, receive a share of revenue.
      </p>

      {/* SUBSCRIBE BUTTON */}
      <Link
        href="/subscribe"
        className="self-start py-2 px-4 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors"
      >
        Subscribe
      </Link>
    </div>
  );
};

export default SubscribePremium;
