"use client";
import App from "@/app/components/App";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { availableSchedule } from "../util";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const [yourSchedule, updateYourSchedule] = useState<AvailableScheduleItem[]>(
		_.cloneDeep(availableSchedule)
	);
	const router = useRouter();

	const sendAuthRequest = useCallback(async (code: string | null) => {
		try {
			const request = await fetch("/api/twitter", {
				method: "POST",
				body: JSON.stringify({ code }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response = await request.json();
			if (response.data) {
				console.log(response.data);
				localStorage.setItem("userData", JSON.stringify(response.data));
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.href);
		const code = params.get("code");
		if (code) {
			sendAuthRequest(code);
		} else {
			router.push("/");
		}
	}, [sendAuthRequest, router]);

	const updateScheduleFunction = useCallback(() => {
		const existingSchedule = localStorage.getItem("schedule");
		if (existingSchedule) {
			const schedule = JSON.parse(existingSchedule);
			updateYourSchedule(schedule);
		}
	}, []);

	useEffect(() => {
		updateScheduleFunction();
	}, [updateYourSchedule, updateScheduleFunction]);

	return (
		<CopilotKit runtimeUrl='/api/copilotkit/'>
			<App
				yourSchedule={yourSchedule}
				updateYourSchedule={updateYourSchedule}
			/>
			<CopilotPopup
				instructions='Help the user create and manage ad campaigns.'
				defaultOpen={true}
				labels={{
					title: "Posts Scheduler Copilot",
					initial:
						"Hello there! I can help you manage your schedules. What do you want to do? You can generate posts, add, and delete scheduled posts.",
				}}
				clickOutsideToClose={false}
			></CopilotPopup>
		 </CopilotKit>
	);
}