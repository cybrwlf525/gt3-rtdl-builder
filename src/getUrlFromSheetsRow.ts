import type { sheets_v4 } from "googleapis";
import { getEncryptionKey } from "./getEncryptionKey";
import { decryptURL } from "./decryptUrl";

export function getUrlFromSheetsRow(sheetsRow: sheets_v4.Schema$CellData[]) {
	const encryptedUrl = sheetsRow[1].userEnteredValue?.stringValue;

	const ivValue = sheetsRow[2].userEnteredValue?.stringValue;
	if (!encryptedUrl || !ivValue) {
		throw new Error(
			"encryptedUrl or ivValue was not defined for the selected game",
		);
	}

	const key = getEncryptionKey();
	const decryptedURL = decryptURL(encryptedUrl, key, ivValue);

	return decryptedURL;
}
