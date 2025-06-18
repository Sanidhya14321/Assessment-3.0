import { InteractiveAssessment } from "@/components/assessments/interactive-assessment";
import { PREDEFINED_ASSESSMENTS } from "@/lib/constants";
import type { Assessment } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AssessmentPageProps {
  params: {
    assessmentId: string;
  };
}

// This function would typically fetch data from a DB or API
async function getAssessmentData(assessmentId: string): Promise<Assessment | null> {
  // For now, find in predefined assessments
  const assessment = PREDEFINED_ASSESSMENTS.find(a => a.id === assessmentId);
  return assessment || null;
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const assessment = await getAssessmentData(params.assessmentId);

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-lg text-center">
          <AlertTriangle className="h-6 w-6 inline-block mb-2" />
          <AlertTitle className="text-2xl font-headline">Assessment Not Found</AlertTitle>
          <AlertDescription className="text-base">
            The assessment you are looking for does not exist or may have been removed.
          </AlertDescription>
        </Alert>
        <Link href="/assessments" className="mt-6">
            <Button variant="outline">Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <InteractiveAssessment assessment={assessment} />
    </div>
  );
}

// Generate static paths for predefined assessments
export async function generateStaticParams() {
  return PREDEFINED_ASSESSMENTS.map(assessment => ({
    assessmentId: assessment.id,
  }));
}
