"use client";

import { DollarSign, Package, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminPermission } from "@/hooks/use-admin-permission";
import { Metric } from "./_components/metric-card";
import { RecentOrders } from "./_components/recent-orders";
import { RevenueChart } from "./_components/revenue-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();

  // Use shared admin hook
  const { isAdmin, isLoading, session } = useAdminPermission({
    redirectTo: "/unauthorized", // or leave undefined if you only want to gate UI
  });

  /** Redirect unauthenticated users to sign in */
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/signin");
    }
  }, [isLoading, session, router]);

  /** While loading or redirecting, render loading state */
  if (isLoading || !session) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <Select defaultValue="ALL">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Time</SelectItem>
            <SelectItem value="1M">Last Month</SelectItem>
            <SelectItem value="6M">Last 6 Months</SelectItem>
            <SelectItem value="1Y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Metric
            title="TOTAL EARNINGS"
            value="$745.35"
            change={18.3}
            timeFrame="last week"
            icon={DollarSign}
            iconColor="text-green-500"
          />
        </motion.div>

        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Metric
            title="ORDERS"
            value="698.36k"
            change={-2.74}
            timeFrame="last week"
            icon={Package}
            iconColor="text-blue-500"
          />
        </motion.div>

        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Metric
            title="CUSTOMERS"
            value="183.35M"
            change={29.08}
            timeFrame="last week"
            icon={Users}
            iconColor="text-yellow-500"
          />
        </motion.div>

        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Need More Sales?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upgrade to pro for added benefits.
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline">
                Upgrade Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <RevenueChart />

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin-only UI example */}
      {isAdmin && (
        <div className="mt-4 rounded-lg border p-4">
          <p className="text-sm font-medium">Admin Controls Enabled</p>
        </div>
      )}
    </div>
  );
}
