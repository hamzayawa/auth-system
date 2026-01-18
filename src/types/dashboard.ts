export interface MetricCard {
	title: string;
	value: string;
	change: number;
	timeFrame: string;
}

export interface ChartData {
	month: string;
	orders: number;
	earnings: number;
	refunds: number;
}

export interface Order {
	purchaseId: string;
	customerName: string;
	productName: string;
	amount: string;
	orderDate: string;
	vendor: string;
	status: "completed" | "pending" | "failed";
}
