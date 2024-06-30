"use client";
import App from "@/app/components/App";
import _ from "lodash";
import {  useState, useEffect, useCallback } from "react";
import { availableSchedule } from "../util";
import { useSearchParams } from 'next/navigation'

//👇🏻 CopilotKit components
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";

//👇🏻 CSS styles for CopilotKit components
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";


export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [yourSchedule, updateYourSchedule] = useState<AvailableScheduleItem[]>(
		_.cloneDeep(availableSchedule)
	);
	const searchParams = useSearchParams()
	const code = searchParams.get('code')

	const fetchToken = useCallback(async () => { 
			const res = await fetch("/api/twitter", {
				method: "POST",
				body: JSON.stringify({ code }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				const data = await res.json();
				console.log(data);
			}
	}, [code]);
	
	useEffect(() => {
		fetchToken();
	}, [fetchToken]);


	useEffect(() => { 
		const fetchSchedule = async () => {
			const res = await fetch("/api/schedule");
			if (res.ok) {
				const data = await res.json();
				updateYourSchedule(data.schedule);
				setLoading(false);
			} else {
				setLoading(false);
				updateYourSchedule(availableSchedule);
			}
		};
		fetchSchedule();
	}, []);

	return (
		<CopilotKit runtimeUrl='/api/copilotkit/'>
			{loading ? <div><p>Loading....</p></div> : (
				<App
					yourSchedule={yourSchedule}
					updateYourSchedule={updateYourSchedule}
				/>
			)}
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