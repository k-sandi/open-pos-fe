"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";

const loginSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  pin: z.string().min(4, { message: "PIN must be at least 4 digits" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      pin: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setError(null);
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          employee_id: data.employeeId,
          pin: data.pin,
        }),
      });
      
      if (res && res.token) {
        localStorage.setItem("x-api-key", res.token);
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your employee ID and PIN to access the POS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input 
                id="employeeId" 
                placeholder="Enter your ID" 
                {...register("employeeId")} 
              />
              {errors.employeeId && (
                <p className="text-sm font-medium text-destructive">{errors.employeeId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input 
                id="pin" 
                type="password" 
                placeholder="****" 
                {...register("pin")} 
              />
              {errors.pin && (
                <p className="text-sm font-medium text-destructive">{errors.pin.message}</p>
              )}
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive">{error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
