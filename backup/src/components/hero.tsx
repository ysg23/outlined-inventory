"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  const stats = [
    { number: "15,000+", label: "Happy Customers" },
    { number: "100%", label: "Authentic" },
    { number: "Since 2020", label: "Trusted" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Improvement Badge */}
      <div className="absolute top-8 left-8 z-10">
        <Badge variant="secondary" className="bg-green-500 text-black font-semibold">
          NEW: Brand Story
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Toronto's Premier{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Streetwear
            </span>{" "}
            Destination
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            From exclusive drops to rare finds - authenticity guaranteed
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 min-w-[140px]"
              >
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-yellow-400 text-black font-semibold text-lg px-8 py-6 rounded-full hover:from-red-600 hover:to-yellow-500 transition-all transform hover:scale-105"
            >
              SHOP LATEST DROPS
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
    </section>
  )
}