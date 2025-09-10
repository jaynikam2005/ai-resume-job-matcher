import { JobPostingForm } from "@/components/recruiter/job-posting-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Zap } from "lucide-react"

export default function PostJobPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Post a New Job</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create a detailed job posting and let our AI find the perfect candidates for you
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Smart Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>AI automatically matches qualified candidates to your job posting</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Quality Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Access a pool of pre-screened, qualified professionals</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Fast Results</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Start receiving applications within hours of posting</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Job Posting Form */}
      <JobPostingForm />
    </div>
  )
}
