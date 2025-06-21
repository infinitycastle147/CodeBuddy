"use client"
import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserCog, Github, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { loginSchema } from "@/app/schemas/loginSchema"
import { toast } from "sonner"
import Link from "next/link"

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
	
	const [formData, setFormData] = useState({
		identifier: "", // can be email or username
		password: "",
	})
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validate with Zod schema
		const validation = loginSchema.safeParse(formData)
		if (!validation.success) {
			const newErrors: Record<string, string> = {}
			validation.error.errors.forEach((error) => {
				newErrors[error.path[0] as string] = error.message
			})
			setErrors(newErrors)
			return
		}

		setIsLoading(true)
		setErrors({})

		try {
			const result = await signIn("credentials", {
				identifier: formData.identifier,
				password: formData.password,
				redirect: false,
			})

			if (result?.error) {
				setErrors({ form: "Invalid credentials. Please try again." })
				toast.error("Login failed", {
					description: "Invalid credentials. Please check your email/username and password.",
				})
			} else if (result?.ok) {
				toast.success("Login successful", {
					description: "Welcome back! Redirecting to your dashboard...",
				})
				router.push(callbackUrl)
			}
		} catch (error) {
			console.error("Login error:", error)
			setErrors({ form: "An unexpected error occurred. Please try again." })
			toast.error("Login failed", {
				description: "An unexpected error occurred. Please try again.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleGitHubLogin = async () => {
		setIsLoading(true)
		try {
			await signIn("github", { callbackUrl })
		} catch (error) {
			console.error("GitHub login error:", error)
			toast.error("GitHub login failed", {
				description: "Unable to connect to GitHub. Please try again.",
			})
			setIsLoading(false)
		}
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Header */}
				<div className="text-center space-y-2">
					<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<UserCog className="w-8 h-8 text-primary" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
					<p className="text-muted-foreground">Sign in to your account to continue</p>
				</div>

				<Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
					<form onSubmit={handleSubmit}>
						<CardHeader className="space-y-1 pb-4">
							<CardTitle className="text-xl text-center">Sign in to your account</CardTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Email or Username Field */}
							<div className="space-y-2">
								<Label htmlFor="identifier" className="text-sm font-medium">
									Email or Username
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="identifier"
										type="text"
										placeholder="Enter your email or username"
										value={formData.identifier}
										onChange={(e) => handleInputChange("identifier", e.target.value)}
										className={`pl-10 h-11 ${errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}`}
										disabled={isLoading}
									/>
								</div>
								{errors.identifier && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<AlertCircle className="h-3 w-3" />
										{errors.identifier}
									</p>
								)}
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={formData.password}
										onChange={(e) => handleInputChange("password", e.target.value)}
										className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
										disabled={isLoading}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1 h-9 w-9 p-0"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLoading}
									>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</Button>
								</div>
								{errors.password && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<AlertCircle className="h-3 w-3" />
										{errors.password}
									</p>
								)}
							</div>


							{/* Sign In Button */}
							<Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</Button>

							{errors.form && (
								<p className="text-sm text-red-500 flex items-center gap-1">
									<AlertCircle className="h-3 w-3" />
									{errors.form}
								</p>
							)}
						</CardContent>

						<CardFooter className="flex flex-col space-y-4 pt-2">
							<div className="relative w-full">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
								</div>
							</div>

							{/* Social Login Buttons */}
							<div className="grid grid-cols-1 gap-3 w-full">
								<Button
									type="button"
									variant="outline"
									className="w-full h-11 font-medium"
									onClick={handleGitHubLogin}
									disabled={isLoading}
								>
									<Github className="mr-2 h-4 w-4" />
									Continue with GitHub
								</Button>
							</div>
						</CardFooter>
					</form>
				</Card>

				{/* Footer */}
				<div className="text-center text-sm text-muted-foreground">
					<p>
						Don&apos;t have an account?{" "}
						<Link href="/register" className="font-medium text-primary hover:underline">
							Register here
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
			<LoginForm />
		</Suspense>
	)
}
