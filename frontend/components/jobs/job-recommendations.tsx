"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { MapPin, DollarSign, Clock, Briefcase, Building, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchPercentage: number;
  postedDate: string;
  skills: string[];
  description: string;
}

interface JobRecommendationsProps {
  jobs: Job[];
  showTitle?: boolean;
  maxDisplay?: number;
}

export function JobRecommendations({ 
  jobs, 
  showTitle = true, 
  maxDisplay = 3 
}: JobRecommendationsProps) {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast({
        title: "Job removed",
        description: "This job has been removed from your saved jobs",
      });
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast({
        title: "Job saved",
        description: "This job has been saved to your profile",
      });
    }
  };

  const displayedJobs = maxDisplay ? jobs.slice(0, maxDisplay) : jobs;

  return (
    <div className="space-y-6">
      {showTitle && (
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recommended Jobs</h2>
              <p className="text-muted-foreground">AI-matched opportunities based on your profile</p>
            </div>
            <Button variant="outline" asChild className="transition-all hover:scale-105 bg-transparent">
              <Link href="/jobs">View All Jobs</Link>
            </Button>
          </div>
        </FadeIn>
      )}

      <div className="grid gap-6">
        {displayedJobs.map((job, index) => {
          // Determine badge variant based on match percentage
          let badgeVariant: "default" | "secondary" | "outline" = "outline";
          if (job.matchPercentage >= 90) {
            badgeVariant = "default";
          } else if (job.matchPercentage >= 80) {
            badgeVariant = "secondary";
          }
          
          const isSaved = savedJobs.includes(job.id);
          
          return (
            <FadeIn key={job.id} delay={100 + index * 100}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {job.title}
                        </CardTitle>
                        <Badge
                          variant={badgeVariant}
                          className="text-sm animate-pulse"
                        >
                          {job.matchPercentage}% Match
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium text-foreground">{job.company}</CardDescription>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {job.salary}
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, skillIndex) => (
                      <FadeIn key={skill} delay={200 + index * 50 + skillIndex * 25}>
                        <Badge variant="outline" className="text-xs transition-all hover:scale-105">
                          {skill}
                        </Badge>
                      </FadeIn>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1 transition-all hover:scale-105">
                      Apply Now
                    </Button>
                    <Button 
                      variant={isSaved ? "default" : "outline"} 
                      className="transition-all hover:scale-105"
                      onClick={() => handleSaveJob(job.id)}
                    >
                      <Star className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} />
                      {isSaved ? "Saved" : "Save Job"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}

        {jobs.length === 0 && (
          <Card className="p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No job recommendations yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your resume or complete your profile to get personalized job matches
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="default">
                <Link href="/upload-resume">Upload Resume</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default JobRecommendations;