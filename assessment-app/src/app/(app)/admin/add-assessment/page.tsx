
"use client"; 

import { AddAssessmentForm } from "@/components/admin/add-assessment-form";
import { AlertTriangle, UserCog, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MOCK_ADMIN_ID, LOCAL_STORAGE_USER_ID_KEY } from "@/lib/constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddAssessmentPage() {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUserId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (currentUserId === MOCK_ADMIN_ID) {
      setIsUserAdmin(true);
    } else {
      setIsUserAdmin(false);
      // router.push('/login'); // Optionally redirect
    }
  }, [router]);

  if (isUserAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying admin status...</p>
      </div>
    );
  }

  if (!isUserAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Card className="p-8 max-w-md shadow-lg">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-headline font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have permission to perform this action.</p>
          <Link href="/admin">
            <Button variant="outline">Back to Admin Dashboard</Button>
          </Link>
           <Link href="/login" className="block mt-4">
            <Button>Login as Admin</Button>
          </Link>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <AddAssessmentForm />
    </div>
  );
}
