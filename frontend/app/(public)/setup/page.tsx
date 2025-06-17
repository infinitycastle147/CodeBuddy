"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Github,
  Settings,
  Brain,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  Code2Icon,
} from "lucide-react";

interface SetupData {
  github: {
    token: string;
    username: string;
  };
  jira: {
    url: string;
    apiToken: string;
    username: string;
    projectKey: string;
  };
  aiModel: {
    name: string;
    token: string;
  };
}

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTokens, setShowTokens] = useState({
    github: false,
    jira: false,
    ai: false,
  });
  const [setupData, setSetupData] = useState<SetupData>({
    github: { token: "", username: "" },
    jira: { url: "", apiToken: "", username: "", projectKey: "" },
    aiModel: { name: "", token: "" },
  });

  const steps = [
    {
      title: "Welcome",
      icon: Sparkles,
      color: "from-violet-500 to-purple-600",
    },
    { title: "GitHub", icon: Github, color: "from-gray-700 to-gray-900" },
    { title: "Jira", icon: Settings, color: "from-blue-500 to-blue-600" },
    { title: "AI Model", icon: Brain, color: "from-emerald-500 to-teal-600" },
    {
      title: "Complete",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("setupData", JSON.stringify(setupData));
    alert("Setup completed successfully!");
  };

  const updateSetupData = (
    section: keyof SetupData,
    field: string,
    value: string
  ) => {
    setSetupData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleTokenVisibility = (type: "github" | "jira" | "ai") => {
    setShowTokens((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const isGitHubValid = setupData.github.token && setupData.github.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-lg">
            <Code2Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Welcome to Your Setup
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let&apos;s configure your workspace in a few simple steps to get you
            started with all the tools you need.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium"
              >
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200" />
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-br ${step.color} shadow-lg scale-110`
                          : isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"
                          : "bg-gray-200"
                      }
                    `}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive || isCompleted
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="p-8 lg:p-12">
              {/* Welcome Step */}
              {currentStep === 0 && (
                <div className="text-center space-y-8 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 rounded-3xl mx-auto blur-xl opacity-50 -z-10" />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      We&apos;ll help you connect your favorite tools and
                      configure everything you need. The entire process takes
                      less than 5 minutes.
                    </p>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50/50 backdrop-blur-sm">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong className="font-semibold">
                        Your privacy matters.
                      </strong>{" "}
                      All your API keys and sensitive information are stored
                      securely in your browser only. We never access, store, or
                      transmit your personal credentials to our servers. Your
                      data stays with you, always.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 rounded-xl bg-gray-50/50">
                      <Github className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                      <h3 className="font-semibold text-sm">GitHub</h3>
                      <p className="text-xs text-gray-600">
                        Connect repositories
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gray-50/50">
                      <Settings className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold text-sm">Jira</h3>
                      <p className="text-xs text-gray-600">Manage projects</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gray-50/50">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                      <h3 className="font-semibold text-sm">AI Model</h3>
                      <p className="text-xs text-gray-600">Free usage</p>
                    </div>
                  </div>
                </div>
              )}

              {/* GitHub Step */}
              {currentStep === 1 && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Github className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Connect GitHub
                        </h2>
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Required
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        Connect your GitHub account to access repositories and
                        manage your codebase seamlessly.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="github-username"
                        className="text-sm font-semibold text-gray-700"
                      >
                        GitHub Username
                      </Label>
                      <Input
                        id="github-username"
                        placeholder="Enter your GitHub username"
                        value={setupData.github.username}
                        onChange={(e) =>
                          updateSetupData("github", "username", e.target.value)
                        }
                        className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="github-token"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Personal Access Token
                      </Label>
                      <div className="relative">
                        <Input
                          id="github-token"
                          type={showTokens.github ? "text" : "password"}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          value={setupData.github.token}
                          onChange={(e) =>
                            updateSetupData("github", "token", e.target.value)
                          }
                          className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => toggleTokenVisibility("github")}
                        >
                          {showTokens.github ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Need a token?</strong> Go to GitHub Settings →
                          Developer settings → Personal access tokens → Generate
                          new token. Select <strong>repo</strong> scope for full
                          repository access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Jira Step */}
              {currentStep === 2 && (
                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Connect Jira
                        </h2>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          Optional
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        Link your Jira workspace to streamline project
                        management and issue tracking.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="jira-url"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Jira Instance URL
                      </Label>
                      <Input
                        id="jira-url"
                        placeholder="https://yourcompany.atlassian.net"
                        value={setupData.jira.url}
                        onChange={(e) =>
                          updateSetupData("jira", "url", e.target.value)
                        }
                        className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="jira-username"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="jira-username"
                        placeholder="your-email@company.com"
                        value={setupData.jira.username}
                        onChange={(e) =>
                          updateSetupData("jira", "username", e.target.value)
                        }
                        className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="jira-token"
                        className="text-sm font-semibold text-gray-700"
                      >
                        API Token
                      </Label>
                      <div className="relative">
                        <Input
                          id="jira-token"
                          type={showTokens.jira ? "text" : "password"}
                          placeholder="Your Jira API token"
                          value={setupData.jira.apiToken}
                          onChange={(e) =>
                            updateSetupData("jira", "apiToken", e.target.value)
                          }
                          className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => toggleTokenVisibility("jira")}
                        >
                          {showTokens.jira ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="jira-project"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Project Key
                      </Label>
                      <Input
                        id="jira-project"
                        placeholder="PROJ"
                        value={setupData.jira.projectKey}
                        onChange={(e) =>
                          updateSetupData("jira", "projectKey", e.target.value)
                        }
                        className="h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>How to get your API token:</strong> Go to Jira
                      Settings → Personal Access Tokens → Create token, or use
                      Account Settings → Security → API tokens for Atlassian
                      Cloud.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Model Step */}
              {currentStep === 3 && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          AI Model Setup
                        </h2>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          Optional
                        </Badge>
                      </div>
                      <p className="text-gray-600">
                        Use your own AI model to unlock free access to all
                        premium features.
                      </p>
                    </div>
                  </div>

                  <Alert className="border-emerald-200 bg-emerald-50/50 backdrop-blur-sm">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      <strong className="font-semibold">
                        Unlock free premium access!
                      </strong>{" "}
                      By providing your own AI model credentials, you can use
                      all our advanced features at no cost. We&apos;ll use your
                      AI model for processing, and your API key remains secure
                      in your browser.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="ai-model-name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        AI Model Name
                      </Label>
                      <Input
                        id="ai-model-name"
                        placeholder="gpt-4, claude-3-sonnet, gemini-pro, etc."
                        value={setupData.aiModel.name}
                        onChange={(e) =>
                          updateSetupData("aiModel", "name", e.target.value)
                        }
                        className="h-12 text-base border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="ai-model-token"
                        className="text-sm font-semibold text-gray-700"
                      >
                        API Token
                      </Label>
                      <div className="relative">
                        <Input
                          id="ai-model-token"
                          type={showTokens.ai ? "text" : "password"}
                          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                          value={setupData.aiModel.token}
                          onChange={(e) =>
                            updateSetupData("aiModel", "token", e.target.value)
                          }
                          className="h-12 text-base border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => toggleTokenVisibility("ai")}
                        >
                          {showTokens.ai ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Supported providers:</strong> OpenAI (GPT-4,
                      GPT-3.5), Anthropic (Claude), Google AI (Gemini), and
                      other OpenAI-compatible APIs.
                    </p>
                  </div>
                </div>
              )}

              {/* Complete Step */}
              {currentStep === 4 && (
                <div className="text-center space-y-8 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl mx-auto blur-xl opacity-50 -z-10" />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Perfect! You&apos;re All Set
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Your workspace is now configured and ready to use.
                      Let&apos;s start building something amazing together!
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 text-left">
                      Configuration Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Github className="w-5 h-5 text-gray-700" />
                          <span className="font-medium text-gray-900">
                            GitHub Integration
                          </span>
                        </div>
                        <Badge
                          variant={isGitHubValid ? "default" : "secondary"}
                          className={
                            isGitHubValid
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {isGitHubValid ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Settings className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            Jira Integration
                          </span>
                        </div>
                        <Badge
                          variant={setupData.jira.url ? "default" : "secondary"}
                          className={
                            setupData.jira.url
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : ""
                          }
                        >
                          {setupData.jira.url ? "Connected" : "Skipped"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-gray-900">
                            AI Model
                          </span>
                        </div>
                        <Badge
                          variant={
                            setupData.aiModel.name ? "default" : "secondary"
                          }
                          className={
                            setupData.aiModel.name
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : ""
                          }
                        >
                          {setupData.aiModel.name ? "Configured" : "Skipped"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Navigation */}
            <div className="flex justify-between items-center p-8 lg:px-12">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 h-12 px-6 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleFinish}
                  className="flex items-center space-x-2 h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                >
                  <span>Complete Setup</span>
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !isGitHubValid}
                  className="relative flex items-center justify-center h-12 px-8 overflow-hidden border-0 rounded-md bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl group"
                >
                  {/* Main content */}
                  <span className="relative z-10 font-semibold text-white transition-all duration-300 group-hover:text-gray-100">
                    Continue
                  </span>
                  <ArrowRight className="w-4 h-4 text-white transition-all duration-300 relative z-10 group-hover:translate-x-1 group-hover:text-gray-100" />

                  {/* Shine sweep */}
                  <span className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <span className="absolute top-0 left-0 w-full h-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </span>

                  {/* Subtle overlay gradient */}
                  <span className="absolute inset-0 pointer-events-none z-0">
                    <span className="block h-full w-0 group-hover:w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent transition-all duration-700 ease-out" />
                  </span>

                  {/* Border glow */}
                  <span className="absolute inset-0 rounded-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
