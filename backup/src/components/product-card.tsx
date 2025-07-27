"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Product } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const getStockStatus = () => {
    if (product.stock === 0) return { text: "Out of Stock", color: "bg-gray-600" }
    if (product.stock <= 5) return { text: `Only ${product.stock} left`, color: "bg-red-500" }
    if (product.stock <= 10) return { text: "Low Stock", color: "bg-orange-500" }
    return { text: "In Stock", color: "bg-green-500" }
  }

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const stockStatus = getStockStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10"
    >
      {/* Improvement Badge */}
      {index === 0 && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-green-500 text-black font-semibold">
            NEW: Stock Alerts
          </Badge>
        </div>
      )}

      {/* Product Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Badge className={cn("text-white text-xs", stockStatus.color)}>
          {stockStatus.text}
        </Badge>
        {product.isNew && (
          <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
        )}
        {product.isLimited && (
          <Badge className="bg-purple-500 text-white text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            LIMITED
          </Badge>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="text-6xl">👟</div>
        </motion.div>
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full backdrop-blur-sm transition-colors",
              isWishlisted 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-white/20 hover:bg-white/30"
            )}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
            {product.category}
          </Badge>
        </div>

        <h3 className="text-white font-semibold mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="text-2xl font-bold text-yellow-400 mb-4">
          ${product.price} CAD
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Size:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isAvailable = product.availableSizes.includes(size)
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-all",
                    selectedSize === size
                      ? "bg-yellow-400 text-black"
                      : isAvailable
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed line-through"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 transition-all duration-300",
              isAddedToCart
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            )}
            disabled={!selectedSize || product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddedToCart ? "Added!" : "Add to Cart"}
          </Button>
        </div>

        {/* Size Guide Link */}
        <div className="mt-3 text-center">
          <button className="text-gray-400 hover:text-white text-sm underline">
            Size Guide
          </button>
        </div>
      </div>
    </motion.div>
  )
}