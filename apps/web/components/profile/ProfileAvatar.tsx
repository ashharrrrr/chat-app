"use client";

interface ProfileAvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-24 w-24 text-xl",
};

export default function ProfileAvatar({
  name,
  image,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-muted ${sizeMap[size]} ${className}`}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold">
          {initial}
        </div>
      )}
    </div>
  );
}
