// Next.js imports
import Link from "next/link";

// UI Component imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icon imports
import {
  Sparkles,
  Code2,
  Users,
  BookOpen,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Zap,
  Shield,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { CODEBUDDY_DOCS_URL } from "@/constants/links";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">CodeBuddy</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            Testimonials
          </Link>
          <a
            href={CODEBUDDY_DOCS_URL}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-1"
          >
            Docs
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        {/* Sign In Button */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="hover:scale-105 transition-transform duration-200" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-4xl text-center py-20 px-4">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 hover:bg-blue-50 animate-fade-in">
            <Sparkles className="mr-1 h-3 w-3 text-blue-600" />
            AI-Powered Development Assistant
          </Badge>

          {/* Hero Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Your Intelligent
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {" "}
              Code Companion
            </span>
          </h1>

          {/* Hero Subheading */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            Accelerate development with role-aware AI assistance, smart code
            analysis, and seamless team collaboration. Built for modern
            development workflows.
          </p>

          {/* Hero Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Button size="lg" className="h-12 px-8 hover:scale-105 transition-transform duration-200" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-transform duration-200" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/30 py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need to code smarter
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features designed to enhance your development workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.1s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Code Analysis</CardTitle>
                <CardDescription>
                  Get instant insights, performance suggestions, and code
                  quality improvements powered by AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Role-Aware Assistant</CardTitle>
                <CardDescription>
                  Tailored experience for backend, frontend, AI/ML engineers,
                  and product managers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.3s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Visual Diagrams</CardTitle>
                <CardDescription>
                  Generate UML, ERD, flowcharts, and architecture diagrams from
                  your codebase
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.4s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
                <CardDescription>
                  Your code stays private with enterprise-grade security and
                  compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.5s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Git Integration</CardTitle>
                <CardDescription>
                  Seamlessly connect with GitHub, GitLab, and Jira for complete
                  workflow integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md h-full flex flex-col animate-scale-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{animationDelay: '0.6s'}}>
              <CardHeader className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Multi-Language Support
                </CardTitle>
                <CardDescription>
                  Support for JavaScript, TypeScript, Python, Java, Go, and 20+
                  programming languages
                </CardDescription>
              </CardHeader>
            </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Trusted by developers worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about CodeBuddy
            </p>
          </div>

            <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-sm h-full flex flex-col animate-slide-in-left hover:shadow-md transition-all duration-300" style={{animationDelay: '0.1s'}}>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="hover:scale-110 transition-transform duration-200">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">James Doe</div>
                    <div className="text-sm text-muted-foreground">
                      Senior Frontend Engineer
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">
                  &quot;CodeBuddy has transformed how I approach code reviews
                  and debugging. The AI insights are incredibly accurate and
                  save me hours every week.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm h-full flex flex-col animate-slide-in-left hover:shadow-md transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="hover:scale-110 transition-transform duration-200">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Anna Smith</div>
                    <div className="text-sm text-muted-foreground">
                      Product Manager
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">
                  &quot;The role-aware features are game-changing. I get
                  high-level insights without getting lost in technical details.
                  Perfect for stakeholder updates.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm h-full flex flex-col animate-slide-in-left hover:shadow-md transition-all duration-300" style={{animationDelay: '0.3s'}}>
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="hover:scale-110 transition-transform duration-200">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Rahul Kumar</div>
                    <div className="text-sm text-muted-foreground">
                      ML Engineer
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">
                  &quot;The diagram generation feature is phenomenal. It
                  automatically creates architecture diagrams that would take me
                  hours to draw manually.&quot;
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 py-20 px-4">
          <div className="mx-auto max-w-2xl text-center animate-scale-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to supercharge your development?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who are already building better
              software with CodeBuddy
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 hover:scale-105 transition-all duration-200 hover:shadow-lg group" asChild>
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 hover:scale-105 transition-all duration-200 hover:shadow-lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl py-12 px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                  <Code2 className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="font-bold">CodeBuddy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your intelligent coding companion for faster, smarter
                development.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 CodeBuddy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
