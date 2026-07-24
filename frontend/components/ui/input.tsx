import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-borderPrimary bg-bgPrimary/50 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/60 shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ringPrimary/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
