"use client"

import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full header-container">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <ModeToggle />
      </div>
    </header>
  )
} 