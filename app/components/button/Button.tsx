import React from "react";

interface ButtonProps {
  label: string;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  secondary,
  fullWidth,
  large,
  onClick,
  disabled,
  outline,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full
        font-semibold
        transition
        border-2
        hover:opacity-80
        disabled:opacity-70
        disabled:cursor-not-allowed
        
        ${fullWidth ? "w-full" : "w-fit"}

        /* Background */
        ${outline ? "bg-transparent" : secondary ? "bg-white" : "bg-sky-500"}

        /* Text Color */
        ${outline ? "text-white" : secondary ? "text-black" : "text-white"}

        /* Border */
        ${
          outline
            ? "border-white"
            : secondary
            ? "border-black"
            : "border-sky-500"
        }

        /* Sizes */
        ${large ? "text-xl px-5 py-3" : "text-md px-4 py-2"}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
