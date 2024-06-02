 interface DelSelectedCell {
	content?: string;
	day_id?: number;
	day?: string;
	time_id?: number;
	time?: string;
	published?: boolean;
	minutes?: number;
}
 interface SelectedCell {
	day_id?: number;
	day?: string;
	time_id?: number;
	time?: string;
	minutes?: number;
}

 interface Content {
	minutes?: number;
	content?: string;
	published?: boolean;
	day?: number;
}

interface  AvailableScheduleItem {
	time: number;
	schedule: Content[][];
}