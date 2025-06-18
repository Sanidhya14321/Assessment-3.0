
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_EMAIL, LOCAL_STORAGE_USERS_KEY } from "@/lib/constants";
import type { StoredUser } from "@/lib/types";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (email === ADMIN_EMAIL) {
      toast({
        title: "Registration Error",
        description: "This email address is reserved for administration.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call for signup
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const usersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StoredUser[] = usersString ? JSON.parse(usersString) : [];

      if (users.find(user => user.email === email)) {
        toast({
          title: "Signup Failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newUser: StoredUser = { id: newUserId, name, email };
      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      
      toast({
        title: "Signup Successful",
        description: "Welcome! Please login to continue.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred during signup. Please try again.",
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
          <CardTitle className="text-3xl font-headline">Create Account</CardTitle>
          <CardDescription>Join EduAssess and start your learning adventure today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
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
                minLength={6}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? "Creating Account..." : <> <UserPlus className="mr-2 h-5 w-5" /> Sign Up </>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
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
