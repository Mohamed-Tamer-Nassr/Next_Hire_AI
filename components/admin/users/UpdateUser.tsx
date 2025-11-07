"use client";

import { updateUserByAdmin } from "@/actions/auth.actions";
import { IUser } from "@/backend/config/models/user.model";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface UpdateUserProps {
  user: IUser;
}

export default function UpdateUser({ user }: UpdateUserProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles || ["user"]
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    user.subscription?.status || "inactive"
  );
  const [avatar, setAvatar] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.profilePicture?.url || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = ["user", "admin", "moderator"];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("User must have at least one role");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserByAdmin(user._id.toString(), {
        name: name.trim(),
        roles: selectedRoles,
        avatar: avatar || undefined,
        subscriptionStatus,
      });

      if (result.updated) {
        toast.success("User updated successfully!");
        router.refresh();
        onClose();
      } else {
        throw new Error("Update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(user.name);
    setSelectedRoles(user.roles || ["user"]);
    setSubscriptionStatus(user.subscription?.status || "inactive");
    setAvatar("");
    setAvatarPreview(user.profilePicture?.url || "");
  };

  return (
    <>
      <Tooltip color="secondary" content="Edit user">
        <span className="text-lg text-secondary cursor-pointer transition-all duration-300 hover:scale-125 active:scale-90">
          <Icon icon="tabler:user-edit" fontSize={21} onClick={onOpen} />
        </span>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        onClose={resetForm}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-emerald-900/50 to-emerald-900/10 backdrop-blur-sm",
          base: "border-2 border-emerald-200 dark:border-emerald-800 w-[850px] max-w-[95vw] max-h-[75vh] rounded-2xl",
          header: "border-b border-emerald-200 dark:border-emerald-800 py-3",
          body: "py-4 px-8 overflow-y-auto",
          footer: "border-t border-emerald-200 dark:border-emerald-800 py-3",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                    <Icon
                      icon="solar:user-edit-linear"
                      className="text-white"
                      width={20}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Update User</h3>
                    <p className="text-xs text-gray-500 font-normal">
                      Editing: {user.email}
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* LEFT COLUMN */}
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Profile Picture
                      </label>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-300 dark:border-emerald-700 shrink-0">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="w-full sm:flex-1 text-center sm:text-left">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
                          >
                            <Icon icon="solar:upload-linear" width={18} />
                            Choose Image
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5MB. JPG, PNG, GIF
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Info Card */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        User Information
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            User ID:
                          </span>
                          <span className="ml-2 font-mono font-semibold text-gray-900 dark:text-white">
                            {user._id.toString().slice(0, 12)}...
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            Joined:
                          </span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500 dark:text-gray-400">
                            Email Status:
                          </span>
                          <Chip
                            size="sm"
                            color={user.emailVerified ? "success" : "warning"}
                            variant="flat"
                          >
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500 dark:text-gray-400">
                            Current Plan:
                          </span>
                          <Chip
                            size="sm"
                            color={
                              subscriptionStatus === "active"
                                ? "success"
                                : "default"
                            }
                            variant="flat"
                          >
                            {subscriptionStatus}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-6">
                    <Input
                      label="Full Name"
                      placeholder="Enter user's full name"
                      variant="bordered"
                      color="success"
                      value={name}
                      onValueChange={setName}
                      isRequired
                      startContent={
                        <Icon
                          icon="solar:user-linear"
                          className="text-gray-400"
                          width={20}
                        />
                      }
                      classNames={{
                        input: "font-medium",
                        label: "font-semibold",
                      }}
                    />

                    <Input
                      label="Email Address"
                      placeholder="user@example.com"
                      variant="bordered"
                      value={user.email}
                      isDisabled
                      startContent={
                        <Icon
                          icon="solar:letter-linear"
                          className="text-gray-400"
                          width={20}
                        />
                      }
                      description="Email cannot be changed"
                      classNames={{
                        input: "font-medium",
                        label: "font-semibold",
                      }}
                    />

                    {/* Roles */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        User Roles
                      </label>
                      <CheckboxGroup
                        color="success"
                        value={selectedRoles}
                        onValueChange={setSelectedRoles}
                        classNames={{
                          wrapper:
                            "flex flex-col sm:flex-row sm:flex-wrap gap-3",
                        }}
                      >
                        {availableRoles.map((role) => (
                          <Checkbox
                            key={role}
                            value={role}
                            classNames={{
                              label: "capitalize font-medium",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="capitalize">{role}</span>
                              {role === "admin" && (
                                <Chip size="sm" color="danger" variant="flat">
                                  Full Access
                                </Chip>
                              )}
                              {role === "moderator" && (
                                <Chip size="sm" color="warning" variant="flat">
                                  Limited
                                </Chip>
                              )}
                            </div>
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>

                    {/* Subscription */}
                    <Select
                      label="Subscription Status"
                      placeholder="Select status"
                      variant="bordered"
                      color="success"
                      selectedKeys={[subscriptionStatus]}
                      onChange={(e) => setSubscriptionStatus(e.target.value)}
                      startContent={
                        <Icon
                          icon="solar:dollar-minimalistic-linear"
                          className="text-gray-400"
                          width={20}
                        />
                      }
                      classNames={{
                        label: "font-semibold",
                        value: "font-medium capitalize",
                      }}
                    >
                      <SelectItem key="active">Active</SelectItem>
                      <SelectItem key="inactive">Inactive</SelectItem>
                      <SelectItem key="cancelled">Cancelled</SelectItem>
                      <SelectItem key="trialing">Trialing</SelectItem>
                    </Select>

                    {/* Admin Warning */}
                    {selectedRoles.includes("admin") && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                        <Icon
                          icon="solar:danger-triangle-bold"
                          className="text-red-500 flex-shrink-0 mt-0.5"
                          width={20}
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-red-700 dark:text-red-400">
                            Admin Access Warning
                          </p>
                          <p className="text-red-600 dark:text-red-500">
                            This user will have full access to all admin
                            features including user management and system
                            settings.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  startContent={
                    <Icon icon="solar:close-circle-linear" width={20} />
                  }
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg"
                  startContent={
                    !isLoading && (
                      <Icon icon="solar:check-circle-linear" width={20} />
                    )
                  }
                  isDisabled={selectedRoles.length === 0 || !name.trim()}
                >
                  {isLoading ? "Updating..." : "Update User"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
