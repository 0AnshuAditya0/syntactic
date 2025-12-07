import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F29F67] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 
          "bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] shadow-md hover:shadow-lg font-semibold",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-[#F29F67] text-[#F29F67] hover:bg-[#F29F67] hover:text-[#1E1E2C] font-semibold",
        secondary:
          "bg-[#1E1E2C] text-white hover:bg-[#2A2A3C] shadow-md hover:shadow-lg",
        ghost: 
          "hover:bg-[#F29F67]/10 text-[#1E1E2C] hover:text-[#F29F67]",
        link: 
          "text-[#F29F67] underline-offset-4 hover:underline",
      },
      size: {
        default: "px-10 py-5",
        sm: "px-4 py-2.5 text-sm rounded-lg",
        lg: "px-12 py-6 text-lg",
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
