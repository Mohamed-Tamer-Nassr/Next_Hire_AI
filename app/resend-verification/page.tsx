"use client";

import { resendVerification } from "@/actions/auth.actions";
import { Logo } from "@/config/logoSite";
import { Button, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "@/components/form/genericSubmitHandler";

export default function ResendVerificationPage() {
  const [emailSent, setEmailSent] = useState(false);

  const { isLoading, handleSubmit } = useGenericSubmitHandler(async (data) => {
    const res = await resendVerification(data.email);

    if (res?.error) {
      return toast.error(
        res.error.message || "Failed to send verification email"
      );
    }

    if (res?.sent) {
      setEmailSent(true);
      toast.success("Verification email sent! Check your inbox.");
    }
  });

  if (emailSent) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-4 rounded-large bg-content1 p-8 shadow-small">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <div className="rounded-full bg-success/10 p-4">
              <Icon
                icon="solar:letter-opened-bold"
                className="text-6xl text-success"
              />
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-center text-default-500">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
            <Button
              as={Link}
              href="/login"
              color="primary"
              size="lg"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Resend Verification Email</p>
          <p className="text-small text-default-500">
            Enter your email to receive a new verification link
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            endContent={<Icon icon="akar-icons:arrow-right" />}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Send Verification Email
          </Button>
        </Form>

        <p className="text-center text-small">
          Already verified?&nbsp;
          <Link href="/login" className="text-primary">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
