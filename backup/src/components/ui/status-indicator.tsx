"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Wifi, WifiOff, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "online" | "offline" | "connecting" | "error" | "warning" | "success"
  label?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusIndicator({ 
  status, 
  label, 
  showIcon = true, 
  size = "md",
  className 
}: StatusIndicatorProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-100",
          dot: "bg-green-500",
          label: label || "Online"
        }
      case "offline":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-100",
          dot: "bg-red-500",
          label: label || "Offline"
        }
      case "connecting":
        return {
          icon: Wifi,
          color: "text-blue-600",
          bg: "bg-blue-100",
          dot: "bg-blue-500",
          label: label || "Connecting..."
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bg: "bg-red-100",
          dot: "bg-red-500",
          label: label || "Error"
        }
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bg: "bg-orange-100",
          dot: "bg-orange-500",
          label: label || "Warning"
        }
      case "success":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-100",
          dot: "bg-green-500",
          label: label || "Success"
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const sizeClasses = {
    sm: {
      container: "px-2 py-1 text-xs",
      icon: "h-3 w-3",
      dot: "w-2 h-2"
    },
    md: {
      container: "px-3 py-1.5 text-sm",
      icon: "h-4 w-4",
      dot: "w-2.5 h-2.5"
    },
    lg: {
      container: "px-4 py-2 text-base",
      icon: "h-5 w-5",
      dot: "w-3 h-3"
    }
  }

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 rounded-full font-medium",
      config.bg,
      config.color,
      sizeClasses[size].container,
      className
    )}>
      {showIcon && (
        <motion.div
          animate={status === "connecting" ? { rotate: 360 } : {}}
          transition={status === "connecting" ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
        >
          <Icon className={sizeClasses[size].icon} />
        </motion.div>
      )}
      
      <span>{config.label}</span>
      
      <motion.div
        className={cn("rounded-full", config.dot, sizeClasses[size].dot)}
        animate={
          status === "online" || status === "connecting" 
            ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
            : {}
        }
        transition={
          status === "online" || status === "connecting"
            ? { duration: 2, repeat: Infinity }
            : {}
        }
      />
    </div>
  )
}