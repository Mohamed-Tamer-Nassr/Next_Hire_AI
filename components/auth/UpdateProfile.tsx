"use client";

import { updateProfile } from "@/actions/auth.actions";
import { IUser } from "@/backend/config/models/user.model";
import { Avatar, Button, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import Loader from "../layout/loader/loader";

export default function UpdateProfile() {
  const { data: userData, update } = useSession() as {
    data: { user: IUser } | null;
    update: () => Promise<any>;
  };
  const [avatar, setAvatar] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const file = files[0];

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError("File size must be less than 5MB");
      setAvatar("");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Only JPEG, PNG, and WebP images are allowed");
      setAvatar("");
      return;
    }

    setAvatarError("");

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result as string);
      }
    };
    reader.onerror = () => {
      setAvatarError("Failed to read file");
      setAvatar("");
    };
    reader.readAsDataURL(file);
  };

  const router = useRouter();

  const { isLoading, handleSubmit } = useGenericSubmitHandler(async (data) => {
    try {
      const bodyData = {
        name: data.name,
        email: userData?.user?.email ?? "",
        avatar: avatar || undefined,
        oldAvatar: userData?.user?.profilePicture?.id,
      };

      const res = await updateProfile(bodyData);

      if (res?.error) {
        return toast.error(res?.error?.message || "Failed to update profile");
      }

      if (res?.updated) {
        try {
          await update();
          toast.success("Profile updated successfully");
          setAvatar("");
        } catch (sessionError) {
          console.error("Session update failed:", sessionError);
          toast.error(
            "Profile updated but session refresh failed. Please refresh the page."
          );
        }
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  });

  if (userData === undefined) {
    return <Loader />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div
        className={`flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        <div
          className={`flex flex-col gap-1 transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <h1 className="text-large font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Update Profile
          </h1>
          <p className="text-small text-default-500">
            Enter details to update profile
          </p>
        </div>

        <Form
          className="flex flex-col gap-5"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <div
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <Input
              isRequired
              label="Name"
              name="name"
              placeholder="Enter your name"
              type="text"
              variant="bordered"
              defaultValue={userData?.user?.name || ""}
              minLength={2}
              maxLength={50}
              classNames={{
                input: "transition-all duration-300",
                inputWrapper:
                  "transition-all duration-300 hover:border-primary/50 focus-within:scale-[1.01]",
              }}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={userData?.user?.email || ""}
              isDisabled
              description="Email cannot be changed"
              classNames={{
                input: "transition-all duration-300",
                inputWrapper: "transition-all duration-300",
              }}
            />
          </div>

          <div
            className={`flex flex-col gap-2 transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex gap-3 items-center">
              <div
                className="relative group"
                onMouseEnter={() => setAvatarHovered(true)}
                onMouseLeave={() => setAvatarHovered(false)}
              >
                <Avatar
                  showFallback
                  src={
                    avatar || userData?.user?.profilePicture?.url || undefined
                  }
                  size="lg"
                  radius="sm"
                  name={userData?.user?.name}
                  className={`transition-all duration-300 ${
                    avatarHovered
                      ? "scale-110 shadow-lg ring-2 ring-primary/50"
                      : ""
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-black/40 rounded-sm flex items-center justify-center transition-all duration-300 ${
                    avatarHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Icon
                    icon="solar:camera-bold"
                    className="text-white text-xl"
                  />
                </div>
              </div>
              <Input
                label="Avatar"
                name="avatar"
                type="file"
                variant="bordered"
                onChange={onChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                isInvalid={!!avatarError}
                errorMessage={avatarError}
                description="Max 5MB. JPEG, PNG, or WebP"
                classNames={{
                  input: "transition-all duration-300",
                  inputWrapper:
                    "transition-all duration-300 hover:border-primary/50",
                }}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms" }}
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
              isDisabled={isLoading || !!avatarError}
              isLoading={isLoading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative">Update Profile</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
