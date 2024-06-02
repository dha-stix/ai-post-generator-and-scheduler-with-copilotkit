import Link from "next/link";
import { getTwitterOauthUrl } from "@/app/util";

export default function Home() {
	return (
		<main className='w-full min-h-screen flex flex-col items-center justify-center p-8'>
			<h2 className='font-semibold text-2xl mb-4'>Your AI Post Scheduler</h2>
			<Link
				href={getTwitterOauthUrl()}
				className='bg-black py-3 px-6 hover:bg-gray-700 text-gray-50 rounded-lg'
			>
				Sign in with Twitter
			</Link>
		</main>
	);
}