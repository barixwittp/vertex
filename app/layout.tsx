import "@/styles/globals.css"
import 'leaflet/dist/leaflet.css'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NavigationBar } from "@/components/navigation-bar"
import { LocationProvider } from "@/components/location-provider"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { Header } from "@/components/header"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VayuSathi - Real-time Air Quality Monitor',
  description: 'Monitor real-time air quality index data worldwide with VayuSathi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
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
