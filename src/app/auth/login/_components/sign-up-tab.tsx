"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import AnimatedInput from "./animated-input"
import ValidationFeedback from "./validation-feedback"
import { Button } from "@/components/ui/button"
import {
  validateName,
  validateEmail,
  validateConfirmPassword,
  validatePasswordWithStrength,
  PasswordStrength,
} from "@/lib/validation"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { SocialAuthButtons } from "./social-auth-buttons"

interface SignUpFormProps {
  onToggle: () => void
  onEmailVerification: (email: string) => void
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface ValidationErrors {
  [key: string]: string | null
}

export default function SignUpForm({ onToggle, onEmailVerification }: SignUpFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = Object.values(formData).every((val) => val) && !Object.values(errors).some((err) => err)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "password") {
      const { strength } = validatePasswordWithStrength(value)
      setPasswordStrength(strength)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error: string | null = null

    switch (name) {
      case "name":
        error = validateName(value)
        break
      case "email":
        error = validateEmail(value)
        break
      case "password":
        const result = validatePasswordWithStrength(value)
        error = result.error
        setPasswordStrength(result.strength)
        break
      case "confirmPassword":
        error = validateConfirmPassword(value, formData.password)
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)

    const res = await authClient.signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      },
      {
        onError: (error: { error: { message: string } }) => {
          toast.error(error.error.message || "Failed to sign up")
        },

      },
    )

    if (res.error == null && !res.data?.user.emailVerified) {
      onEmailVerification(formData.email)
    }

    setIsLoading(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-balance text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-sm text-muted-foreground">Join us and start your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <AnimatedInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <ValidationFeedback error={errors.name} />}
        </div>

        {/* Email */}
        <div>
          <AnimatedInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <ValidationFeedback error={errors.email} />}
        </div>

        {/* Password */}
        <div className="relative">
          <AnimatedInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {formData.password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          <ValidationFeedback error={errors.password} strength={passwordStrength} />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <AnimatedInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {formData.confirmPassword && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {errors.confirmPassword && <ValidationFeedback error={errors.confirmPassword} />}
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={!isFormValid || isLoading} className="w-full">
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground uppercase">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialAuthButtons />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button onClick={onToggle} className="font-semibold text-primary hover:text-primary/80 transition-colors">
          Sign in
        </button>
      </p>
    </div>
  )
}

