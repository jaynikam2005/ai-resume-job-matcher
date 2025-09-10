"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BrainCircuit, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 transition-all hover:scale-105">
            <div className="relative">
              <BrainCircuit className="h-8 w-8 text-primary transition-all hover:rotate-12" />
              <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI JobMatch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-all hover:scale-105">
              Home
            </Link>
            <Link href="/jobs" className="text-foreground hover:text-primary transition-all hover:scale-105">
              Jobs
            </Link>
            <Link href="/upload-resume" className="text-foreground hover:text-primary transition-all hover:scale-105">
              Upload Resume
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-all hover:scale-105">
              Dashboard
            </Link>
          </div>

          {/* Desktop Auth & Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <Button variant="ghost" asChild className="transition-all hover:scale-105 hover:text-primary">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg transition-all hover:scale-105">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-all hover:scale-110"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-all hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/jobs"
                className="text-foreground hover:text-primary transition-all hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/upload-resume"
                className="text-foreground hover:text-primary transition-all hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload Resume
              </Link>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-all hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="ghost" asChild className="flex-1 transition-all hover:scale-105 hover:text-primary">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg transition-all hover:scale-105">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
