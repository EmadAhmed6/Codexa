"use client";

import React, { use } from "react";
import ResetPasswordPage from "../../page";

interface ResetPasswordTokenPageProps {
  params: Promise<{ userId: string; token: string }> | { userId: string; token: string };
}

export default function AuthResetPasswordTokenPage({ params }: ResetPasswordTokenPageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  return <ResetPasswordPage params={resolvedParams} />;
}
