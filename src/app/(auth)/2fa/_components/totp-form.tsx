"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { motion } from "framer-motion"; // 👈 ADD THIS

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface TotpFormData {
  code: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export function TotpForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<TotpFormData>({ code: "" });
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ----------------------------- handlers ----------------------------- */

  const handleChange = (value: string) => {
    setFormData({ code: value });
    if (error) setError(undefined);
  };

  const validateCode = () => {
    if (!/^\d{6}$/.test(formData.code.trim())) return "Enter a 6-digit code.";
    return undefined;
  };

  /* ----------------------------- submit ----------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateCode();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.twoFactor.verifyTotp(
        { code: formData.code },
        {
          onError: (err) => {
            toast.error(err.error?.message || "Failed to verify code");
          },
          onSuccess: () => {
            toast.success("Two-factor authentication verified!");
            router.push("/dashboard");
          },
        },
      );
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }

    setIsSubmitting(false);
  };

  /* ----------------------------- UI ----------------------------- */

  const isFormValid = formData.code.trim().length === 6 && !validateCode();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <AnimatedInput
          id="totp-code"
          type="text"
          label="6-digit code"
          value={formData.code}
          onChange={handleChange}
          onBlur={() => setError(validateCode())}
          error={error}
          required
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-body rounded-full shadow-xl transition-all"
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
                Verifying...
              </>
            ) : (
              <>
                Verify
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}
