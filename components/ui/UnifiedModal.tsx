import React, { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showLogo?: boolean;
  className?: string;
}

export default function UnifiedModal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  showLogo = false,
  className = "" 
}: ModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={handleClose}></div>
      <div className={`relative bg-black border border-neutral-800 rounded-2xl w-full max-w-lg mx-4 ${className}`}>
        {(title || showLogo) && (
          <div className="flex items-center justify-center p-6 relative">
            <button
              onClick={handleClose}
              className="absolute left-6 p-2 rounded-full hover:bg-neutral-800 text-white transition"
            >
              <AiOutlineClose size={20} />
            </button>
            
            {showLogo && (
              <div className="w-8 h-8">
                <Image
                  src="/icons/logo_2.png"
                  alt="X Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {title && (
              <h2 className="text-3xl font-bold text-white">{title}</h2>
            )}
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
