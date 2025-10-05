"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Settings, User, ChevronDown, LogOut } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export function DashboardHeader() {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setShowUserDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-b border-white/20 z-40 flex items-center justify-between px-6 shadow-lg"
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Environmental Dashboard</h2>
        <p className="text-xs text-white/80">Real-time monitoring system</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Settings Button */}
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 flex items-center gap-2 px-3"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
