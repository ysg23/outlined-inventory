"use client"

import { motion } from "framer-motion"
import { Package, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  variant?: "default" | "spinner" | "dots" | "skeleton"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loading({ 
  variant = "default", 
  size = "md", 
  text = "Loading...",
  className 
}: LoadingProps) {
  
  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <Loader2 className={cn(
          "animate-spin",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-6 w-6", 
          size === "lg" && "h-8 w-8"
        )} />
        {text && <span className="text-gray-600">{text}</span>}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "bg-blue-500 rounded-full",
              size === "sm" && "w-2 h-2",
              size === "md" && "w-3 h-3",
              size === "lg" && "w-4 h-4"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        {text && <span className="ml-3 text-gray-600">{text}</span>}
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-elevated rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-shimmer" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-shimmer" />
                <div className="flex space-x-2">
                  <div className="h-6 w-12 bg-gray-200 rounded-full animate-shimmer" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-shimmer" />
                </div>
                <div className="h-2 bg-gray-200 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 py-12", className)}>
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 shadow-lg"
      >
        <Package className={cn(
          "text-white",
          size === "sm" && "h-6 w-6",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-12 w-12"
        )} />
      </motion.div>
      
      <div className="text-center space-y-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "font-semibold text-gray-900",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-lg"
          )}
        >
          {text}
        </motion.div>
        
        <div className="flex space-x-1 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}