import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mockProducts = [
  {
    id: "1",
    name: "Air Jordan 4 \"Travis Scott\"",
    price: 850,
    image: "/api/placeholder/400/400",
    brand: "Jordan",
    category: "sneakers",
    stock: 3,
    sizes: ["8", "9", "10", "11", "12"],
    availableSizes: ["9", "10", "12"],
    isNew: true,
    isLimited: true
  },
  {
    id: "2",
    name: "Supreme Box Logo Hoodie",
    price: 650,
    image: "/api/placeholder/400/400",
    brand: "Supreme",
    category: "streetwear",
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "XL"],
    isNew: false,
    isLimited: true
  },
  {
    id: "3",
    name: "Yeezy 350 V2 \"Bred\"",
    price: 420,
    image: "/api/placeholder/400/400",
    brand: "Yeezy",
    category: "sneakers",
    stock: 25,
    sizes: ["8", "9", "10", "11", "12"],
    availableSizes: ["8", "9", "10", "11"],
    isNew: true,
    isLimited: false
  },
  {
    id: "4",
    name: "Off-White Out of Office",
    price: 890,
    image: "/api/placeholder/400/400",
    brand: "Off-White",
    category: "sneakers",
    stock: 2,
    sizes: ["8", "9", "10", "11", "12"],
    availableSizes: ["9", "11"],
    isNew: true,
    isLimited: true
  },
  {
    id: "5",
    name: "Fear of God Essentials Hoodie",
    price: 180,
    image: "/api/placeholder/400/400",
    brand: "Fear of God",
    category: "streetwear",
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    isNew: false,
    isLimited: false
  },
  {
    id: "6",
    name: "Nike Dunk Low \"Panda\"",
    price: 180,
    image: "/api/placeholder/400/400",
    brand: "Nike",
    category: "sneakers",
    stock: 45,
    sizes: ["8", "9", "10", "11", "12"],
    availableSizes: ["8", "9", "10", "11", "12"],
    isNew: false,
    isLimited: false
  }
]

export type Product = typeof mockProducts[0]