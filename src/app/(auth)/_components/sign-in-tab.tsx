"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { SocialAuthButtons } from "./social-auth-buttons";
import { ForgotPasswordForm } from "./forgot-password";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const initialFormData: FormData = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function SignInForm({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const router = useRouter();

  const [activeView, setActiveView] = useState<"signin" | "forgot-password">(
    "signin",
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- remember me ---------------- */

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((p) => ({
        ...p,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  /* ----------------------------- handlers ----------------------------- */

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));
    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
  };

  const validateEmail = (): string | undefined =>
    /\S+@\S+\.\S+/.test(formData.email.trim())
      ? undefined
      : "Please enter a valid email address.";

  const validatePassword = (): string | undefined =>
    formData.password.length >= 8
      ? undefined
      : "Password must be at least 8 characters.";

  // const handleEmailBlur = () => {
  //   setErrors((prev) => ({ ...prev, email: validateEmail() }));
  // };

  // const handlePasswordBlur = () => {
  //   setErrors((prev) => ({ ...prev, password: validatePassword() }));
  // };

  const isFormValid =
    formData.email &&
    formData.password &&
    !validateEmail() &&
    !validatePassword();
  /* ----------------------------- submit ----------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail();
    const passwordError = validatePassword();

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
          callbackURL: "/dashboard",
        },
        {
          onError: (error) => {
            if (error.error.code === "EMAIL_NOT_VERIFIED") {
              openEmailVerificationTab(formData.email);
            }

            toast.error(error.error.message || "Failed to sign in");
          },
          onSuccess: () => {
            if (formData.rememberMe) {
              localStorage.setItem("rememberedEmail", formData.email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }

            router.push("/dashboard");
          },
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeView === "forgot-password") {
    return <ForgotPasswordForm openSignInTab={() => setActiveView("signin")} />;
  }
  /* ----------------------------- UI ----------------------------- */

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 font-manrope">
        <div className="relative z-10">
          <motion.div className="text-center mb-8 font-satoshi">
            <h1 className="text-3xl font-aeonik mb-2">Welcome back 👋</h1>
          </motion.div>
          <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-6 font-aeonik"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatedInput
                id="email"
                type="email"
                label="Email address"
                value={formData.email}
                onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    email: validateEmail(),
                  }))
                }
                error={errors.email}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatedInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                onChange={(v) => setFormData((p) => ({ ...p, password: v }))}
                onBlur={() =>
                  setErrors((e) => ({
                    ...e,
                    password: validatePassword(),
                  }))
                }
                error={errors.password}
                showToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
                required
              />
            </motion.div>

            {/* Remember Me and Forgot Password */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Remember Me Checkbox */}
              <motion.label
                className="flex items-center cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${formData.rememberMe
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-600"
                        : "border-gray-300 bg-white/80 group-hover:border-green-400"
                      }`}
                  >
                    {formData.rememberMe && (
                      <motion.svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-700 group-hover:text-green-600 transition-colors duration-200">
                  Remember me
                </span>
              </motion.label>

              {/* Forgot Password Button (view switch, not routing) */}
              <motion.button
                type="button"
                onClick={() => setActiveView("forgot-password")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                Forgot password?
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner
                        size={20}
                        barWidth={2}
                        barLength={5}
                        numBars={12}
                        className="mr-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">
                  or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-inter">
              <SocialAuthButtons />
            </div>

            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold transition-colors duration-200"
                style={{
                  color: "#059669",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#047857";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#059669";
                }}
              >
                Create one here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
