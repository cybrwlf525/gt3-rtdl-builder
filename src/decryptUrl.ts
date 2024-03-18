import { createDecipheriv } from "node:crypto";
export function decryptURL(encrypted: string, key: string, iv: string) {
	const decipher = createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}
