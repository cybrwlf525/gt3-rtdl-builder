import type { sheets_v4 } from "googleapis";

export async function addSheet(
	authenticatedSession: sheets_v4.Sheets,
	spreadsheetId: string,
	sheetTitle: string,
) {
	try {
		const response = await authenticatedSession.spreadsheets.batchUpdate({
			spreadsheetId,
			requestBody: {
				requests: [
					{
						addSheet: {
							properties: {
								title: sheetTitle,
							},
						},
					},
				],
			},
		});
		return response.data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("An unknown error occured during addSheet function");
	}
}
