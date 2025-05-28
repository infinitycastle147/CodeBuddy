"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Palette, GitBranch, Database } from "lucide-react"
import { AppSidebar } from "@/custom-components/app-sidebar"
import { TopBar } from "@/custom-components/top-bar"

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "backend"
  const [notifications, setNotifications] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <TopBar role={role} />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and integrations</p>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="role">Role</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@company.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" defaultValue="Senior Software Engineer" />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="role" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Configuration</CardTitle>
                      <CardDescription>Customize your role-specific experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Role</Label>
                        <Select defaultValue={role}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="backend">🧩 Backend Engineer</SelectItem>
                            <SelectItem value="frontend">🎨 Frontend Developer</SelectItem>
                            <SelectItem value="aiml">🧠 AI/ML Engineer</SelectItem>
                            <SelectItem value="pm">📋 Product Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Secondary Roles</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">DevOps</Badge>
                          <Badge variant="secondary">Security</Badge>
                          <Button variant="outline" size="sm">
                            + Add Role
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Experience Level</Label>
                        <Select defaultValue="senior">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                            <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                            <SelectItem value="senior">Senior (5+ years)</SelectItem>
                            <SelectItem value="lead">Lead/Principal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5" />
                        Git Integration
                      </CardTitle>
                      <CardDescription>Connect your repositories</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">GitHub</div>
                          <div className="text-sm text-muted-foreground">Connected as @johndoe</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">GitLab</div>
                          <div className="text-sm text-muted-foreground">Not connected</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Project Management
                      </CardTitle>
                      <CardDescription>Sync with your PM tools</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Jira</div>
                          <div className="text-sm text-muted-foreground">Sync tickets and stories</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Linear</div>
                          <div className="text-sm text-muted-foreground">Not connected</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>Choose what you want to be notified about</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Code Changes</div>
                          <div className="text-sm text-muted-foreground">Get notified about commits and PRs</div>
                        </div>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">AI Suggestions</div>
                          <div className="text-sm text-muted-foreground">Receive AI-powered insights</div>
                        </div>
                        <Switch checked={aiSuggestions} onCheckedChange={setAiSuggestions} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Security Alerts</div>
                          <div className="text-sm text-muted-foreground">Important security notifications</div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Performance Issues</div>
                          <div className="text-sm text-muted-foreground">Performance degradation alerts</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Appearance
                      </CardTitle>
                      <CardDescription>Customize the look and feel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select defaultValue="system">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Role Theme</Label>
                        <Select defaultValue="adaptive">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adaptive">Adaptive (changes with role)</SelectItem>
                            <SelectItem value="consistent">Consistent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Code Font</Label>
                        <Select defaultValue="jetbrains">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                            <SelectItem value="fira">Fira Code</SelectItem>
                            <SelectItem value="source">Source Code Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
