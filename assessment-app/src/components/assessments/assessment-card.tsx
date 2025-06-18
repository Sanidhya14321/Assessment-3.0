
"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Assessment } from "@/lib/types";
import { ArrowRight, Brain, Code, Database, Shield, Cloud, Clock, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AssessmentCardProps {
  assessment: Assessment;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'AI/ML': Brain,
  'Web Development': Code,
  'Data Structures': Database,
  'Cybersecurity': Shield,
  'Cloud Computing': Cloud,
};

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const IconComponent = categoryIcons[assessment.category] || Code;

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Upvoted:", assessment.id);
    // TODO: Implement upvote server action for non-predefined assessments
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Downvoted:", assessment.id);
    // TODO: Implement downvote server action for non-predefined assessments
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px hsla(var(--primary-hsl), 0.1)" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-primary">
              <IconComponent className="w-5 h-5" />
              <span>{assessment.category}</span>
            </div>
            {assessment.isPredefined && (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>Curated</span>
              </div>
            )}
            {assessment.durationMinutes && !assessment.isPredefined && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {assessment.durationMinutes} min
              </div>
            )}
          </div>
          <CardTitle className="font-headline text-xl leading-tight">{assessment.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-muted-foreground line-clamp-3">{assessment.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t">
          {assessment.isPredefined ? (
             <div className="flex items-center gap-2 mb-3 sm:mb-0 text-sm text-muted-foreground">
                {assessment.durationMinutes && (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {assessment.durationMinutes} min
                    </div>
                )}
             </div>
          ) : (
            <div className="flex items-center gap-2 mb-3 sm:mb-0">
              <Button variant="ghost" size="sm" onClick={handleUpvote} className="group text-muted-foreground hover:text-green-500">
                <ThumbsUp className="w-4 h-4 mr-1 group-hover:fill-green-500/20" /> {assessment.upvotes}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownvote} className="group text-muted-foreground hover:text-red-500">
                <ThumbsDown className="w-4 h-4 mr-1 group-hover:fill-red-500/20" /> {assessment.downvotes}
              </Button>
            </div>
          )}
          <Link href={`/assessments/${assessment.id}`} className="w-full sm:w-auto">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
