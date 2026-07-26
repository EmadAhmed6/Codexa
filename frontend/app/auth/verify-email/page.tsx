"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success("Verification link resent! Check your inbox.");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <Mail className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">
          Verify Your Email
        </h1>
        <p className="text-xs text-textSecondary leading-relaxed">
          We've sent a verification link to your registered email address. Please click the link to activate your DevQuill account.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-bgSecondary/60 border border-borderPrimary/40 text-left space-y-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Account Created Successfully</span>
        </div>
        <p className="text-textSecondary">
          Check your inbox and spam folder for an email from <strong>no-reply@devquill.io</strong>.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={handleResendEmail}
          variant="outline"
          disabled={isResending}
          className="w-full"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
          <span>{isResending ? "Resending Link..." : "Resend Verification Email"}</span>
        </Button>

        <Link href="/auth/verify-otp" className="block">
          <Button className="w-full rounded-xl bg-primary hover:bg-primaryHover text-primary-foreground text-xs font-semibold cursor-pointer">
            <span>Enter 6-Digit OTP Code</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
        <Link href="/auth/login" className="block text-xs text-textSecondary hover:underline">
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}
