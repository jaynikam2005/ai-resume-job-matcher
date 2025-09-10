import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Upload, Search, Users, Zap, Shield, Target, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
              <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            AI-Powered Resume & Job Matching
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Connect talent with opportunities using advanced AI technology. Find your perfect job or ideal candidate
            with intelligent matching algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg transform hover:scale-105 transition-all duration-200" asChild>
              <Link href="/upload-resume">
                <Upload className="mr-2 h-5 w-5" />
                Upload Resume
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="bg-gradient-to-r from-accent to-green-600 text-white hover:from-green-600 hover:to-accent shadow-lg transform hover:scale-105 transition-all duration-200" asChild>
              <Link href="/post-job">
                <Users className="mr-2 h-5 w-5" />
                Post a Job
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Why Choose AI JobMatch?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform revolutionizes how job seekers and recruiters connect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center card-gradient border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-primary to-blue-600 rounded-full w-fit group-hover:shadow-lg transition-all duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-primary">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI algorithms analyze skills, experience, and preferences to find perfect matches
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center card-gradient border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-accent to-green-600 rounded-full w-fit group-hover:shadow-lg transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-accent">Precision Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get ranked recommendations with match percentages to focus on the best opportunities
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center card-gradient border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-primary to-blue-600 rounded-full w-fit group-hover:shadow-lg transition-all duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-primary">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is protected with enterprise-grade security and privacy controls
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/20 via-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-accent">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-primary">For Job Seekers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Upload Your Resume</h4>
                    <p className="text-muted-foreground">
                      Upload your PDF or DOCX resume and let our AI extract your skills and experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Get Matched</h4>
                    <p className="text-muted-foreground">
                      Our AI analyzes your profile and finds jobs that match your skills and preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Apply with Confidence</h4>
                    <p className="text-muted-foreground">
                      See match percentages and apply to jobs where you're most likely to succeed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-accent">For Recruiters</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-accent to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">Post Your Job</h4>
                    <p className="text-muted-foreground">
                      Create detailed job postings with required skills and qualifications
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-accent to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">AI Finds Candidates</h4>
                    <p className="text-muted-foreground">
                      Our system automatically matches qualified candidates to your positions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                  <div className="bg-gradient-to-r from-accent to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">Review & Hire</h4>
                    <p className="text-muted-foreground">
                      Review ranked candidates with match scores and make informed hiring decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and recruiters who trust AI JobMatch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg transform hover:scale-105 transition-all duration-200" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-accent hover:bg-accent hover:text-accent-foreground shadow-lg transform hover:scale-105 transition-all duration-200" asChild>
              <Link href="/jobs">
                <Search className="mr-2 h-5 w-5" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
