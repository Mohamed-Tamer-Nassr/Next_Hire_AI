"use client";

import { forgotPassword } from "@/actions/auth.actions";
import { Logo } from "@/config/logoSite";
import { Button, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";

export default function ForgotPassword() {
  const router = useRouter(); // ✅ Move it here

  const { isLoading, handleSubmit } = useGenericSubmitHandler(async (data) => {
    const email = data.email;
    const res = await forgotPassword(email);

    if (res?.error) {
      return toast.error(res?.error?.message || "Something went wrong");
    }

    if (res?.emailSent) {
      if (res?.userExists === false) {
        return toast.error("No account found with this email address");
      }

      toast.success("Password reset link sent to your email");
      // router.push("/login"); // uncomment if you want redirect
      return;
    }

    return toast.error("Something went wrong. Please try again.");
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Forgot Password</p>
          <p className="text-small text-default-500">
            Enter your email to reset your password
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            classNames={{
              base: "-mb-[2px]",
              inputWrapper:
                "rounded-none data-[hover=true]:z-10 group-data-[focus-visible=true]:z-10",
            }}
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
            disabled={isLoading}
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </Form>
      </div>
    </div>
  );
}
