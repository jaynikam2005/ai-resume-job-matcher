import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobPostingsTable } from "@/components/recruiter/job-postings-table"
import { Plus, Users, Eye, TrendingUp, Briefcase } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockRecruiterProfile = {
  name: "Sarah Johnson",
  company: "TechCorp Inc.",
  activeJobs: 8,
  totalApplications: 156,
  responseRate: 73,
}

const mockStats = [
  {
    title: "Active Job Posts",
    value: mockRecruiterProfile.activeJobs,
    icon: Briefcase,
    description: "Currently hiring",
  },
  {
    title: "Total Applications",
    value: mockRecruiterProfile.totalApplications,
    icon: Users,
    description: "This month",
  },
  {
    title: "Profile Views",
    value: 1247,
    icon: Eye,
    description: "Last 30 days",
  },
  {
    title: "Response Rate",
    value: `${mockRecruiterProfile.responseRate}%`,
    icon: TrendingUp,
    description: "Above average",
  },
]

export default function RecruiterDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {mockRecruiterProfile.name}</h1>
          <p className="text-muted-foreground">Manage your job postings and find the perfect candidates</p>
        </div>
        <Button asChild>
          <Link href="/post-job">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Your company information and hiring preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{mockRecruiterProfile.company}</h3>
              <p className="text-muted-foreground">Technology & Software Development</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Remote Friendly</Badge>
              <Badge variant="secondary">Tech Industry</Badge>
              <Badge variant="secondary">Fast Growing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Postings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Job Postings</h2>
            <p className="text-muted-foreground">Manage and track your active job listings</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/candidates">View Candidates</Link>
          </Button>
        </div>

        <JobPostingsTable />
      </div>
    </div>
  )
}
