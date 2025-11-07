"use client";

import { verifyUserEmail } from "@/actions/auth.actions";
import { Logo } from "@/config/logoSite";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  useEffect(() => {
    async function verify() {
      if (!token) {
        toast.error("Invalid verification link");
        router.push("/login");
        return;
      }

      try {
        const res = await verifyUserEmail(token);

        if (res?.error) {
          toast.error(res.error.message || "Verification failed");
          setIsVerifying(false);
          return;
        }

        if (res?.verified) {
          setIsVerified(true);
          toast.success("Email verified successfully!");
        }
      } catch (error) {
        toast.error("Verification failed");
      } finally {
        setIsVerifying(false);
      }
    }

    verify();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="line-md:loading-loop" className="text-6xl text-primary" />
          <p className="text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-4 rounded-large bg-content1 p-8 shadow-small">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <div className="rounded-full bg-success/10 p-4">
              <Icon
                icon="solar:check-circle-bold"
                className="text-6xl text-success"
              />
            </div>
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-center text-default-500">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <Button
              as={Link}
              href="/login"
              color="primary"
              size="lg"
              className="w-full"
              endContent={<Icon icon="solar:arrow-right-linear" />}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-large bg-content1 p-8 shadow-small">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="rounded-full bg-danger/10 p-4">
            <Icon
              icon="solar:close-circle-bold"
              className="text-6xl text-danger"
            />
          </div>
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-center text-default-500">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
          <Button
            as={Link}
            href="/resend-verification"
            color="primary"
            variant="bordered"
            size="lg"
            className="w-full"
          >
            Resend Verification Email
          </Button>
          <Button
            as={Link}
            href="/login"
            color="default"
            variant="light"
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
