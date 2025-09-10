"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Progress } from "@/components/ui/progress";
import { FadeIn } from "@/components/ui/fade-in";
import { LucideIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  description?: string;
  showProgress?: boolean;
}

interface StatsSummaryProps {
  stats: StatItem[];
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <FadeIn key={stat.title} delay={index * 100}>
          <Card className="transition-all hover:shadow-md hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              
              {stat.showProgress && <Progress value={stat.value} className="mt-2" />}
              
              {stat.description && (
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}

export default StatsSummary;