"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobCardSkeleton } from "@/components/ui/loading-skeleton"
import { FadeIn } from "@/components/ui/fade-in"
import { MapPin, DollarSign, Clock, Building, Bookmark, ExternalLink, Heart } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  postedDate: string
  description: string
  skills: string[]
  experienceLevel: string
  isRemote: boolean
  companyLogo?: string
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$120k - $150k",
    postedDate: "2 days ago",
    description:
      "Join our innovative team building next-generation web applications using modern technologies. You'll work on scalable systems that serve millions of users worldwide.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    experienceLevel: "Senior Level",
    isRemote: false,
  },
  {
    id: "2",
    title: "React Developer",
    company: "StartupXYZ",
    location: "Remote",
    jobType: "Full-time",
    salary: "$90k - $120k",
    postedDate: "1 week ago",
    description:
      "We're looking for a passionate React developer to help build our platform that's revolutionizing the way people work remotely.",
    skills: ["React", "JavaScript", "CSS", "Git", "Redux"],
    experienceLevel: "Mid Level",
    isRemote: true,
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$110k - $140k",
    postedDate: "3 days ago",
    description:
      "Build and maintain our cloud infrastructure. Work with cutting-edge technologies to ensure our applications are scalable, reliable, and secure.",
    skills: ["AWS", "Docker", "Kubernetes", "Python", "Terraform"],
    experienceLevel: "Senior Level",
    isRemote: false,
  },
  {
    id: "4",
    title: "Frontend Developer",
    company: "Design Studio Pro",
    location: "Los Angeles, CA",
    jobType: "Contract",
    salary: "$80k - $100k",
    postedDate: "5 days ago",
    description:
      "Create beautiful, responsive user interfaces for our clients' web applications. Work closely with designers to bring mockups to life.",
    skills: ["Vue.js", "CSS", "HTML", "Figma", "SASS"],
    experienceLevel: "Mid Level",
    isRemote: false,
  },
  {
    id: "5",
    title: "Python Backend Developer",
    company: "DataFlow Inc.",
    location: "Remote",
    jobType: "Full-time",
    salary: "$95k - $125k",
    postedDate: "1 week ago",
    description:
      "Develop robust backend systems for our data processing platform. Work with large datasets and build APIs that power our analytics dashboard.",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    experienceLevel: "Mid Level",
    isRemote: true,
  },
  {
    id: "6",
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$100k - $130k",
    postedDate: "4 days ago",
    description:
      "Join our team building the future of e-commerce. Work on both frontend and backend systems that handle millions of transactions daily.",
    skills: ["React", "Node.js", "MongoDB", "Express.js", "AWS"],
    experienceLevel: "Senior Level",
    isRemote: false,
  },
]

export function JobListings() {
  const [jobs] = useState<Job[]>(mockJobs)
  const [sortBy, setSortBy] = useState("newest")
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "salary-high":
        const aSalary = Number.parseInt(a.salary.split(" - ")[1].replace(/[^0-9]/g, ""))
        const bSalary = Number.parseInt(b.salary.split(" - ")[1].replace(/[^0-9]/g, ""))
        return bSalary - aSalary
      case "salary-low":
        const aSalaryLow = Number.parseInt(a.salary.split(" - ")[0].replace(/[^0-9]/g, ""))
        const bSalaryLow = Number.parseInt(b.salary.split(" - ")[0].replace(/[^0-9]/g, ""))
        return aSalaryLow - bSalaryLow
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Job Results</h2>
            <p className="text-muted-foreground">{jobs.length} jobs found</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>

      {/* Job Cards */}
      <div className="space-y-4">
        {sortedJobs.map((job, index) => (
          <FadeIn key={job.id} delay={index * 100}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-base font-medium text-foreground">
                          <Building className="h-4 w-4" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveJob(job.id)}
                        className="shrink-0 transition-all hover:scale-110"
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${
                            savedJobs.has(job.id)
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-muted-foreground hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                        {job.isRemote && (
                          <Badge variant="secondary" className="ml-1 text-xs animate-pulse">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="transition-all hover:scale-105">
                        {job.jobType}
                      </Badge>
                      <Badge variant="outline" className="transition-all hover:scale-105">
                        {job.experienceLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, skillIndex) => (
                    <FadeIn key={skill} delay={100 + index * 50 + skillIndex * 25}>
                      <Badge
                        variant="secondary"
                        className="text-xs transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                      >
                        {skill}
                      </Badge>
                    </FadeIn>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="flex-1 transition-all hover:scale-105">Apply Now</Button>
                  <Button variant="outline" className="flex-1 bg-transparent transition-all hover:scale-105">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Job
                  </Button>
                  <Button variant="ghost" size="icon" className="transition-all hover:scale-110">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* Load More */}
      <FadeIn delay={600}>
        <div className="text-center pt-6">
          <Button
            variant="outline"
            size="lg"
            className="transition-all hover:scale-105 bg-transparent"
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 1500)
            }}
          >
            Load More Jobs
          </Button>
        </div>
      </FadeIn>
    </div>
  )
}
