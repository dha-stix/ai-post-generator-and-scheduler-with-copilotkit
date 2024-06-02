export const tableHeadings: string[] = [
	"Time",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const availableSchedule: AvailableScheduleItem[] = [
	{
		time: 0,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 1,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 2,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 3,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 4,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 5,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 6,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 7,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 8,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 9,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 10,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 11,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 12,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 13,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 14,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 15,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 16,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 17,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 18,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 19,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 20,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 21,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 22,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 23,
		schedule: [[], [], [], [], [], [], []],
	},
];

export const formatTime = (value: number) => {
	if (value === 0) {
		return `Midnight`;
	} else if (value < 10) {
		return `${value}am`;
	} else if (value >= 10 && value < 12) {
		return `${value}am`;
	} else if (value === 12) {
		return `${value}noon`;
	} else {
		return `${value % 12}pm`;
	}
};

export const getNextDayOfWeek = (
	dayOfWeek: number,
	hours: number,
	minutes: number
) => {
	var today = new Date();
	var daysUntilNextDay = dayOfWeek - today.getDay();
	if (daysUntilNextDay < 0) {
		daysUntilNextDay += 7;
	}
	today.setDate(today.getDate() + daysUntilNextDay);
	today.setHours(hours);
	today.setMinutes(minutes);
	return today;
};

export const convertToHour = (timestamp: Date) => {
	const date = new Date(timestamp);
	return {
		day: date.getUTCDate(),
		hour: date.getUTCHours() + 1,
		minutes: date.getUTCMinutes(),
	};
};

export const getTwitterOauthUrl = () => {
	const rootUrl = "https://twitter.com/i/oauth2/authorize";
	const options = {
		redirect_uri: "http://www.localhost:3000/dashboard",
		client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
		state: "state",
		response_type: "code",
		code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
		code_challenge_method: "S256",
		scope: ["users.read", "tweet.read", "tweet.write"].join(" "),
	};
	const qs = new URLSearchParams(options).toString();
	console.log(`${rootUrl}?${qs}`);
	return `${rootUrl}?${qs}`;
};