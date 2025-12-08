"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { Loader2, Mail, RefreshCw } from "lucide-react"

interface EmailVerificationProps {
  email: string
  onBackToSignIn?: () => void
}

export function EmailVerification({ email, onBackToSignIn }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false)
  const [timeToNextResend, setTimeToNextResend] = useState(30)
  const interval = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    startEmailVerificationCountdown()
    return () => clearInterval(interval.current)
  }, [])

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time)
    clearInterval(interval.current)
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1
        if (newT <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newT
      })
    }, 1000)
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/",
      })
      toast.success("Verification email sent!")
      startEmailVerificationCountdown()
    } catch {
      toast.error("Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  const isDisabled = isResending || timeToNextResend > 0

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Mail className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          We sent a verification link to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-3">
        <Button variant="outline" onClick={handleResendEmail} disabled={isDisabled} className="w-full bg-transparent">
          {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {timeToNextResend > 0 ? `Resend email (${timeToNextResend})` : "Resend verification email"}
        </Button>

        {onBackToSignIn && (
          <Button variant="ghost" onClick={onBackToSignIn} className="w-full">
            Back to sign in
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Didn't receive the email? Check your spam folder.</p>
    </div>
  )
}

