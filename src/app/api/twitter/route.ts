import { NextRequest, NextResponse } from "next/server";

const BasicAuthToken = Buffer.from(
	`${process.env.TWITTER_CLIENT_ID!}:${process.env.TWITTER_CLIENT_SECRET!}`,
	"utf8"
).toString("base64");

const twitterOauthTokenParams = {
	client_id: process.env.TWITTER_CLIENT_ID!,
	code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
	redirect_uri: `http://www.localhost:3000/dashboard`,
	grant_type: "authorization_code",
};


//gets user access token

export const fetchUserToken = async (code: string) => {
	try {
		const formatData = new URLSearchParams({
			...twitterOauthTokenParams,
			code,
		});
		const getTokenRequest = await fetch(
			"https://api.twitter.com/2/oauth2/token",
			{
				method: "POST",
				body: formatData.toString(),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${BasicAuthToken}`,
				},
			}
		);
		const getTokenResponse = await getTokenRequest.json();
		return getTokenResponse;
	} catch (err) {
		return null;
	}
};
//gets user's data from the access token
export const fetchUserData = async (accessToken: string) => {
	try {
		const getUserRequest = await fetch("https://api.twitter.com/2/users/me", {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const getUserProfile = await getUserRequest.json();
		return getUserProfile;
	} catch (err) {
		return null;
	}
};

export async function POST(req: NextRequest) {
	const { code } = await req.json();
	try {
		const tokenResponse = await fetchUserToken(code);
        const accessToken = await tokenResponse.access_token;
        
		const userDataResponse = await fetchUserData(accessToken);
        const userCredentials = { ...tokenResponse, ...userDataResponse };

		return NextResponse.json(
			{
				data: {
					accessToken: userCredentials.access_token,
					_id: userCredentials.data.id,
					username: userCredentials.data.username,
				},
			},
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ error: err }, { status: 500 });
	}
}