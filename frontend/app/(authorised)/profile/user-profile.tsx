"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Code,
  Brain,
  BarChart3,
  GitBranch,
  MessageSquare,
  Clock,
  Users,
  Zap,
  TrendingUp,
  FileText,
  Database,
  Settings,
} from "lucide-react";

// Mock data - in real app this would come from API
const userData = {
  name: "Alex Chen",
  email: "alex.chen@company.com",
  role: "backend",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "March 2024",
  teamName: "Core Platform Team",
  totalQueries: 1247,
  aiAdaptationScore: 85,
  recentActivity: [
    {
      type: "query",
      content: "Explain the authentication flow in our API",
      time: "2 hours ago",
    },
    {
      type: "analysis",
      content: "Generated API documentation for user service",
      time: "5 hours ago",
    },
    {
      type: "collaboration",
      content: "Shared insights with Frontend team",
      time: "1 day ago",
    },
    {
      type: "integration",
      content: "Connected new GitHub repository",
      time: "2 days ago",
    },
  ],
  integrations: [
    { name: "GitHub", status: "connected", repos: 12 },
    { name: "Jira", status: "connected", projects: 3 },
    { name: "Slack", status: "connected", channels: 8 },
    { name: "Docker", status: "pending", repos: 0 },
  ],
  skillTags: [
    "Node.js",
    "PostgreSQL",
    "Docker",
    "Microservices",
    "REST APIs",
    "GraphQL",
  ],
  recentProjects: [
    {
      name: "User Authentication Service",
      language: "TypeScript",
      lastActive: "Today",
    },
    {
      name: "Payment Processing API",
      language: "Python",
      lastActive: "Yesterday",
    },
    {
      name: "Data Pipeline Optimization",
      language: "Go",
      lastActive: "3 days ago",
    },
  ],
};

const roleConfig = {
  backend: {
    icon: Code,
    color: "bg-gray-100 text-gray-800",
    title: "Backend Engineer",
    insights: [
      { label: "API Endpoints Analyzed", value: "156", trend: "+12%" },
      { label: "Database Queries Optimized", value: "43", trend: "+8%" },
      { label: "Service Dependencies Mapped", value: "28", trend: "+15%" },
    ],
  },
  frontend: {
    icon: Code,
    color: "bg-gray-100 text-gray-800",
    title: "Frontend Developer",
    insights: [
      { label: "Components Analyzed", value: "89", trend: "+18%" },
      { label: "API Integrations", value: "34", trend: "+5%" },
      { label: "UI Patterns Identified", value: "67", trend: "+22%" },
    ],
  },
  "ai-ml": {
    icon: Brain,
    color: "bg-gray-100 text-gray-800",
    title: "AI/ML Engineer",
    insights: [
      { label: "Models Analyzed", value: "12", trend: "+25%" },
      { label: "Data Pipelines Mapped", value: "8", trend: "+33%" },
      { label: "Training Workflows", value: "15", trend: "+10%" },
    ],
  },
  product: {
    icon: BarChart3,
    color: "bg-gray-100 text-gray-800",
    title: "Product Manager",
    insights: [
      { label: "Features Analyzed", value: "45", trend: "+20%" },
      { label: "User Stories Mapped", value: "128", trend: "+15%" },
      { label: "Team Alignments", value: "23", trend: "+8%" },
    ],
  },
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const config = roleConfig[userData.role as keyof typeof roleConfig];
  const RoleIcon = config.icon;

  return (
    <div className="h-full flex justify-center items-center bg-background">
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
              />
              <AvatarFallback className="text-lg">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={config.color}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {config.title}
                </Badge>
                <Badge variant="outline">{userData.teamName}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Joined {userData.joinDate}
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Queries
                </span>
              </div>
              <p className="text-2xl font-bold">
                {userData.totalQueries.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  AI Adaptation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {userData.aiAdaptationScore}%
                </p>
                <Progress
                  value={userData.aiAdaptationScore}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Integrations
                </span>
              </div>
              <p className="text-2xl font-bold">
                {
                  userData.integrations.filter((i) => i.status === "connected")
                    .length
                }
                /{userData.integrations.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Team Projects
                </span>
              </div>
              <p className="text-2xl font-bold">
                {userData.recentProjects.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Role Insights</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.skillTags.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userData.recentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.language}
                        </p>
                      </div>
                      <Badge variant="outline">{project.lastActive}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {config.title} Insights
                </CardTitle>
                <CardDescription>
                  Role-specific metrics and AI-generated insights tailored for
                  your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {config.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border rounded-lg"
                    >
                      <p className="text-2xl font-bold">{insight.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {insight.label}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {insight.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        {activity.type === "query" && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {activity.type === "analysis" && (
                          <Brain className="h-4 w-4" />
                        )}
                        {activity.type === "collaboration" && (
                          <Users className="h-4 w-4" />
                        )}
                        {activity.type === "integration" && (
                          <GitBranch className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Connected Integrations
                </CardTitle>
                <CardDescription>
                  Tools and services connected to enhance your CodeBuddy
                  experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.integrations.map((integration, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.status === "connected"
                            ? `${integration.repos} repositories`
                            : "Not connected"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          integration.status === "connected"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
