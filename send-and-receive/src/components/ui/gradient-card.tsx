import { cn } from "@/lib/utils";
import { Card } from "./card";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export const GradientCard = ({ className, variant = 'default', children, ...props }: GradientCardProps) => {
  return (
    <Card
      className={cn(
        "bg-gradient-card backdrop-blur-sm border-border/50",
        variant === 'elevated' && "shadow-elevated",
        variant === 'default' && "shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};
