"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/types/dashboard";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "purchaseId",
    header: "Purchase ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {status}
        </div>
      );
    },
  },
];

const data: Order[] = [
  {
    purchaseId: "#VZ2112",
    customerName: "Alex Smith",
    productName: "Clothes",
    amount: "$109.00",
    orderDate: "02 Jan, 2024",
    vendor: "Zoetic Fashion",
    status: "completed",
  },
  {
    purchaseId: "#VZ2111",
    customerName: "Jansh Brown",
    productName: "Kitchen Storage",
    amount: "$149.00",
    orderDate: "02 Jan, 2024",
    vendor: "Micro Design",
    status: "pending",
  },
  {
    purchaseId: "#VZ2109",
    customerName: "Ayaan Bowen",
    productName: "Bike Accessories",
    amount: "$215.00",
    orderDate: "01 Jan, 2024",
    vendor: "Nesta Technologies",
    status: "failed",
  },
];

export function RecentOrders() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              variants={rowVariants}
              initial="hidden"
              animate="show"
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                transition: { duration: 0.2 },
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
