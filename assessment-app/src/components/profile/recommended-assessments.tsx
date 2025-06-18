import { assessmentRecommendation, type AssessmentRecommendationInput } from "@/ai/flows/assessment-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PREDEFINED_ASSESSMENTS } from "@/lib/constants";
import type { User, AssessmentResult, AvailableAssessmentInfo, UserHistoryEntry } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb } from "lucide-react";
import Image from "next/image";


interface RecommendedAssessmentsProps {
  user: User | null; // User object which includes assessmentHistory and interests
}

// Helper to find full assessment details from title
const findAssessmentByTitle = (title: string) => {
  return PREDEFINED_ASSESSMENTS.find(a => a.title.toLowerCase() === title.toLowerCase());
};

export async function RecommendedAssessments({ user }: RecommendedAssessmentsProps) {
  if (!user) {
    return null; // Or some placeholder if user data isn't available yet
  }

  // Prepare input for the AI flow
  const userHistory: UserHistoryEntry[] = (user.assessmentHistory || []).map((result: AssessmentResult) => ({
    assessmentCategory: result.category,
    score: result.scorePercentage,
    interests: user.interests?.join(', ') || 'General Computer Science', // Combine interests or provide a default
  }));

  // If no history, provide general interests if available
  if (userHistory.length === 0 && user.interests && user.interests.length > 0) {
    userHistory.push({
      assessmentCategory: "General",
      score: 0, // No score as no assessments taken
      interests: user.interests.join(', '),
    });
  } else if (userHistory.length === 0 && (!user.interests || user.interests.length === 0)) {
     // If no history and no interests, maybe show popular or introductory assessments
     return (
      <Card className="shadow-xl bg-card mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Lightbulb className="w-7 h-7 mr-3 text-primary" /> Assessment Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Take a few assessments or add interests to your profile to get personalized recommendations!
            In the meantime, here are some popular starting points:
          </p>
          <div className="space-y-3">
            {PREDEFINED_ASSESSMENTS.slice(0,2).map(assessment => (
                <Link href={`/assessments/${assessment.id}`} key={assessment.id} className="block p-3 border rounded-md hover:bg-accent/10 transition-colors">
                    <h4 className="font-semibold text-foreground">{assessment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assessment.category}</p>
                </Link>
            ))}
          </div>
        </CardContent>
      </Card>
     );
  }


  const availableAssessments: AvailableAssessmentInfo[] = PREDEFINED_ASSESSMENTS.map(assessment => ({
    assessmentCategory: assessment.category,
    assessmentTitle: assessment.title,
  }));

  const recommendationInput: AssessmentRecommendationInput = {
    userHistory,
    availableAssessments,
  };

  let recommendations: string[] = [];
  try {
    const result = await assessmentRecommendation(recommendationInput);
    recommendations = result.recommendations;
  } catch (error) {
    console.error("Error fetching assessment recommendations:", error);
    // Optionally, display an error message to the user or fallback content
  }
  
  const detailedRecommendations = recommendations
    .map(title => findAssessmentByTitle(title))
    .filter(Boolean); // Remove any nulls if assessment not found

  if (detailedRecommendations.length === 0) {
    return (
      <Card className="shadow-xl bg-card mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
             <Lightbulb className="w-7 h-7 mr-3 text-primary" /> Assessment Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We couldn't find specific recommendations for you right now. Explore our diverse assessments!
          </p>
           <Link href="/assessments" className="mt-4 inline-block">
            <Button>Browse All Assessments</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl bg-card mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Brain className="w-7 h-7 mr-3 text-primary" /> Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Based on your performance and interests, we think you'll find these assessments engaging:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {detailedRecommendations.map((assessment) => assessment && (
            <Link href={`/assessments/${assessment.id}`} key={assessment.id}>
              <div className="group p-4 border rounded-lg hover:shadow-lg hover:border-primary transition-all duration-200 h-full flex flex-col justify-between bg-background">
                <div>
                  <div className="flex items-center mb-2">
                    <Image 
                      src={`https://placehold.co/80x80.png?text=${assessment.category.substring(0,3)}`} 
                      alt={assessment.category} 
                      width={40} 
                      height={40} 
                      className="rounded-md mr-3"
                      data-ai-hint={`${assessment.category} icon`}
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{assessment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assessment.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {assessment.description}
                  </p>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm text-primary self-start">
                  Start Assessment &rarr;
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
