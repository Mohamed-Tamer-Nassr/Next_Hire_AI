"use client";
import { updatePassword } from "@/actions/auth.actions";
import { Button, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";

export default function UpdatePassword() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const router = useRouter();

  const { data: sessionData, update } = useSession();

  useEffect(() => {
    setIsFormVisible(true);
  }, []);

  const { isLoading, handleSubmit } = useGenericSubmitHandler(
    async (formData) => {
      const bodyData = {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        userEmail: sessionData?.user?.email || "",
      };

      const res = await updatePassword(bodyData);

      if (res?.error) {
        return toast.error(res?.error?.message || "Failed to update password");
      }
      if (res?.updated) {
        await update();
        router.push("/app/dashboard");
        return toast.success("Password Updated successfully");
      }
    }
  );

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div
        className={`flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small transition-all duration-700 ease-out ${
          isFormVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        <div
          className={`flex flex-col gap-1 transition-all duration-500 ease-out ${
            isFormVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          }`}
        >
          <h1 className="text-large font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Update Password
          </h1>
          <p className="text-small text-default-500">
            Enter new passwords to update
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <div
            className={`transition-all duration-500 ease-out ${
              isFormVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <Input
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="transition-all duration-300 hover:scale-110 active:scale-90"
                >
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400 transition-all duration-300"
                      icon="solar:eye-bold"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400 transition-all duration-300"
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
              classNames={{
                input: "transition-all duration-300",
                inputWrapper:
                  "transition-all duration-300 hover:border-primary/50 focus-within:scale-[1.01]",
              }}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              isFormVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Input
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="transition-all duration-300 hover:scale-110 active:scale-90"
                >
                  {isConfirmVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400 transition-all duration-300"
                      icon="solar:eye-bold"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400 transition-all duration-300"
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
              classNames={{
                input: "transition-all duration-300",
                inputWrapper:
                  "transition-all duration-300 hover:border-primary/50 focus-within:scale-[1.01]",
              }}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              isFormVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Button
              className="w-full relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              color="primary"
              type="submit"
              endContent={
                <Icon
                  icon="akar-icons:arrow-right"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              }
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative">Update</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
