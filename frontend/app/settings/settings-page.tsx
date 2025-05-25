"use client"

import type React from "react"
import { useState } from "react"
import {
  UserCog,
  Palette,
  GitBranch,
  Ticket,
  Download,
  ChevronDown,
  Settings,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SettingsTabProps {
  icon: React.ReactNode
  label: string
  description?: string
}

function SettingsTab({ icon, label, description }: SettingsTabProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-primary">{icon}</div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-foreground">{label}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="space-y-3">
      <button
        className="flex items-center gap-2 w-full text-left font-medium text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
        {title}
      </button>
      {open && <div className="pl-6 space-y-3 animate-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  )
}

export default function SettingsPage() {
  const [feedbackOptIn, setFeedbackOptIn] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Settings & Preferences</h1>
          </div>
          <p className="text-muted-foreground mt-1">Customize your workspace and manage integrations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Role Customization Section */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <SettingsTab
                icon={<UserCog className="w-5 h-5" />}
                label="Role Customization"
                description="Personalize your workspace based on your role"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <CollapsibleSection title="Switch Role" defaultOpen>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Change your current role to access different features and layouts
                  </p>
                  <Button variant="outline" className="w-full justify-start">
                    <UserCog className="w-4 h-4 mr-2" />
                    Change Role
                  </Button>
                </div>
              </CollapsibleSection>

              <Separator />

              <CollapsibleSection title="Theme Preferences">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark theme for your role</p>
                    </div>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="w-4 h-4 mr-2" />
                    Customize Theme
                  </Button>
                </div>
              </CollapsibleSection>
            </CardContent>
          </Card>

          {/* Integration & Export Section */}
          <div className="space-y-8">
            {/* Git/Jira Integration */}
            <Card>
              <CardHeader className="pb-4">
                <SettingsTab
                  icon={<GitBranch className="w-5 h-5" />}
                  label="Git/Jira Integration"
                  description="Connect your development tools"
                />
              </CardHeader>
              <CardContent>
                <CollapsibleSection title="Configure Integrations" defaultOpen>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Connect your Git repositories and Jira projects for seamless workflow
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Connect Git
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Ticket className="w-4 h-4 mr-2" />
                        Connect Jira
                      </Button>
                    </div>
                  </div>
                </CollapsibleSection>
              </CardContent>
            </Card>

            {/* Export & Feedback */}
            <Card>
              <CardHeader className="pb-4">
                <SettingsTab
                  icon={<Download className="w-5 h-5" />}
                  label="Export & Feedback"
                  description="Manage data export and feedback preferences"
                />
              </CardHeader>
              <CardContent className="space-y-6">
                <CollapsibleSection title="Feedback Settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="feedback-opt-in">Feedback Opt-in</Label>
                        <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                      </div>
                      <Switch id="feedback-opt-in" checked={feedbackOptIn} onCheckedChange={setFeedbackOptIn} />
                    </div>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Feedback
                    </Button>
                  </div>
                </CollapsibleSection>

                <Separator />

                <CollapsibleSection title="Export Options">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Export your data in various formats</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CollapsibleSection>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
