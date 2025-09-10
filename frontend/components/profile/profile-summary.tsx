"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FadeIn } from "@/components/ui/fade-in";
import { PulseDot } from "@/components/ui/pulse-dot";
import Link from "next/link";
import { User } from "@/lib/services/auth";

interface ProfileSummaryProps {
  user: User & {
    title?: string;
    skills?: string[];
    experience?: string;
    summary?: string;
    education?: string[];
    profileCompleteness?: number;
  };
}

export function ProfileSummary({ user }: ProfileSummaryProps) {
  const profileCompleteness = user.profileCompleteness || calculateProfileCompleteness(user);

  // Format the user name
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.lastName || "Anonymous User";
    
  // Format the skills
  const skills = user.skills || [];
  
  return (
    <FadeIn>
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Your Profile
            <PulseDot size="sm" />
          </CardTitle>
          <CardDescription>Professional information from your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{fullName}</h3>
              <p className="text-muted-foreground">{user.title || "No professional title set"}</p>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">Profile Completeness</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={profileCompleteness} className="w-24 h-2" />
                <span className="text-xs">{profileCompleteness}%</span>
              </div>
            </div>
          </div>
          
          {user.summary && (
            <div>
              <h4 className="text-sm font-medium mb-1">Summary</h4>
              <p className="text-sm text-muted-foreground">{user.summary}</p>
            </div>
          )}
          
          {skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <FadeIn key={skill} delay={100 + index * 50}>
                    <Badge variant="secondary" className="transition-all hover:scale-105">
                      {skill}
                    </Badge>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href="/profile">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

// Helper function to calculate profile completeness percentage
function calculateProfileCompleteness(user: ProfileSummaryProps['user']): number {
  const fields = [
    !!user.firstName,
    !!user.lastName,
    !!user.email,
    !!user.title,
    !!user.summary,
    !!user.experience,
    !!(user.skills && user.skills.length > 0),
    !!(user.education && user.education.length > 0),
  ];
  
  const filledFields = fields.filter(Boolean).length;
  return Math.round((filledFields / fields.length) * 100);
}

export default ProfileSummary;