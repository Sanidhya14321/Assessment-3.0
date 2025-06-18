
"use client";

import { useState, useEffect } from "react";
import { UserInfo } from "@/components/profile/user-info";
import { AssessmentHistory } from "@/components/profile/assessment-history";
import { RecommendedAssessments } from "@/components/profile/recommended-assessments";
import type { User, AssessmentResult, StoredUser } from "@/lib/types";
import { MOCK_ADMIN_ID, ADMIN_EMAIL, LOCAL_STORAGE_USERS_KEY, LOCAL_STORAGE_USER_ID_KEY, LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getUserData(userId: string): Promise<User | null> {
  if (userId === MOCK_ADMIN_ID) {
    let adminHistory: AssessmentResult[] = [];
    const historyString = localStorage.getItem(LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY);
    if (historyString) {
      adminHistory = JSON.parse(historyString).filter((r: AssessmentResult) => r.userId === MOCK_ADMIN_ID);
    }
    return {
      id: MOCK_ADMIN_ID,
      name: "Site Administrator",
      email: ADMIN_EMAIL,
      role: "admin",
      assessmentHistory: adminHistory,
      interests: ["Site Management", "Assessment Quality", "AI/ML", "Web Development"], // Example admin interests
    };
  }

  // Fetch regular user data
  const usersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
  const storedUsers: StoredUser[] = usersString ? JSON.parse(usersString) : [];
  const storedUser = storedUsers.find(u => u.id === userId);

  if (storedUser) {
    let userHistory: AssessmentResult[] = [];
    const historyString = localStorage.getItem(LOCAL_STORAGE_ASSESSMENT_HISTORY_KEY);
    if (historyString) {
      userHistory = JSON.parse(historyString).filter((r: AssessmentResult) => r.userId === userId);
    }
    return {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      role: "user",
      assessmentHistory: userHistory,
      interests: ["Learning New Technologies", "Problem Solving"], // Placeholder interests for regular users
    };
  }
  return null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    setCurrentUserId(id);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUserId) {
        setIsLoading(true);
        const data = await getUserData(currentUserId);
        setUser(data);
        setIsLoading(false);
      } else {
        // No user ID found in localStorage after initial check
        setUser(null);
        setIsLoading(false);
      }
    };
    
    // Only fetch if currentUserId has been determined (either null or a string)
    if (currentUserId !== undefined) {
        fetchUserData();
    }

  }, [currentUserId]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <UserCircle2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Alert variant="default" className="max-w-md bg-card">
          <LogIn className="h-6 w-6 inline-block mb-2 text-primary" />
          <AlertTitle className="text-2xl font-headline">Access Your Profile</AlertTitle>
          <AlertDescription className="text-base">
            Please log in or sign up to view your profile and track your progress.
          </AlertDescription>
        </Alert>
        <div className="mt-6 space-x-4">
            <Link href="/login">
                <Button>Login</Button>
            </Link>
            <Link href="/signup">
                <Button variant="outline">Sign Up</Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          {user.role === 'admin' ? 'Admin Profile' : `${user.name}'s Profile`}
        </h1>
        <p className="text-lg text-muted-foreground">
          {user.role === 'admin' 
            ? 'Manage your admin information and oversee assessments.'
            : 'View your assessment history and discover new challenges.'}
        </p>
      </div>
      
      <UserInfo user={user} />
      <AssessmentHistory history={user.assessmentHistory || []} />
      <RecommendedAssessments user={user} /> {/* This will now also work for regular users */}
      
      <div className="mt-12 text-center">
        <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
      </div>
    </div>
  );
}
