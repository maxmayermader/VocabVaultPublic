'use client';
import { ReactNode, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from "@/app/context/AuthContext";
import '../../app/globals.css'

function Header() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { logout, isAuthenticated } = useAuth()

  const menuRef = useRef<HTMLDivElement>(null)
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        setMounted(true)
    
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false)
          }
        }
    
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [])

        
    if (!mounted) {
        return null
      }
  
    const handleLogout = async () => {
      try {
        await logout()
        // The AuthContext will handle redirecting to the login page
      } catch (error) {
        console.error('Logout failed:', error)
        // Optionally, you can add error handling here, such as displaying an error message to the user
      }
    }
  
    return (
      <header className="bg-primary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            VocabVault
          </Link>
          <div className="flex items-center">
            <div className="hidden md:block mr-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 bg-white dark:bg-gray-800 rounded-full"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
            <button onClick={toggleMenu} className="text-white">
              ☰
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div ref={menuRef} className="mt-4">
            <nav className="flex flex-col space-y-2">
            <div className="md:hidden">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-white hover:text-gray-200 flex items-center"
                >
                  {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>
              <Link href="/friends" className="text-white hover:text-gray-200">
                Friends
              </Link>
              <Link href="/goals" className="text-white hover:text-gray-200">
                Goals
              </Link>
              <Link href="/settings" className="text-white hover:text-gray-200">
                Settings
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-gray-200 text-left">
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>
    )
  }

export default Header


