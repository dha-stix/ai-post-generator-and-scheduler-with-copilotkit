import data from "./user.json";
import { Worker, Queue } from 'bullmq';
import Redis from "ioredis";

const redis = new Redis({maxRetriesPerRequest: null});
const scheduleQueue = new Queue('schedule-queue', { connection: redis });

//👇🏻 add jobs to the queue
export const scheduleJobs = async (schedule: AvailableScheduleItem[]) => {
	//👇🏻 gets current time and day
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	const currentDay = now.getDay();

	//👇🏻 gets posts for the current hour
	const currentSchedule = schedule.find((item) => item.time === currentHour);
	const schedulesForTheHour = currentSchedule?.schedule[currentDay];

	//👇🏻 gets scheduled posts for the current time
	if (schedulesForTheHour && schedulesForTheHour?.length > 0) {
		const awaitingJobs = schedulesForTheHour.filter(
			(scheduleItem) =>
				scheduleItem.minutes && scheduleItem.minutes <= currentMinute
		);

		//👇🏻 add jobs to queue
		return awaitingJobs.map(async (scheduleItem) => {
			const job = await scheduleQueue.add("jobs", {
				message: scheduleItem.content
			}, {
				removeOnComplete: true,
			});
			console.log(`Job ${job.id} added to queue`);
		});
	}
};

//👇🏻 processing jobs
const scheduleWorker = new Worker('schedule-queue', async (job) => {
  console.log(`Processing job ${job.id} of type ${job.name} with data: ${job.data.message}`)
	console.log("Posting content...")

	//👇🏻 post content to X
	const postTweet = await fetch("https://api.twitter.com/2/tweets", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
			Authorization: `Bearer ${data.accessToken}`,
		},
		body: JSON.stringify({ text: job.data.message })
	});
	if (postTweet.ok) { 
		  console.log("Content posted!")
	}
}, { connection: redis})

//👇🏻 listening for completed job
scheduleWorker.on('completed', job => {
	console.log(`${job.id} has completed!`);
});

