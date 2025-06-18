
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MOCK_ADMIN_ID, ADMIN_EMAIL, ADMIN_PASSWORD, LOCAL_STORAGE_USERS_KEY, LOCAL_STORAGE_USER_ID_KEY } from "@/lib/constants";
import type { StoredUser } from "@/lib/types";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // Admin authentication
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, MOCK_ADMIN_ID);
      toast({ title: "Admin Login Successful", description: "Welcome, Admin!" });
      router.push("/admin"); 
      setIsLoading(false);
      return;
    }

    // Regular user authentication (simplified: checks email, ignores password for this mock)
    try {
      const usersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StoredUser[] = usersString ? JSON.parse(usersString) : [];
      const foundUser = users.find(user => user.email === email);

      if (foundUser) {
        // In a real app, you would also verify the password here
        localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, foundUser.id);
        toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}!` });
        router.push("/profile"); 
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
       toast({
          title: "Login Error",
          description: "An unexpected error occurred during login.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-4xl font-headline font-bold text-primary">EduAssess</h1>
          </Link>
          <CardTitle className="text-3xl font-headline">Login</CardTitle>
          <CardDescription>Access your EduAssess account or the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? "Logging in..." : <> <LogIn className="mr-2 h-5 w-5" /> Login </>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
           <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center">
            <Home className="mr-1 h-4 w-4"/> Back to Home
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
