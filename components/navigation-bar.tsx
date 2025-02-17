"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Map, Search, Users, Settings } from "lucide-react"
import { useMemo } from "react"

const navItems = [
  {
    path: "/",
    icon: Home,
    label: "Home"
  },
  {
    path: "/map",
    icon: Map,
    label: "Map"
  },
  {
    path: "/search",
    icon: Search,
    label: "Search"
  },
  {
    path: "/community",
    icon: Users,
    label: "Community"
  },
  {
    path: "/settings",
    icon: Settings,
    label: "Settings"
  }
]

export function NavigationBar() {
  const pathname = usePathname()

  // Memoize the navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => navItems.map((item) => {
    const isActive = pathname === item.path
    return (
      <Link
        key={item.path}
        href={item.path}
        className="flex-1"
      >
        <motion.div
          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs mt-1.5">{item.label}</span>
        </motion.div>
      </Link>
    )
  }), [pathname])

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t py-1">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems}
      </div>
    </nav>
  )
}

