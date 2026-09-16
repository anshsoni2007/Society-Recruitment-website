interface InitialsAvatarProps {
  name: string;
  className?: string;
}

export function InitialsAvatar({ name, className = "" }: InitialsAvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

  return (
    <div
      aria-label={`${name} initials`}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white ring-1 ring-blue-300/40 ${className}`}
    >
      {initials}
    </div>
  );
}
