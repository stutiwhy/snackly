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

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-[350px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black italic tracking-tighter text-primary">
            WELCOME BACK
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase opacity-70">
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase opacity-70">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}