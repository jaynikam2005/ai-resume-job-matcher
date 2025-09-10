"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Users, Calendar } from "lucide-react"

interface JobPosting {
  id: string
  title: string
  location: string
  jobType: string
  salary: string
  applications: number
  status: "active" | "paused" | "closed"
  postedDate: string
  skills: string[]
}

const mockJobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$120k - $150k",
    applications: 24,
    status: "active",
    postedDate: "2024-01-15",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "2",
    title: "React Developer",
    location: "Remote",
    jobType: "Full-time",
    salary: "$90k - $120k",
    applications: 18,
    status: "active",
    postedDate: "2024-01-12",
    skills: ["React", "JavaScript", "CSS"],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$110k - $140k",
    applications: 12,
    status: "paused",
    postedDate: "2024-01-10",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
  {
    id: "4",
    title: "UI/UX Designer",
    location: "Los Angeles, CA",
    jobType: "Contract",
    salary: "$80k - $100k",
    applications: 31,
    status: "active",
    postedDate: "2024-01-08",
    skills: ["Figma", "Design Systems", "Prototyping"],
  },
  {
    id: "5",
    title: "Backend Developer",
    location: "Remote",
    jobType: "Full-time",
    salary: "$95k - $125k",
    applications: 8,
    status: "closed",
    postedDate: "2024-01-05",
    skills: ["Python", "Django", "PostgreSQL"],
  },
]

export function JobPostingsTable() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleStatusChange = (jobId: string, newStatus: JobPosting["status"]) => {
    setJobPostings((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
  }

  const handleDelete = (jobId: string) => {
    setJobPostings((prev) => prev.filter((job) => job.id !== jobId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Postings</CardTitle>
        <CardDescription>Manage your active and past job listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobPostings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.salary}</div>
                    </div>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.jobType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{job.applications}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(job.postedDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </DropdownMenuItem>
                        {job.status === "active" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(job.id, "paused")}>
                            Pause Job
                          </DropdownMenuItem>
                        )}
                        {job.status === "paused" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(job.id, "active")}>
                            Activate Job
                          </DropdownMenuItem>
                        )}
                        {job.status !== "closed" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(job.id, "closed")}>
                            Close Job
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(job.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
