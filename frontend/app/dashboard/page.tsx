"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/ui/fade-in"
import { Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { AuthService, User } from "@/lib/services/auth"
import { useRouter } from "next/navigation"

// Import our custom components
import { ProfileSummary } from "@/components/profile/profile-summary"
import { StatsSummary } from "@/components/dashboard/stats-summary"
import { JobRecommendations } from "@/components/jobs/job-recommendations"

// Mock data for job recommendations - in production, this would come from an API
const mockJobRecommendations = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    matchPercentage: 95,
    postedDate: "2 days ago",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    description: "Join our innovative team building next-generation web applications...",
  },
  {
    id: 2,
    title: "React Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$90k - $120k",
    matchPercentage: 88,
    postedDate: "1 week ago",
    skills: ["React", "JavaScript", "CSS", "Git"],
    description: "We're looking for a passionate React developer to help build our platform...",
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "New York, NY",
    salary: "$100k - $130k",
    matchPercentage: 82,
    postedDate: "3 days ago",
    skills: ["Python", "React", "PostgreSQL", "Docker"],
    description: "Build scalable applications that impact millions of users...",
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<User & {
    title?: string;
    skills?: string[];
    experience?: string;
    summary?: string;
    education?: string[];
  }>({
    email: "",
    role: "JOB_SEEKER",
    firstName: "",
    lastName: ""
  })
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get the current user from the API
        try {
          const apiUser = await AuthService.getCurrentUser()
          if (apiUser) {
            setUserData(currentData => ({...currentData, ...apiUser}))
          }
        } catch (apiError) {
          // Ignore API errors and fall back to local storage
          console.log("Could not fetch from API, falling back to local storage")
        }

        // Fall back to local storage if API fails
        const storedUser = AuthService.getStoredUser()
        if (storedUser) {
          setUserData(currentData => ({...currentData, ...storedUser}))
        }

        // If no user data is found at all, redirect to login
        if (!AuthService.isAuthenticated()) {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Format the full name
  const fullName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData.firstName || userData.lastName || "there"
    
  // Create a placeholder skills array if none exists
  if (!userData.skills) {
    userData.skills = ["React", "JavaScript", "TypeScript", "HTML/CSS"]
  }
  
  // Create a placeholder experience if none exists
  if (!userData.experience) {
    userData.experience = "Professional experience"
  }
  
  // Enhanced user data with everything needed for components
  const enhancedUserData = {
    ...userData,
    profileCompleteness: 85 // We could calculate this based on filled profile fields
  }

  // Stats for the dashboard
  const dashboardStats = [
    { 
      title: "Profile Completeness", 
      value: enhancedUserData.profileCompleteness, 
      icon: require("lucide-react").TrendingUp, 
      suffix: "%",
      showProgress: true
    },
    { 
      title: "Job Matches", 
      value: mockJobRecommendations.length, 
      icon: require("lucide-react").Search, 
      suffix: "",
      description: "New recommendations" 
    },
    { 
      title: "Applications", 
      value: 0, 
      icon: require("lucide-react").FileText, 
      suffix: "",
      description: "This month" 
    },
    { 
      title: "Response Rate", 
      value: 0, 
      icon: require("lucide-react").TrendingUp, 
      suffix: "%",
      description: "Above average" 
    },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{minHeight: "60vh"}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold">Loading your dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {fullName}</h1>
            <p className="text-muted-foreground">Track your job search progress and discover new opportunities</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="transition-all hover:scale-105">
              <Link href="/upload-resume">
                <Upload className="mr-2 h-4 w-4" />
                Update Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="transition-all hover:scale-105">
              <Link href="/profile">
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <StatsSummary stats={dashboardStats} />

      {/* Profile Summary */}
      <ProfileSummary user={enhancedUserData} />

      {/* Job Recommendations */}
      <JobRecommendations jobs={mockJobRecommendations} />
    </div>
  )
}