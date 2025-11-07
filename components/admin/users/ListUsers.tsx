"use client";

import { IUser } from "@/backend/config/models/user.model";
import {
  Avatar,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import Custompagination from "../../layout/pagination/pagination";
import UpdateUser from "./UpdateUser";

export const columns = [
  { name: "USER", uid: "user" },
  { name: "EMAIL", uid: "email" },
  { name: "SUBSCRIPTION", uid: "subscription" },
  { name: "JOINED", uid: "joined" },
  { name: "ACTIONS", uid: "actions" },
];

type ListUsersProps = {
  data: {
    users: IUser[];
    pagination: {
      currentPage: number;
      resultPerPage: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export default function ListUsers({ data }: ListUsersProps) {
  const { users, pagination } = data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const renderCell = React.useCallback(
    (user: IUser, columnKey: Key) => {
      const cellValue = user[columnKey as keyof IUser];
      const isHovered = hoveredRow === user._id.toString();

      switch (columnKey) {
        case "user":
          return (
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.profilePicture?.url || undefined}
                name={user?.name}
                size="sm"
                className={`transition-all duration-300 ${
                  isHovered ? "scale-110 ring-2 ring-emerald-500" : ""
                }`}
              />
              <div className="flex flex-col">
                <p
                  className={`font-bold text-sm transition-all duration-300 ${
                    isHovered ? "translate-x-2 text-emerald-600" : ""
                  }`}
                >
                  {user?.name}
                </p>
                <div className="flex gap-1 mt-1">
                  {user?.roles?.map((role) => (
                    <Chip
                      key={role}
                      size="sm"
                      variant="flat"
                      color={role === "admin" ? "danger" : "default"}
                      className="text-xs capitalize"
                    >
                      {role}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          );

        case "email":
          return (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
              <div className="flex items-center gap-1">
                {user?.emailVerified ? (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={
                      <Icon icon="solar:check-circle-bold" width={14} />
                    }
                    className="text-xs"
                  >
                    Verified
                  </Chip>
                ) : (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={
                      <Icon icon="solar:danger-circle-bold" width={14} />
                    }
                    className="text-xs"
                  >
                    Unverified
                  </Chip>
                )}
              </div>
            </div>
          );

        case "subscription":
          const status = user?.subscription?.status || "inactive";
          const isActive = status === "active";
          return (
            <div className="flex flex-col gap-1">
              <Chip
                className={`capitalize transition-all duration-300 ${
                  isHovered ? "scale-105 shadow-md" : ""
                }`}
                color={isActive ? "success" : "default"}
                size="sm"
                variant="flat"
                startContent={
                  <Icon
                    icon={
                      isActive
                        ? "solar:dollar-minimalistic-bold"
                        : "solar:close-circle-bold"
                    }
                    width={14}
                  />
                }
              >
                {status}
              </Chip>
              {isActive && user?.subscription?.currentPeriodEnd && (
                <p className="text-xs text-gray-500">
                  Until{" "}
                  {new Date(
                    user.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          );

        case "joined":
          return (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">
                {Math.floor(
                  (Date.now() - new Date(user?.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </p>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <UpdateUser user={user} />

              <Tooltip color="primary" content="View Profile">
                <span className="text-lg text-primary cursor-pointer transition-all duration-300 hover:scale-125 active:scale-90">
                  <Icon icon="solar:eye-broken" fontSize={21} />
                </span>
              </Tooltip>

              <Tooltip color="danger" content="Delete User">
                <span className="text-lg text-danger cursor-pointer transition-all duration-300 hover:scale-125 active:scale-90">
                  <Icon icon="solar:trash-bin-trash-outline" fontSize={21} />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [hoveredRow, router]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const handleSubscriptionFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value === "all") {
      params.delete("subscription.status");
    } else {
      params.set("subscription.status", value);
    }

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const handleEmailFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value === "all") {
      params.delete("emailVerified");
    } else {
      params.set("emailVerified", value);
    }

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limit", value);

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const [sortField, sortOrder] = value.split(":");
    params.set("sort", sortField);
    params.set("order", sortOrder);

    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const getCurrentSort = () => {
    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";
    return `${sortField}:${sortOrder}`;
  };

  return (
    <div
      className={`my-4 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onValueChange={handleSearch}
          startContent={
            <Icon icon="solar:magnifer-linear" className="text-default-400" />
          }
          isClearable
          onClear={() => handleSearch("")}
          className="max-w-md"
          variant="bordered"
          color="success"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <div className="text-sm text-default-500">
            Showing{" "}
            <span className="font-semibold text-emerald-600">
              {users.length > 0
                ? (pagination.currentPage - 1) * pagination.resultPerPage + 1
                : 0}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-emerald-600">
              {Math.min(
                pagination.currentPage * pagination.resultPerPage,
                pagination.totalCount
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-emerald-600">
              {pagination.totalCount}
            </span>{" "}
            users
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-default-600 font-medium">
              Sort:
            </label>
            <Select
              size="sm"
              className="w-40"
              selectedKeys={[getCurrentSort()]}
              onChange={(e) => handleSortChange(e.target.value)}
              isDisabled={isPending}
              variant="bordered"
              color="success"
            >
              <SelectItem key="createdAt:desc">Newest First</SelectItem>
              <SelectItem key="createdAt:asc">Oldest First</SelectItem>
              <SelectItem key="name:asc">Name (A-Z)</SelectItem>
              <SelectItem key="name:desc">Name (Z-A)</SelectItem>
              <SelectItem key="email:asc">Email (A-Z)</SelectItem>
              <SelectItem key="email:desc">Email (Z-A)</SelectItem>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-default-600 font-medium">
              Subscription:
            </label>
            <Select
              size="sm"
              className="w-32"
              selectedKeys={[searchParams.get("subscription.status") || "all"]}
              onChange={(e) => handleSubscriptionFilter(e.target.value)}
              isDisabled={isPending}
              variant="bordered"
              color="success"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-default-600 font-medium">
              Email:
            </label>
            <Select
              size="sm"
              className="w-32"
              selectedKeys={[searchParams.get("emailVerified") || "all"]}
              onChange={(e) => handleEmailFilter(e.target.value)}
              isDisabled={isPending}
              variant="bordered"
              color="success"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="true">Verified</SelectItem>
              <SelectItem key="false">Unverified</SelectItem>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-default-600 font-medium">
              Per page:
            </label>
            <Select
              size="sm"
              className="w-20"
              selectedKeys={[searchParams.get("limit") || "10"]}
              onChange={(e) => handleLimitChange(e.target.value)}
              isDisabled={isPending}
              variant="bordered"
              color="success"
            >
              <SelectItem key="5">5</SelectItem>
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Users Table"
        className="transition-all duration-300"
        classNames={{
          wrapper:
            "shadow-xl rounded-lg border-2 border-emerald-100 dark:border-emerald-900",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              className="bg-emerald-50 dark:bg-emerald-950/20"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={users}
          emptyContent={
            <div className="py-10">
              <Icon
                icon="solar:users-group-rounded-broken"
                fontSize={48}
                className="text-default-300 mx-auto mb-3"
              />
              <p className="text-default-500">No users found</p>
            </div>
          }
        >
          {(item) => (
            <TableRow
              key={item._id.toString()}
              className="transition-all duration-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 cursor-pointer"
              onMouseEnter={() => setHoveredRow(item._id.toString())}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <Custompagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        </div>
      )}
    </div>
  );
}
