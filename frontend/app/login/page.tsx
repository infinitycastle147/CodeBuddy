"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCog, Github, ShieldCheck, Eye } from "lucide-react";

const roles = [
  { label: "Backend Engineer", value: "backend" },
  { label: "Frontend Developer", value: "frontend" },
  { label: "AI/ML Engineer", value: "ai-ml" },
  { label: "Product Manager", value: "pm" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Placeholder for routing logic
  const handleRoleSelect = (role: string) => setSelectedRole(role);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
            <UserCog className="w-12 h-12 text-muted-foreground" />
          </div>
          <CardTitle>Sign in & Select Role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="role">Choose your role</Label>
          <Select value={selectedRole} onValueChange={handleRoleSelect}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Github /> Sign in with GitHub
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <ShieldCheck /> Sign in with SSO
          </Button>
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
            <Eye /> Quick Demo Mode
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 