"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Loader2, Save, User, Mail, Phone, FileText, Briefcase, BookOpen, Award } from "lucide-react"
import { AuthService, User as UserType } from "@/lib/services/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  
  const [profile, setProfile] = useState<UserType & {
    phone?: string;
    title?: string;
    summary?: string;
    skills?: string[];
    education?: string[];
    experience?: string;
  }>({
    email: "",
    role: "JOB_SEEKER",
    firstName: "",
    lastName: "",
    phone: "",
    title: "",
    summary: "",
    skills: [],
    education: [],
    experience: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // First try to get the user from the /me endpoint
        try {
          const userData = await AuthService.getCurrentUser()
          if (userData) {
            setProfile(prev => ({
              ...prev,
              ...userData
            }))
          }
        } catch (err) {
          console.log("Could not fetch user from API, falling back to stored user")
        }

        // Fall back to locally stored user if API call fails
        const storedUser = AuthService.getStoredUser()
        if (storedUser) {
          setProfile(prev => ({
            ...prev,
            ...storedUser
          }))
        }

        // If no user data is available, redirect to login
        if (!AuthService.isAuthenticated()) {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setErrorMessage("Failed to load profile data. Please try logging in again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsText = e.target.value
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(Boolean)
    setProfile(prev => ({
      ...prev,
      skills: skillsArray
    }))
  }

  const handleEducationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const educationText = e.target.value
    const educationArray = educationText.split('\n').map(edu => edu.trim()).filter(Boolean)
    setProfile(prev => ({
      ...prev,
      education: educationArray
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // TODO: Implement actual profile update API call
      // For now, just simulate an API call and update local storage
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update stored user with new profile data
      if (typeof window !== 'undefined') {
        const currentUser = AuthService.getStoredUser()
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: profile.firstName,
            lastName: profile.lastName,
            // Only store core user fields in localStorage
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      setSuccessMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      setErrorMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and resume details</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-400">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> 
              Personal Information
            </CardTitle>
            <CardDescription>Your basic information that appears on your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={profile.firstName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={profile.lastName || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
              <p className="text-xs text-muted-foreground">Contact support to change your email address</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Professional Information
            </CardTitle>
            <CardDescription>Details that will appear on job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title"
                name="title"
                placeholder="e.g. Senior Software Engineer"
                value={profile.title || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea 
                id="summary"
                name="summary"
                placeholder="Write a brief summary about yourself and your professional background"
                className="min-h-[100px]"
                value={profile.summary || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea 
                id="experience"
                name="experience"
                placeholder="Describe your work experience"
                className="min-h-[100px]"
                value={profile.experience || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea 
                id="skills"
                placeholder="Enter your skills separated by commas (e.g. JavaScript, React, Node.js)"
                className="min-h-[80px]"
                value={profile.skills?.join(', ') || ""}
                onChange={handleSkillsChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea 
                id="education"
                placeholder="Enter your education details, one per line"
                className="min-h-[100px]"
                value={profile.education?.join('\n') || ""}
                onChange={handleEducationChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Account Settings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Change your password or reset it if forgotten</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Account Deletion</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all your data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}