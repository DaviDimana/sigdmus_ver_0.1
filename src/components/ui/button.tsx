
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 hover:shadow-lg group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-blue-600 hover:shadow-blue-300/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-600 hover:shadow-red-300/50",
        outline:
          "border border-input bg-background hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-blue-200/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-blue-100 hover:text-blue-700 hover:shadow-blue-200/50",
        ghost: "hover:bg-blue-50 hover:text-blue-600 hover:shadow-blue-200/50",
        link: "text-primary underline-offset-4 hover:underline hover:text-blue-600 hover:font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
        className={cn(buttonVariants({ variant, size, className }), 
          "group [&_svg]:transition-all [&_svg]:duration-200 [&_svg]:group-hover:scale-110 [&_span]:transition-all [&_span]:duration-200 [&_span]:group-hover:font-semibold"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
