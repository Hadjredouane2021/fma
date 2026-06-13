import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { glassCard, glassContent } from "@/lib/surface-styles";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, padding = "md", children, ...props }, ref) => {
    const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
    return (
      <div
        ref={ref}
        className={cn(glassCard, hover && "cursor-pointer", paddings[padding], className)}
        {...props}
      >
        <div className={glassContent}>{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4", className)} {...props}>{children}</div>
);

const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-xl font-bold text-primary-500", className)} {...props}>{children}</h3>
);

const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-[var(--text-2)]", className)} {...props}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent };
