import { cn } from "@/lib/utils";
import {
  buttonBase,
  buttonPrimary,
  buttonSecondary,
  buttonOutline,
  buttonGhost,
  buttonGold,
  buttonDangerGhost,
  buttonSizes,
  type ButtonShape,
  type ButtonSize,
} from "@/lib/button-styles";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger-ghost";
  size?: ButtonSize;
  shape?: ButtonShape;
  isLoading?: boolean;
}

const variants = {
  primary: buttonPrimary,
  secondary: buttonSecondary,
  outline: buttonOutline,
  ghost: buttonGhost,
  gold: buttonGold,
  "danger-ghost": buttonDangerGhost,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shape = "pill", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonBase, variants[variant], buttonSizes[shape][size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
