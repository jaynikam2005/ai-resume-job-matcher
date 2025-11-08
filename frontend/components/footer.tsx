import Link from "next/link"
import { BrainCircuit } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">AI JobMatch</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered resume and job matching platform connecting talent with opportunities.
            </p>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Job Seekers</h3>
            <div className="space-y-2 text-sm">
              <Link href="/upload-resume" className="block text-muted-foreground hover:text-primary transition-colors">
                Upload Resume
              </Link>
              <Link href="/jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Browse Jobs
              </Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                My Dashboard
              </Link>
            </div>
          </div>

          {/* For Recruiters */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Recruiters</h3>
            <div className="space-y-2 text-sm">
              <Link href="/post-job" className="block text-muted-foreground hover:text-primary transition-colors">
                Post a Job
              </Link>
              <Link
                href="/recruiter-dashboard"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Recruiter Dashboard
              </Link>
              <Link href="/candidates" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Candidates
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              {/*<Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>*/}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI JobMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

