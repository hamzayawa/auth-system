"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ChartData } from "@/types/dashboard";

const data: ChartData[] = [
	{ month: "Jan", orders: 400, earnings: 240, refunds: 20 },
	{ month: "Feb", orders: 300, earnings: 290, refunds: 15 },
	{ month: "Mar", orders: 200, earnings: 190, refunds: 10 },
	{ month: "Apr", orders: 278, earnings: 390, refunds: 12 },
	{ month: "May", orders: 189, earnings: 290, refunds: 8 },
	{ month: "Jun", orders: 239, earnings: 390, refunds: 15 },
	{ month: "Jul", orders: 349, earnings: 290, refunds: 20 },
	{ month: "Aug", orders: 249, earnings: 140, refunds: 10 },
	{ month: "Sep", orders: 289, earnings: 340, refunds: 15 },
	{ month: "Oct", orders: 349, earnings: 440, refunds: 20 },
	{ month: "Nov", orders: 449, earnings: 380, refunds: 25 },
	{ month: "Dec", orders: 509, earnings: 480, refunds: 30 },
];

export function RevenueChart() {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Revenue</CardTitle>
				<CardDescription>Monthly revenue statistics</CardDescription>
			</CardHeader>
			<CardContent className="h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<XAxis
							dataKey="month"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip />
						<Line
							type="monotone"
							dataKey="orders"
							stroke="#8884d8"
							strokeWidth={2}
						/>
						<Line
							type="monotone"
							dataKey="earnings"
							stroke="#82ca9d"
							strokeWidth={2}
						/>
						<Line
							type="monotone"
							dataKey="refunds"
							stroke="#ffc658"
							strokeWidth={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
