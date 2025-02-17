"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function LocationPermission() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const hasPermission = localStorage.getItem("locationPermission")
    if (!hasPermission) {
      setOpen(true)
    }
  }, [])

  const handlePermission = async (allow: boolean) => {
    if (allow) {
      try {
        await navigator.geolocation.getCurrentPosition(() => {
          toast({
            title: "Location access granted",
            description: "We'll show you air quality data for your area.",
          })
          localStorage.setItem("locationPermission", "granted")
          setOpen(false)
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error accessing location",
          description: "Please enable location services in your browser settings.",
        })
      }
    } else {
      localStorage.setItem("locationPermission", "denied")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Enable Location Services
          </DialogTitle>
          <DialogDescription>
            We need your location to show you accurate air quality data for your area. Your location data will only be
            used to display local AQI information.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handlePermission(false)}>
            Not Now
          </Button>
          <Button onClick={() => handlePermission(true)}>Allow Access</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

