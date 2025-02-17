import type React from "react"
import "@/styles/globals.css"
import 'leaflet/dist/leaflet.css'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NavigationBar } from "@/components/navigation-bar"
import { LocationProvider } from "@/components/location-provider"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import Script from 'next/script'
import { Header } from "@/components/header"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata = {
  title: 'VayuSathi - Real-time Air Quality Monitor',
  description: 'Monitor real-time air quality index data worldwide with VayuSathi',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/images/logo.png',
        type: 'image/png',
        sizes: '192x192',
      },
    ],
    apple: {
      url: '/images/logo.png',
      type: 'image/png',
      sizes: '192x192',
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#10B981" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocationProvider>
            <SmoothScrollProvider>
              <div className="relative min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-background pb-20">
                  {children}
                </main>
                <NavigationBar />
              </div>
              <Toaster />
            </SmoothScrollProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
