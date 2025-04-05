import Link from "next/link";
import React from "react";

interface FooterNavItemProps {
  id: string;
  label: string;
  icon: React.ReactElement;
  href: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const FooterNavItem: React.FC<FooterNavItemProps> = ({
  id,
  label,
  icon,
  href,
  isActive,
  onClick,
}) => {
  return (
    <li>
      <Link
        href={href}
        onClick={() => onClick(id)}
        className={`flex flex-col items-center space-y-1 ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Link>
    </li>
  );
};
