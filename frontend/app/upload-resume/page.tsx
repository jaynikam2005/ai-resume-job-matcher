import { ResumeUploadForm } from "@/components/resume/resume-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Target } from "lucide-react"

export default function UploadResumePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Resume</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let our AI analyze your resume and find the perfect job matches for you
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Smart Parsing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>AI extracts your skills, experience, and qualifications automatically</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Instant Matching</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Get matched with relevant jobs immediately after upload</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Precision Results</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>See match percentages to focus on your best opportunities</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Upload Form */}
      <ResumeUploadForm />
    </div>
  )
}
