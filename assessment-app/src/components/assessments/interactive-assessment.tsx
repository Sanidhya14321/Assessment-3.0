
"use client";

import { useState, useEffect } from "react";
import type { Assessment, Question, AssessmentResult } from "@/lib/types";
import { QuestionDisplay } from "./question-display";
import { AssessmentResults } from "./assessment-results";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { LOCAL_STORAGE_USER_ID_KEY, LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY } from "@/lib/constants";

async function saveAssessmentResult(result: AssessmentResult): Promise<void> {
  console.log("Saving assessment result:", result);
  try {
    const historyString = localStorage.getItem(LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY);
    const history: AssessmentResult[] = historyString ? JSON.parse(historyString) : [];
    history.push(result);
    localStorage.setItem(LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save assessment result to localStorage", e);
    // Potentially inform the user or log more robustly
  }
  return new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
}


interface InteractiveAssessmentProps {
  assessment: Assessment;
}

export function InteractiveAssessment({ assessment }: InteractiveAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(assessment.questions.length).fill(null)
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string>("guestUser");

  useEffect(() => {
    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (userId) {
      setCurrentUserId(userId);
    }
  }, []);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (userAnswers[currentQuestionIndex] === null) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (userAnswers.some(ans => ans === null)) {
         toast({
            title: "Incomplete Assessment",
            description: "Please answer all questions before submitting.",
            variant: "destructive",
        });
        return;
    }

    let correctAnswersCount = 0;
    const mappedAnswers = assessment.questions.map((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswersCount++;
      }
      return { questionId: q.id, selectedAnswer: userAnswers[index]! };
    });

    const scorePercentage = Math.round((correctAnswersCount / assessment.questions.length) * 100);

    const result: AssessmentResult = {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      category: assessment.category,
      userId: currentUserId,
      scorePercentage,
      answers: mappedAnswers,
      completedAt: new Date().toISOString(),
    };
    
    try {
      await saveAssessmentResult(result);
      setAssessmentResult(result);
      setIsCompleted(true);
      toast({
        title: "Assessment Submitted!",
        description: `You scored ${scorePercentage}%.`,
      });
    } catch (error) {
      toast({
        title: "Error Submitting",
        description: "There was an issue submitting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetakeAssessment = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(assessment.questions.length).fill(null));
    setIsCompleted(false);
    setAssessmentResult(null);
  };

  if (isCompleted && assessmentResult) {
    return (
      <AssessmentResults
        assessment={assessment}
        result={assessmentResult}
        onRetake={handleRetakeAssessment}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <header className="text-center">
        <h1 className="text-3xl font-headline font-bold text-primary">{assessment.title}</h1>
        <p className="text-muted-foreground">{assessment.description}</p>
      </header>

      <div className="space-y-2">
        <Progress value={progressPercentage} className="w-full h-2.5" />
        <p className="text-sm text-muted-foreground text-right">
          {currentQuestionIndex + 1} / {assessment.questions.length}
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        <QuestionDisplay
          key={currentQuestion.id} 
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={assessment.questions.length}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
      </AnimatePresence>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        
        {currentQuestionIndex === assessment.questions.length - 1 ? (
          <Button
            onClick={handleSubmitAssessment}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={userAnswers[currentQuestionIndex] === null}
          >
            Submit Assessment <CheckSquare className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={userAnswers[currentQuestionIndex] === null}
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
