"use client";

import { resetPassword } from "@/actions/auth.actions";
import { Button, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Logo } from "../../config/logoSite";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";

function ResetPasswordForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidLink, setIsValidLink] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const resetId = searchParams.get("id");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  // Validate the reset link on mount
  useEffect(() => {
    const validateResetLink = async () => {
      if (!resetId) {
        toast.error("Invalid reset link - missing ID");
        setIsValidating(false);
        setTimeout(() => {
          router.push("/password/forgot");
        }, 3000);
        return;
      }

      // Validate format (32 hex characters for resetId)
      if (!/^[a-f0-9]{32}$/i.test(resetId)) {
        toast.error("Invalid reset link format");
        setIsValidating(false);
        setTimeout(() => {
          router.push("/password/forgot");
        }, 3000);
        return;
      }

      try {
        // console.log("Validating reset ID:", resetId);
        const response = await fetch(
          `/api/password/verify-reset?id=${resetId}`
        );

        // console.log("Response status:", response.status);
        // console.log("Response headers:", response.headers.get("content-type"));

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("API returned non-JSON response (possibly 404)");
          const text = await response.text();
          console.error("Response text:", text.substring(0, 200));
          toast.error("API route not found. Check server logs.");
          setTimeout(() => {
            router.push("/password/forgot");
          }, 3000);
          setIsValidating(false);
          return;
        }

        const data = await response.json();
        // console.log("Validation response:", data);

        if (data.valid) {
          setIsValidLink(true);
        } else {
          toast.error(data.error || "Invalid or expired reset link");
          setTimeout(() => {
            router.push("/password/forgot");
          }, 3000);
        }
      } catch (error) {
        console.error("Validation error:", error);
        toast.error("Error validating reset link");
        setTimeout(() => {
          router.push("/password/forgot");
        }, 3000);
      } finally {
        setIsValidating(false);
      }
    };

    validateResetLink();
  }, [resetId, router]);

  const { isLoading, handleSubmit } = useGenericSubmitHandler(async (data) => {
    if (!resetId) {
      return toast.error("Invalid reset link");
    }

    const res = await resetPassword(
      resetId,
      data.newPassword,
      data.confirmPassword
    );

    if (res?.error) {
      return toast.error(res?.error?.message);
    }

    if (res?.passwordUpdated) {
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    }
  });

  // Loading state
  if (isValidating) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-default-500">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid link state
  if (!isValidLink) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="mdi:alert-circle" className="text-6xl text-danger" />
          <p className="text-xl font-medium">Invalid or Expired Reset Link</p>
          <p className="text-small text-default-500">
            Redirecting to forgot password page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Reset Password</p>
          <p className="text-small text-default-500">
            Enter your new password to reset
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                )}
              </button>
            }
            label="New Password"
            name="newPassword"
            placeholder="Enter your new password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            minLength={8}
            description="Must contain: uppercase, lowercase, number, special character"
          />

          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                )}
              </button>
            }
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            minLength={8}
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            endContent={<Icon icon="akar-icons:arrow-right" />}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Reset Password
          </Button>
        </Form>

        <div className="text-center">
          <Button
            variant="light"
            size="sm"
            onPress={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
