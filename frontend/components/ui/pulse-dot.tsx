import { cn } from "@/lib/utils"

interface PulseDotProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PulseDot({ className, size = "md" }: PulseDotProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn("rounded-full bg-green-500 animate-pulse", sizeClasses[size])} />
      <div className={cn("absolute inset-0 rounded-full bg-green-500 animate-ping", sizeClasses[size])} />
    </div>
  )
}
