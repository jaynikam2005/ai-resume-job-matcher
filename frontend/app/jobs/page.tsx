import { JobSearchFilters } from "@/components/jobs/job-search-filters"
import { JobListings } from "@/components/jobs/job-listings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover opportunities that match your skills and career goals
        </p>
      </div>

      {/* Search Stats */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Job Search
              </CardTitle>
              <CardDescription>Find jobs that match your preferences</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Available Jobs</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JobSearchFilters />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <JobListings />
        </div>
      </div>
    </div>
  )
}
