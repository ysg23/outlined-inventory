"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterOption {
  id: string
  label: string
  active: boolean
}

interface FilterGroup {
  title: string
  options: FilterOption[]
}

export function SmartFilters() {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      title: "Brands",
      options: [
        { id: "jordan", label: "Jordan", active: false },
        { id: "nike", label: "Nike", active: false },
        { id: "yeezy", label: "Yeezy", active: false },
        { id: "supreme", label: "Supreme", active: false },
        { id: "off-white", label: "Off-White", active: false },
      ],
    },
    {
      title: "Sizes",
      options: [
        { id: "8", label: "8", active: false },
        { id: "9", label: "9", active: false },
        { id: "10", label: "10", active: false },
        { id: "11", label: "11", active: false },
        { id: "12", label: "12", active: false },
      ],
    },
    {
      title: "Price Range",
      options: [
        { id: "under-200", label: "Under $200", active: false },
        { id: "200-500", label: "$200-$500", active: false },
        { id: "500-1000", label: "$500-$1000", active: false },
        { id: "over-1000", label: "$1000+", active: false },
      ],
    },
    {
      title: "Availability",
      options: [
        { id: "in-stock", label: "In Stock", active: false },
        { id: "coming-soon", label: "Coming Soon", active: false },
        { id: "pre-order", label: "Pre-Order", active: false },
        { id: "limited", label: "Limited Edition", active: false },
      ],
    },
  ])

  const toggleFilter = (groupIndex: number, optionId: string) => {
    setFilterGroups(prev => 
      prev.map((group, index) => 
        index === groupIndex 
          ? {
              ...group,
              options: group.options.map(option => 
                option.id === optionId 
                  ? { ...option, active: !option.active }
                  : option
              )
            }
          : group
      )
    )
  }

  const getActiveFiltersCount = () => {
    return filterGroups.reduce((count, group) => 
      count + group.options.filter(option => option.active).length, 0
    )
  }

  const clearAllFilters = () => {
    setFilterGroups(prev => 
      prev.map(group => ({
        ...group,
        options: group.options.map(option => ({ ...option, active: false }))
      }))
    )
  }

  return (
    <section className="bg-gray-900 py-16 border-b border-gray-800">
      <div className="absolute top-8 left-8 z-10">
        <Badge variant="secondary" className="bg-green-500 text-black font-semibold">
          NEW: Smart Filters
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Find Your Perfect Style
          </motion.h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            {getActiveFiltersCount() > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-gray-400">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
            >
              <h3 className="text-yellow-400 font-semibold mb-4 text-center">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {group.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter(groupIndex, option.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all transform hover:scale-105",
                      option.active
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}