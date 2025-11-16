"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Initial check
      setMatches(media.matches)

      // Update matches when the media query changes
      const listener = (event) => {
        setMatches(event.matches)
      }

      // Add listener
      media.addEventListener("change", listener)

      // Clean up
      return () => {
        media.removeEventListener("change", listener)
      }
    }

    return undefined
  }, [query])

  return matches
}
