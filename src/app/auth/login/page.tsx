"use client"

import SignUpForm from "./_components/sign-up-tab"
import SignInForm from "./_components/sign-in-tab"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { EmailVerification } from "./_components/email-verification"
import { ForgotPassword } from "./_components/forgot-password"

type View = "signin" | "signup" | "email-verification" | "forgot-password"

export default function Home() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<View>("signin")
  const [email, setEmail] = useState("")

  // Check if user is already logged in
  useEffect(() => {
    authClient.getSession().then((session: any) => {
      if (session.data != null) router.push("/dashboard")
    })
  }, [router])

  const openEmailVerification = (userEmail: string) => {
    setEmail(userEmail)
    setCurrentView("email-verification")
  }

  const renderView = () => {
    switch (currentView) {
      case "signin":
        return (
          <SignInForm
            onToggle={() => setCurrentView("signup")}
            onForgotPassword={() => setCurrentView("forgot-password")}
            onEmailVerification={openEmailVerification}
          />
        )
      case "signup":
        return <SignUpForm onToggle={() => setCurrentView("signin")} onEmailVerification={openEmailVerification} />
      case "email-verification":
        return <EmailVerification email={email} onBackToSignIn={() => setCurrentView("signin")} />
      case "forgot-password":
        return <ForgotPassword onBackToSignIn={() => setCurrentView("signin")} />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">{renderView()}</div>
    </main>
  )
}

