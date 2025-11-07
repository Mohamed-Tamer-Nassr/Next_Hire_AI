"use client";

import {
  Button,
  Card,
  CardBody,
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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Stripe from "stripe";

export const columns = [
  { name: "INVOICE", uid: "invoice" },
  { name: "AMOUNT PAID", uid: "amount" },
  { name: "BILLING DATE", uid: "date" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Open", value: "open" },
  { label: "Draft", value: "draft" },
  { label: "Void", value: "void" },
];

type Props = {
  invoices: Stripe.Invoice[];
};

function ListInvoices({ invoices }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Calculate total amount
  const totalAmount = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) => sum + invoice.amount_paid / 100,
      0
    );
  }, [invoices]);

  // ✅ Filter invoices
  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Filter by search (invoice number or ID)
    if (filterValue) {
      filtered = filtered.filter((invoice) =>
        (invoice.number?.toLowerCase() || invoice.id.toLowerCase()).includes(
          filterValue.toLowerCase()
        )
      );
    }

    return filtered;
  }, [invoices, statusFilter, filterValue]);

  // ✅ Handle empty state
  if (!invoices || invoices.length === 0) {
    return (
      <Card className="w-full mt-3">
        <CardBody>
          <div className="flex flex-col items-center justify-center py-12">
            <Icon
              icon="solar:bill-list-bold-duotone"
              className="text-default-300 mb-4"
              width={80}
            />
            <p className="text-lg font-semibold mb-2">No Invoices Found</p>
            <p className="text-sm text-default-500 text-center max-w-md">
              Your invoice history will appear here once you have an active
              subscription
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const renderCell = React.useCallback(
    (invoice: Stripe.Invoice, columnKey: Key) => {
      switch (columnKey) {
        case "invoice":
          return (
            <div className="flex flex-col">
              <p className="font-bold text-sm">
                {invoice?.account_name || "Next Hire AI"}
              </p>
              <p className="text-xs text-default-400">
                {invoice?.number || invoice?.id.substring(0, 20)}
              </p>
            </div>
          );

        case "amount":
          return (
            <div className="flex flex-col">
              <p className="font-semibold text-sm">
                ${(invoice?.amount_paid / 100).toFixed(2)}
              </p>
              {invoice.amount_due !== invoice.amount_paid && (
                <p className="text-xs text-default-400">
                  Due: ${(invoice?.amount_due / 100).toFixed(2)}
                </p>
              )}
            </div>
          );

        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-sm">
                {invoice?.created
                  ? new Date(invoice.created * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
              {invoice?.period_end && (
                <p className="text-xs text-default-400">
                  Period:{" "}
                  {new Date(invoice.period_end * 1000).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </p>
              )}
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={
                invoice.status === "paid"
                  ? "success"
                  : invoice.status === "open"
                  ? "warning"
                  : invoice.status === "draft"
                  ? "default"
                  : "danger"
              }
              size="sm"
              variant="dot"
            >
              {invoice.status}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              {invoice?.invoice_pdf ? (
                <Button
                  className="bg-foreground font-medium text-background"
                  color="secondary"
                  size="sm"
                  endContent={
                    <Icon icon="solar:download-linear" fontSize={18} />
                  }
                  variant="flat"
                  as={Link}
                  href={invoice.invoice_pdf}
                  target="_blank"
                >
                  Download
                </Button>
              ) : (
                <Button size="sm" variant="flat" isDisabled>
                  Not Available
                </Button>
              )}
            </div>
          );

        default:
          return null;
      }
    },
    []
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-3">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Invoice History</h2>
            <p className="text-sm text-default-500 mt-1">
              {filteredInvoices.length} of {invoices.length} invoice
              {invoices.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Card className="w-full sm:w-auto">
            <CardBody className="py-3 px-4">
              <p className="text-tiny text-default-500">Total Paid</p>
              <p className="text-2xl font-bold text-success">
                ${totalAmount.toFixed(2)}
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by invoice number..."
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <Select
            className="w-full sm:max-w-xs"
            placeholder="Filter by status"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    invoices.length,
    filteredInvoices.length,
    totalAmount,
  ]);

  return (
    <div className="w-full mt-2">
      {topContent}

      <div className="mt-6">
        <Table
          aria-label="Invoices Table"
          classNames={{
            wrapper: "shadow-md",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={filteredInvoices}
            emptyContent="No invoices match the selected filters"
          >
            {(invoice) => (
              <TableRow key={invoice.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(invoice, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ListInvoices;
