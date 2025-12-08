"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import AnimatedInput from "./animated-input";
import ValidationFeedback from "./validation-feedback";
import { validateEmail } from "@/lib/validation";

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

export function ForgotPassword({ onBackToSignIn }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: "/auth/reset-password",
      },
      {
        onError: (error: { error: { message: string } }) => {
          toast.error(
            error.error.message || "Failed to send password reset email",
          );
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
          setIsSuccess(true);
          setIsLoading(false);
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-muted-foreground text-sm">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onBackToSignIn}
          className="w-full bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Forgot your password?</h2>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <AnimatedInput
            id="reset-email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            onBlur={() => {
              const validationError = validateEmail(email);
              setError(validationError);
            }}
          />
          {error && <ValidationFeedback error={error} />}
        </div>

        <Button type="submit" disabled={isLoading || !email} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <Button variant="ghost" onClick={onBackToSignIn} className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to sign in
      </Button>
    </div>
  );
}
