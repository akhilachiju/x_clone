"use client";

import { useCallback } from "react";

interface UnfollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
}

const UnfollowModal = ({ isOpen, onClose, onConfirm, username }: UnfollowModalProps) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-black border border-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Unfollow @{username}?</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Their posts will no longer show up in your For You timeline. You can still view their profile, unless their posts are protected.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-white hover:bg-neutral-200 text-black font-semibold py-3 rounded-full transition-colors"
          >
            Unfollow
          </button>
          <button
            onClick={onClose}
            className="w-full bg-transparent border border-neutral-600 text-white font-semibold py-3 rounded-full hover:bg-neutral-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfollowModal;
