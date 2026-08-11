import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary/20 text-primary glow-primary",
        secondary:
          "border-secondary/50 bg-secondary/20 text-secondary glow-secondary",
        success:
          "border-success/50 bg-success/20 text-success shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        reward:
          "border-reward/50 bg-reward/20 text-reward shadow-[0_0_15px_rgba(245,185,66,0.3)]",
        destructive:
          "border-danger/50 bg-danger/20 text-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        outline: "text-textPrimary border-border bg-transparent",
        glass: "glass text-textPrimary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className, "transition-transform duration-200 hover:scale-105")} {...props} />
  );
}

export { Badge, badgeVariants }
