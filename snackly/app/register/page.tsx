"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    
    if (res.ok) {
      alert(data.message);
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[350px] shadow-lg border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black italic tracking-tighter text-primary">
            JOIN SNACKLY
          </CardTitle>
          <CardDescription>
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase opacity-70">
                Username
              </Label>
              <Input
                id="username"
                placeholder="pick a username"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="focus-visible:ring-primary"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase opacity-70">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="focus-visible:ring-primary"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full font-bold">
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}