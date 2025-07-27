"use client"

import { motion } from "framer-motion"
import { Star, Instagram, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SocialProof() {
  const instagramPosts = [
    {
      id: 1,
      username: "sneakerhead_toronto",
      caption: "Just copped these Travis Scott 4s from @outlined! 🔥",
      likes: 234,
      image: "👟",
    },
    {
      id: 2,
      username: "streetwear_queen",
      caption: "Supreme box logo hoodie came in perfect condition 💯",
      likes: 156,
      image: "👕",
    },
    {
      id: 3,
      username: "yeezy_collector",
      caption: "Another W from Outlined! Fast shipping to Vancouver 📦",
      likes: 89,
      image: "📦",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Tyler",
      location: "Montreal",
      rating: 5,
      text: "Scored the latest Yeezys on Outlined. Easy checkout, fast shipping. They know what's up in the sneaker game!",
      verified: true,
    },
    {
      id: 2,
      name: "Emma",
      location: "Edmonton",
      rating: 5,
      text: "Outlined is my go-to for streetwear. The Fear of God Essentials I got were fire. Great service, real deal gear.",
      verified: true,
    },
    {
      id: 3,
      name: "Priya",
      location: "Ottawa",
      rating: 5,
      text: "Outlined's got the rare drops. Copped my Grinch Kobes here. Authentic and fast. They get it right every time.",
      verified: true,
    },
  ]

  return (
    <section className="bg-gray-900 py-20">
      <div className="absolute top-8 left-8 z-10">
        <Badge variant="secondary" className="bg-green-500 text-black font-semibold">
          NEW: Social Integration
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Style Inspiration from Our Community
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how our customers are styling their latest pickups and join the conversation.
          </p>
        </motion.div>

        {/* Instagram Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl">
                {post.image}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-white font-semibold">@{post.username}</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{post.caption}</p>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <span>❤️ {post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-yellow-400/50 transition-all group"
            >
              <div className="flex items-center gap-2 mb-4">
                <Quote className="w-5 h-5 text-yellow-400" />
                <div className="flex text-yellow-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
                {testimonial.verified && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Verified
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">25K+</div>
              <div className="text-gray-400">Instagram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Reviews This Month</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}