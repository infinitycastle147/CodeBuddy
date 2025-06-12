"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserCog, Github, ShieldCheck, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { useSession, signIn } from "next-auth/react"

const roles = [
	{ label: "Backend Engineer", value: "backend" },
	{ label: "Frontend Developer", value: "frontend" },
	{ label: "AI/ML Engineer", value: "ai-ml" },
	{ label: "Product Manager", value: "pm" },
]

export default function LoginPage() {
	const [formData, setFormData] = useState({
		identifier: "", // can be email or username
		password: "",
		role: "",
	})
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.identifier) {
			newErrors.identifier = "Email or username is required"
		}

		if (!formData.password) {
			newErrors.password = "Password is required"
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return
		setIsLoading(true)
		const res = await signIn("credentials", {
			redirect: false,
			email: formData.identifier, // send as email for backend
			password: formData.password,
		})
		setIsLoading(false)
		if (res?.error) {
			setErrors({ ...errors, form: res.error })
		} else {
			window.location.href = "/dashboard"
		}
	}

	const handleSocialLogin = async (provider: string) => {
		setIsLoading(true)
		// Simulate social login
		await new Promise((resolve) => setTimeout(resolve, 1500))
		setIsLoading(false)
		console.log(`${provider} login initiated`)
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

							{/* Role Selection */}
							<div className="space-y-2">
								<Label htmlFor="role" className="text-sm font-medium">
									Your role
								</Label>
								<Select
									value={formData.role}
									onValueChange={(value) => handleInputChange("role", value)}
									disabled={isLoading}
								>
									<SelectTrigger id="role" className={`h-11 ${errors.role ? "border-red-500 focus:ring-red-500" : ""}`}>
										<SelectValue placeholder="Select your role" />
									</SelectTrigger>
									<SelectContent>
										{roles.map((role) => (
											<SelectItem key={role.value} value={role.value}>
												{role.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.role && (
									<p className="text-sm text-red-500 flex items-center gap-1">
										<AlertCircle className="h-3 w-3" />
										{errors.role}
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
									onClick={() => handleSocialLogin("GitHub")}
									disabled={isLoading}
								>
									<Github className="mr-2 h-4 w-4" />
									Continue with GitHub
								</Button>

								<Button
									type="button"
									variant="outline"
									className="w-full h-11 font-medium"
									onClick={() => handleSocialLogin("SSO")}
									disabled={isLoading}
								>
									<ShieldCheck className="mr-2 h-4 w-4" />
									Continue with SSO
								</Button>
							</div>

							{/* Demo Mode */}
							<div className="relative w-full">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">Or try demo</span>
								</div>
							</div>

							<Button
								type="button"
								variant="ghost"
								className="w-full h-11 font-medium text-muted-foreground hover:text-foreground"
								onClick={() => handleSocialLogin("Demo")}
								disabled={isLoading}
							>
								<Eye className="mr-2 h-4 w-4" />
								Quick Demo Mode
							</Button>
						</CardFooter>
					</form>
				</Card>

				{/* Footer */}
				<div className="text-center text-sm text-muted-foreground">
					<p>
						Don&apos;t have an account?{" "}
						<Button variant="link" className="p-0 h-auto font-medium text-primary">
							Sign up here
						</Button>
					</p>
				</div>
			</div>
		</div>
	)
}
