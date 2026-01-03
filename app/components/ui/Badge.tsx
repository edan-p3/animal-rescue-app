import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary-hover",
        secondary: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-200/80",
        destructive: "border-transparent bg-urgency-high text-white hover:bg-urgency-high/80",
        outline: "text-foreground",
        urgencyHigh: "border-transparent bg-urgency-high text-white",
        urgencyMedium: "border-transparent bg-urgency-medium text-white",
        urgencyLow: "border-transparent bg-urgency-low text-white",
        success: "border-transparent bg-status-success text-white",
        warning: "border-transparent bg-status-warning text-white",
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
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

