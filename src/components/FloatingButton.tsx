import React from "react";

type FloatingButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2
        bg-[#243043] text-white rounded-full shadow-md
        hover:bg-[#1b2333] transition-all cursor-pointer
      `}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};
