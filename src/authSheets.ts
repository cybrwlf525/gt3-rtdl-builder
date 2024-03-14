import { google, type sheets_v4 } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

export async function authSheets(): Promise<sheets_v4.Sheets> {
	const auth = new google.auth.GoogleAuth({
		keyFile: "keys.json",
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});

	const authClient = (await auth.getClient()) as OAuth2Client;
	const sheets = google.sheets({ version: "v4", auth: authClient });

	return sheets;
}
