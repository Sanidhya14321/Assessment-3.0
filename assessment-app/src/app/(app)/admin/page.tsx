
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ListChecks, PlusCircle, BarChartBig, AlertTriangle, Loader2 } from "lucide-react";
import { MOCK_ADMIN_ID, PREDEFINED_ASSESSMENTS, LOCAL_STORAGE_USER_ID_KEY, LOCAL_STORAGE_USERS_KEY } from "@/lib/constants"; 
import type { StoredUser } from "@/lib/types";
import { useRouter } from "next/navigation";

async function getTotalAssessments(): Promise<number> {
  return PREDEFINED_ASSESSMENTS.length;
}

async function getAssessmentsByCategory(): Promise<Record<string, number>> {
  const categoryCounts: Record<string, number> = {};
  for (const assessment of PREDEFINED_ASSESSMENTS) {
    categoryCounts[assessment.category] = (categoryCounts[assessment.category] || 0) + 1;
  }
  return categoryCounts;
}

export default function AdminPage() {
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalAssessments, setTotalAssessmentsState] = useState<number>(0);
  const [assessmentsByCategory, setAssessmentsByCategoryState] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    const currentUserId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (currentUserId !== MOCK_ADMIN_ID) {
      setIsAdminUser(false);
      // router.push('/login'); // Optionally redirect immediately
    } else {
      setIsAdminUser(true);
      
      // Fetch data only if admin
      const usersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const storedUsers: StoredUser[] = usersString ? JSON.parse(usersString) : [];
      setTotalUsers(storedUsers.length + 1); // +1 for the admin

      getTotalAssessments().then(setTotalAssessmentsState);
      getAssessmentsByCategory().then(setAssessmentsByCategoryState);
    }
  }, [router]);

  if (isAdminUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Card className="p-8 max-w-md shadow-lg">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-headline font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have permission to view this page.</p>
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
          <Link href="/login" className="block mt-4">
            <Button>Login as Admin</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage assessments and site statistics.</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-primary/10 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">(Registered users + Admin)</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-primary/10 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <ListChecks className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssessments}</div>
            <p className="text-xs text-muted-foreground">Predefined assessments</p>
          </CardContent>
        </Card>
        <Link href="/admin/add-assessment" className="block">
          <Card className="shadow-lg hover:shadow-primary/10 transition-shadow h-full flex flex-col justify-center items-center bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10">
              <PlusCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg font-semibold">Add New Assessment</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Create and publish new tests</CardDescription>
          </Card>
        </Link>
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
                <BarChartBig className="h-6 w-6 mr-2 text-primary" />
                Assessments by Category
            </CardTitle>
            <CardDescription>Overview of predefined assessment distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(assessmentsByCategory).length > 0 ? (
                <div className="space-y-3">
                {Object.entries(assessmentsByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-card-foreground/5 rounded-md">
                    <span className="font-medium">{category}</span>
                    <span className="text-lg font-bold text-primary">{count}</span>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No assessments found to categorize.</p>
            )}
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4">
          <h3 className="text-2xl font-headline font-semibold">Management Tools</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start p-6 text-left h-auto" disabled>
                <div>
                    <p className="font-medium text-lg">User Management</p>
                    <p className="text-sm text-muted-foreground">View, edit, or remove users (Coming Soon)</p>
                </div>
            </Button>
            <Button variant="outline" className="w-full justify-start p-6 text-left h-auto" disabled>
                 <div>
                    <p className="font-medium text-lg">Assessment List</p>
                    <p className="text-sm text-muted-foreground">Manage existing assessments (Coming Soon)</p>
                </div>
            </Button>
          </div>
      </section>
    </div>
  );
}
