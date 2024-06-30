"use client";
import React, { useState } from "react";
import { formatTime, tableHeadings } from "@/app/util";
import AddScheduleModal from "./AddScheduleModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

interface Props {
	yourSchedule: AvailableScheduleItem[];
	updateYourSchedule: React.Dispatch<
		React.SetStateAction<AvailableScheduleItem[]>
	>;
}

export default function App({ yourSchedule, updateYourSchedule }: Props) {
	const [addEventModal, setAddEventModal] = useState(false);
	const [deleteEventModal, setDeleteEventModal] = useState(false);
	const [selectedCell, setSelectedCell] = useState<SelectedCell>({
		day_id: 0,
		day: "",
		time_id: 0,
		time: "",
	});
	const [delSelectedCell, setDelSelectedCell] = useState<DelSelectedCell>({
		content: "",
		day_id: 0,
		day: "",
		published: false,
		time_id: 0,
		time: "",
		minutes: 0,
	});
	const [content, setContent] = useState<string>("");
	const [minute, setMinute] = useState<number>(0);

	const handleAddEvent = (id: number, time: number) => {
		setSelectedCell({
			day_id: id + 1,
			day: tableHeadings[id + 1],
			time_id: time,
			time: formatTime(time),
		});
		setAddEventModal(true);
	};

	useCopilotReadable({
		description: "The user's Twitter post schedule",
		value: yourSchedule,
	});

	useCopilotReadable({
		description: "Guidelines for the user's Twitter post schedule",
		value:
			"Your schedule is displayed in a table format. Each row represents an hour of the day, and each column represents a day of the week. You can add a post by clicking on an empty cell, and delete a post by clicking on a filled cell. Sunday is the first day of the week and has a day_id of 0.",
	});

	useCopilotAction({
		name: "updatePostSchedule",
		description: "Update the user's Twitter post schedule",
		parameters: [
			{
				name: "update_schedule",
				type: "object",
				description: "The user's updated post schedule",
				attributes: [
					{
						name: "time",
						type: "number",
						description: "The time of the post",
					},
					{
						name: "schedule",
						type: "object[]",
						description: "The schedule for the time",
						attributes: [
							{
								name: "content",
								type: "string",
								description: "The content of the post",
							},
							{
								name: "minutes",
								type: "number",
								description: "The minutes past the hour",
							},
							{
								name: "published",
								type: "boolean",
								description: "Whether the post is published",
							},
							{
								name: "day",
								type: "number",
								description: "The day of the week",
							},
						],
					},
				],
			},
		],
		handler: ({ update_schedule }) => {
			setAddEventModal(true);
			console.log(update_schedule);
			setSelectedCell({
				day_id: update_schedule.schedule[0].day + 1,
				day: tableHeadings[update_schedule.schedule[0].day + 1],
				time_id: update_schedule.time,
				time: formatTime(update_schedule.time),
			});
			setContent(update_schedule.schedule[0].content);
			setMinute(update_schedule.schedule[0].minutes);
		},
		render: "Updating schedule...",
	});

	const handleDeleteEvent = (
		e: React.MouseEvent<HTMLParagraphElement>,
		content: Content,
		time: number
	) => {
		e.stopPropagation();
		if (content.day !== undefined) {
			setDelSelectedCell({
				content: content.content,
				day_id: content.day,
				day: tableHeadings[content.day],
				published: content.published,
				time_id: time,
				time: formatTime(time),
				minutes: content.minutes,
			});
			setDeleteEventModal(true);
		}
	};

	return (
		<main className='w-full min-h-screen p-8'>
			<header className='w-full flex items-center mb-6 justify-center'>
				<h2 className='text-center font-extrabold text-3xl mr-2'>
					Your Post Schedule
				</h2>
			</header>
			<div className='px-8'>
				<div className='w-full h-[70vh] overflow-y-scroll'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								{tableHeadings.map((day, index) => (
									<th
										key={index}
										className='bg-gray-500 text-gray-50 p-4 font-normal text-sm'
									>
										{day}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{yourSchedule.map((item, index) => (
								<tr key={index}>
									<td className='bg-gray-500 text-gray-50 p-4 text-sm'>
										{formatTime(item.time)}
									</td>
									{item.schedule.map((sch, id) => (
										<td
											key={id}
											onClick={() => handleAddEvent(id, item.time)}
											className='cursor-pointer'
										>
											{sch.map((content, ind: number) => (
												<div
													key={ind}
													onClick={(e) =>
														handleDeleteEvent(e, content, item.time)
													}
													className={`p-3 ${
														content.published ? "bg-pink-500" : "bg-green-600"
													}  mb-2 rounded-md text-xs cursor-pointer`}
												>
													<p className='text-gray-800 mb-2'>
														{" "}
														{content.minutes === 0
															? "o'clock"
															: `at ${content.minutes} minutes past`}
													</p>
													<p className=' text-white'>{content.content}</p>
												</div>
											))}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{addEventModal && (
					<AddScheduleModal
						setAddEventModal={setAddEventModal}
						addEventModal={addEventModal}
						selectedCell={selectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
						content={content}
						setContent={setContent}
						minute={minute}
						setMinute={setMinute}
					/>
				)}
				{deleteEventModal && (
					<DeleteScheduleModal
						setDeleteEventModal={setDeleteEventModal}
						deleteEventModal={deleteEventModal}
						delSelectedCell={delSelectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
					/>
				)}
			</div>
		</main>
	);
}