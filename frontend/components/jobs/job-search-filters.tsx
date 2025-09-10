"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Search } from "lucide-react"

interface FilterState {
  searchQuery: string
  location: string
  jobTypes: string[]
  experienceLevels: string[]
  salaryRange: [number, number]
  skills: string[]
}

const jobTypes = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "freelance", label: "Freelance" },
  { id: "internship", label: "Internship" },
]

const experienceLevels = [
  { id: "entry", label: "Entry Level (0-2 years)" },
  { id: "mid", label: "Mid Level (2-5 years)" },
  { id: "senior", label: "Senior Level (5+ years)" },
  { id: "lead", label: "Lead/Principal (8+ years)" },
]

const popularSkills = [
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "CSS",
  "HTML",
  "Vue.js",
  "Angular",
  "Express.js",
  "Django",
]

export function JobSearchFilters() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    location: "",
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [50000, 200000],
    skills: [],
  })

  const handleJobTypeChange = (jobTypeId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      jobTypes: checked ? [...prev.jobTypes, jobTypeId] : prev.jobTypes.filter((id) => id !== jobTypeId),
    }))
  }

  const handleExperienceChange = (levelId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevels: checked
        ? [...prev.experienceLevels, levelId]
        : prev.experienceLevels.filter((id) => id !== levelId),
    }))
  }

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleSalaryChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      salaryRange: [value[0], value[1]],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      searchQuery: "",
      location: "",
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [50000, 200000],
      skills: [],
    })
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Search Query */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Jobs</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Job title, company, or keywords"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, state, or remote"
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <Separator />

      {/* Job Type */}
      <div className="space-y-3">
        <Label>Job Type</Label>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={filters.jobTypes.includes(type.id)}
                onCheckedChange={(checked) => handleJobTypeChange(type.id, checked as boolean)}
              />
              <Label htmlFor={type.id} className="text-sm font-normal cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Experience Level */}
      <div className="space-y-3">
        <Label>Experience Level</Label>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox
                id={level.id}
                checked={filters.experienceLevels.includes(level.id)}
                onCheckedChange={(checked) => handleExperienceChange(level.id, checked as boolean)}
              />
              <Label htmlFor={level.id} className="text-sm font-normal cursor-pointer">
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Salary Range */}
      <div className="space-y-3">
        <Label>Salary Range</Label>
        <div className="px-2">
          <Slider
            value={filters.salaryRange}
            onValueChange={handleSalaryChange}
            max={300000}
            min={30000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatSalary(filters.salaryRange[0])}</span>
            <span>{formatSalary(filters.salaryRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Skills */}
      <div className="space-y-3">
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <Badge
              key={skill}
              variant={filters.skills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
              {filters.skills.includes(skill) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )
}
