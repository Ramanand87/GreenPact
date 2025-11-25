"use client";

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { NavbarFallback } from './NavbarFallback';

// Wrapper to safely use Navbar with or without i18n context
export function SafeNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Check if we're on a localized route
  const isLocalizedRoute = pathname?.startsWith('/en') || pathname?.startsWith('/hi');
  
  // Use localized Navbar only on localized routes, otherwise use fallback
  if (isLocalizedRoute) {
    try {
      return <Navbar />;
    } catch (error) {
      console.warn('NextIntl context not available, using fallback navbar');
      return <NavbarFallback />;
    }
  }
  
  return <NavbarFallback />;
}
