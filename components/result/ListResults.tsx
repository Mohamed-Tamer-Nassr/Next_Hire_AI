"use client";
import { IInterview } from "@/backend/config/models/interview.model";
import { calculateAverageScore } from "@/helper/helpers";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import Custompagination from "../layout/pagination/pagination";

type Props = {
  data: {
    interviews: IInterview[];
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

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

function ListResults({ data }: Props) {
  const { interviews, pagination } = data;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview];
      const isHovered = hoveredRow === interview._id.toString();

      switch (columnKey) {
        case "interview":
          return (
            <div className="flex flex-col gap-1">
              <p
                className={`font-bold text-sm capitalize transition-all duration-300 ${
                  isHovered ? "translate-x-2 text-primary" : ""
                }`}
              >
                {interview?.topic}
              </p>
              <p className="font-bold text-sm capitalize text-default-400 transition-all duration-300">
                {interview?.type}
              </p>
            </div>
          );
        case "result":
          const score = calculateAverageScore(interview?.questions);
          const scoreColor =
            +score >= 7
              ? "text-success"
              : +score >= 5
              ? "text-warning"
              : "text-danger";

          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p
                  className={`font-bold text-sm capitalize transition-all duration-300 ${scoreColor} ${
                    isHovered ? "scale-110" : ""
                  }`}
                >
                  {score} / 10
                </p>
                {+score >= 7 && (
                  <Icon
                    icon="solar:cup-star-bold"
                    className={`text-success transition-all duration-300 ${
                      isHovered ? "animate-bounce" : ""
                    }`}
                  />
                )}
              </div>
              <p className="font-bold text-sm capitalize text-default-400">
                {interview?.numOfQuestion} questions
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className={`capitalize transition-all duration-300 ${
                isHovered ? "scale-105 shadow-md" : ""
              }`}
              color={interview?.status === "completed" ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return interview?.status === "completed" ? (
            <Button
              className="bg-foreground font-bold text-background w-full relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              color="secondary"
              endContent={
                <Icon
                  icon="solar:arrow-right-linear"
                  fontSize={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              }
              variant="flat"
              as={Link}
              href={`/app/results/${interview._id}`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative">View Results</span>
            </Button>
          ) : (
            <div className="relative group">
              <p className="font-bold text-sm capitalize text-default-400 transition-all duration-300 group-hover:text-default-500">
                Complete interview to view your results
              </p>
              <Icon
                icon="solar:lock-keyhole-minimalistic-outline"
                className="absolute -right-6 top-1/2 -translate-y-1/2 text-default-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [hoveredRow]
  );

  const handleChangeStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    const path = `${window.location.pathname}?${params.toString()}`;
    startTransition(() => {
      router.push(path);
    });
  };

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limit", value);

    const path = `${window.location.pathname}?${params.toString()}`;
    startTransition(() => {
      router.push(path);
    });
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    const [sortField, sortOrder] = value.split(":");
    params.set("sort", sortField);
    params.set("order", sortOrder);

    const path = `${window.location.pathname}?${params.toString()}`;
    startTransition(() => {
      router.push(path);
    });
  };

  const getCurrentSort = () => {
    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";
    return `${sortField}:${sortOrder}`;
  };

  const showEmptyState = interviews.length === 0 && pagination.currentPage > 1;

  return (
    <div
      className={`my-4 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="text-sm text-default-500 transition-all duration-300 hover:text-default-700">
          Showing{" "}
          <span className="font-semibold text-primary">
            {interviews.length > 0
              ? (pagination.currentPage - 1) * pagination.resultPerPage + 1
              : 0}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-primary">
            {Math.min(
              pagination.currentPage * pagination.resultPerPage,
              pagination.totalCount
            )}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-primary">
            {pagination.totalCount}
          </span>{" "}
          results
        </div>

        <div className="flex flex-wrap gap-4 w-full sm:w-auto items-center">
          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <label className="text-sm text-default-600 whitespace-nowrap font-medium">
              Sort by:
            </label>
            <Select
              size="sm"
              className="w-40 transition-all duration-300 hover:scale-105"
              aria-label="Sort by"
              selectedKeys={[getCurrentSort()]}
              onChange={(event) => handleSortChange(event.target.value)}
              isDisabled={isPending}
            >
              <SelectItem key="createdAt:desc">Newest First</SelectItem>
              <SelectItem key="createdAt:asc">Oldest First</SelectItem>
              <SelectItem key="topic:asc">Topic (A-Z)</SelectItem>
              <SelectItem key="topic:desc">Topic (Z-A)</SelectItem>
              <SelectItem key="status:asc">Status (A-Z)</SelectItem>
              <SelectItem key="status:desc">Status (Z-A)</SelectItem>
              <SelectItem key="numOfQuestion:asc">
                Questions (Low-High)
              </SelectItem>
              <SelectItem key="numOfQuestion:desc">
                Questions (High-Low)
              </SelectItem>
            </Select>
          </div>

          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <label className="text-sm text-default-600 whitespace-nowrap font-medium">
              Items per page:
            </label>
            <Select
              size="sm"
              className="w-20 transition-all duration-300 hover:scale-105"
              aria-label="Items per page"
              selectedKeys={[searchParams.get("limit") || "10"]}
              onChange={(event) => handleLimitChange(event.target.value)}
              isDisabled={isPending}
            >
              <SelectItem key="3">3</SelectItem>
              <SelectItem key="5">5</SelectItem>
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
          </div>

          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <label className="text-sm text-default-600 whitespace-nowrap font-medium">
              Filter by status:
            </label>
            <Select
              size="sm"
              className="w-32 transition-all duration-300 hover:scale-105"
              aria-label="Filter by status"
              selectedKeys={[searchParams.get("status") || "all"]}
              onChange={(event) => handleChangeStatus(event.target.value)}
              isDisabled={isPending}
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {showEmptyState ? (
        <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4">
            <Icon
              icon="solar:document-text-outline"
              fontSize={64}
              className="text-default-300 mx-auto animate-pulse"
            />
          </div>
          <p className="text-default-500 text-lg mb-2">
            No results found on this page.
          </p>
          <p className="text-default-400 text-sm mb-6">
            Try going back to the first page
          </p>
          <Button
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden group"
            color="primary"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", "1");
              router.push(`${window.location.pathname}?${params.toString()}`);
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">Go to First Page</span>
          </Button>
        </div>
      ) : (
        <>
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Table
              aria-label="Results Table"
              className="transition-all duration-300"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    className="transition-all duration-300 hover:bg-default-100"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={interviews}
                emptyContent={
                  <div className="py-10 animate-in fade-in duration-500">
                    <Icon
                      icon="solar:clipboard-list-outline"
                      fontSize={48}
                      className="text-default-300 mx-auto mb-3"
                    />
                    <p className="text-default-500">No results found</p>
                  </div>
                }
              >
                {(item) => (
                  <TableRow
                    key={item._id.toString()}
                    className="transition-all duration-300 hover:bg-default-50 hover:shadow-sm cursor-pointer border-b border-transparent hover:border-default-200"
                    onMouseEnter={() => setHoveredRow(item._id.toString())}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {(columnKey) => (
                      <TableCell className="transition-all duration-300">
                        {renderCell(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div
              className={`flex justify-center items-center mt-10 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Custompagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListResults;
