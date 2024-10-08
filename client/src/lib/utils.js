import { clsx } from "clsx"
import { LogOut } from "lucide-react"
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json.json"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,
}