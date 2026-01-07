"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { EmailVerification } from "../_components/email-verification";
import { ForgotPasswordForm } from "../_components/forgot-password";
import SignInForm from "../_components/sign-in-tab";
import SignUpForm from "../_components/sign-up-tab";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  const lastSegment = pathname.split("/").pop() as Tab;

  const selectedTab: Tab =
    lastSegment === "signup"
      ? "signup"
      : lastSegment === "forgot-password"
        ? "forgot-password"
        : lastSegment === "email-verification"
          ? "email-verification"
          : "signin";

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/dashboard");
    });
  }, [router]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    router.push("/email-verification");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {selectedTab === "signin" && ""}
            {selectedTab === "signup" && ""}
            {selectedTab === "email-verification" && "Verify Your Email"}
            {selectedTab === "forgot-password" && "Forgot Password"}
          </h1>

          {selectedTab === "signin"}
          {/*        V&& ( */}
          {/* 	<p className="text-sm text-muted-foreground">Welcome back 👋</p> */}
          {/* )} */}

          {selectedTab === "signup"}
          {/*        && ( */}
          {/* 	<p className="text-sm text-muted-foreground"> */}
          {/* 		Let’s get you started */}
          {/* 	</p> */}
          {/* )} */}
        </header>

        {/* Forms */}
        {selectedTab === "signin" && (
          <SignInForm
            openEmailVerificationTab={openEmailVerificationTab}
            openForgotPassword={() => router.push("/forgot-password")}
          />
        )}

        {selectedTab === "signup" && (
          <>
            <SignUpForm openEmailVerificationTab={openEmailVerificationTab} />

            {/* <p className="text-center text-sm text-muted-foreground"> */}
            {/* 	Already have an account?{" "} */}
            {/* 	<Link href="/signin" className="font-medium underline"> */}
            {/* 		Sign in */}
            {/* 	</Link> */}
            {/* </p> */}
          </>
        )}

        {selectedTab === "email-verification" && (
          <EmailVerification email={email} />
        )}

        {selectedTab === "forgot-password" && (
          <ForgotPasswordForm openSignInTab={() => router.push("/signin")} />
        )}

        {/* Social Auth */}
        {/* {showSocialAuth && ( */}
        {/* 	<div className="space-y-4 pt-2"> */}
        {/* 		<div className="flex items-center gap-3"> */}
        {/* 			<div className="h-px flex-1 bg-border" /> */}
        {/* 			<span className="text-xs font-medium text-muted-foreground uppercase"> */}
        {/* 				OR */}
        {/* 			</span> */}
        {/* 			<div className="h-px flex-1 bg-border" /> */}
        {/* 		</div> */}

        {/* 		<SocialAuthButtons /> */}
        {/* 	</div> */}
        {/* )} */}
      </div>
    </main>
  );
}
