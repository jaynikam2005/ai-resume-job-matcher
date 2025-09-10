"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Loader2, User, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/services/auth"
import { ConfigDebugger } from "@/components/debug/config-debugger"

type UserRole = "JOB_SEEKER" | "RECRUITER"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "JOB_SEEKER" as UserRole,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Generate username from email (everything before @)
      const username = formData.email.split('@')[0];
      
      await AuthService.register({
        username: username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      })

      if (formData.role === "JOB_SEEKER") {
        router.push("/upload-resume")
      } else {
        router.push("/post-job")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev: FormData) => ({ ...prev, role: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>I am a...</Label>
        <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
            <RadioGroupItem value="JOB_SEEKER" id="job_seeker" />
            <Label htmlFor="job_seeker" className="flex items-center space-x-2 cursor-pointer">
              <User className="h-4 w-4 text-primary" />
              <span>Job Seeker</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer hover:bg-accent/5 hover:border-accent/50 transition-all duration-300 data-[state=checked]:border-accent data-[state=checked]:bg-accent/10">
            <RadioGroupItem value="RECRUITER" id="recruiter" />
            <Label htmlFor="recruiter" className="flex items-center space-x-2 cursor-pointer">
              <Building className="h-4 w-4 text-accent" />
              <span>Recruiter</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to our{" "}
        <Button variant="link" className="h-auto p-0 text-primary hover:underline" asChild>
          <a href="/terms">Terms of Service</a>
        </Button>{" "}
        and{" "}
        <Button variant="link" className="h-auto p-0 text-primary hover:underline" asChild>
          <a href="/privacy">Privacy Policy</a>
        </Button>
      </p>
      
      {/* Configuration Debugger for troubleshooting */}
      <ConfigDebugger />
    </form>
  )
}
