import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "gold" | "accent" | "gray" | "green" | "red";
}

export function Badge({ className, variant = "primary", children, ...props }: BadgeProps) {
  const variants = {
    primary:
      "bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-900/35 dark:text-primary-200 dark:border-primary-700/50",
    gold: "bg-gold-50 text-gold-700 border-gold-100 dark:bg-gold-900/30 dark:text-gold-200 dark:border-gold-700/40",
    accent:
      "bg-accent-50 text-accent-700 border-accent-100 dark:bg-accent-900/35 dark:text-accent-200 dark:border-accent-700/50",
    gray: "bg-[var(--bg-alt)] text-[var(--text-2)] border-[var(--border)]",
    green:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/45 dark:text-green-300 dark:border-green-800/50",
    red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
