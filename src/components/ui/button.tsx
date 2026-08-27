/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-primary hover:bg-primary/90 glow-primary",
        destructive: "bg-danger text-text-primary hover:bg-danger/90",
        outline: "border border-border bg-transparent hover:bg-surface text-text-primary hover:border-primary/50",
        secondary: "bg-secondary text-[#080B14] hover:bg-secondary/90 glow-secondary",
        ghost: "hover:bg-surface hover:text-text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass hover:bg-white/5 text-text-primary hover:border-primary/50 shadow-md",
        reward: "bg-reward text-[#080B14] hover:bg-reward/90 shadow-[0_0_20px_rgba(245,185,66,0.4)]",
        success: "bg-success text-text-primary hover:bg-success/90 shadow-[0_0_20px_rgba(34,197,94,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
