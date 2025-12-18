import Image from "next/image";
import { getColorFromId } from "@/lib/avatarUtils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: number;
  fallbackText?: string;
  className?: string;
  userId?: string;
}

const sizeMap = {
  32: "w-8 h-8",
  40: "w-10 h-10", 
  48: "w-12 h-12",
  64: "w-16 h-16",
  80: "w-20 h-20",
  128: "w-32 h-32"
};

export default function Avatar({ 
  src, 
  alt, 
  size = 40, 
  fallbackText, 
  className = "",
  userId = ""
}: AvatarProps) {
  const sizeClass = sizeMap[size as keyof typeof sizeMap] || "w-10 h-10";
  const bgColor = getColorFromId(userId || alt);
  
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center ${className}`}>
      {src ? (
        <Image 
          src={src} 
          alt={alt} 
          width={size} 
          height={size} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-white font-bold text-sm ${bgColor}`}>
          {fallbackText?.toUpperCase() || alt?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      )}
    </div>
  );
}
