"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import useLoginModal from "@/hooks/useLoginModal";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const loginModal = useLoginModal();
  const hasTriggeredModal = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated" && !hasTriggeredModal.current) {
      hasTriggeredModal.current = true;
      loginModal.onOpen();
    }
    if (status === "authenticated") {
      hasTriggeredModal.current = false;
    }
  }, [status, loginModal.onOpen]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Welcome to X Clone</h1>
          <p className="mb-4">Please sign in to continue</p>
          <button 
            onClick={() => loginModal.onOpen()}
            className="bg-x-blue hover:bg-x-blue-hover text-white px-6 py-2 rounded-full transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
