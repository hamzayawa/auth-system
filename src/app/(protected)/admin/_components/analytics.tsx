"use client";

import { motion } from "framer-motion";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const analyticsData = [
	{ month: "Jan", users: 400, revenue: 2400, engagement: 85 },
	{ month: "Feb", users: 520, revenue: 2800, engagement: 88 },
	{ month: "Mar", users: 680, revenue: 3200, engagement: 90 },
	{ month: "Apr", users: 840, revenue: 3800, engagement: 92 },
	{ month: "May", users: 920, revenue: 4200, engagement: 94 },
];

export default function Analytics() {
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="space-y-4"
		>
			<motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2,950</div>
						<p className="text-xs text-muted-foreground">
							+12% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$16,400</div>
						<p className="text-xs text-muted-foreground">+8% from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Engagement Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">94%</div>
						<p className="text-xs text-muted-foreground">+2% from last month</p>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader>
						<CardTitle>User Growth</CardTitle>
						<CardDescription>Monthly user growth over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={analyticsData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="users"
									stroke="hsl(var(--primary))"
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader>
						<CardTitle>Revenue & Engagement</CardTitle>
						<CardDescription>
							Monthly revenue and engagement metrics
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={analyticsData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis yAxisId="left" />
								<YAxis yAxisId="right" orientation="right" />
								<Tooltip />
								<Bar
									yAxisId="left"
									dataKey="revenue"
									fill="hsl(var(--primary))"
								/>
								<Bar
									yAxisId="right"
									dataKey="engagement"
									fill="hsl(var(--accent))"
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
}
