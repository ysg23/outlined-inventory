"use client"

import { motion } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { mockProducts } from "@/lib/utils"

export function ProductShowcase() {
  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Drops
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the latest and most exclusive releases from top brands. 
            Every item is authenticated and ready to elevate your style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <button className="bg-gradient-to-r from-red-500 to-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:from-red-600 hover:to-yellow-500 transition-all transform hover:scale-105">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  )
}