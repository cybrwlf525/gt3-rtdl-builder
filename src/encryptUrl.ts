import { createCipheriv, randomBytes } from "node:crypto";

export function encryptURL(url: string, key: string) {
	if (key.length !== 32) {
		throw new Error("Key length must be exactly 32 characters");
	}
	const iv = randomBytes(16);
	const cipher = createCipheriv("aes-256-cbc", key, iv);
	let encrypted = cipher.update(url, "utf8", "hex");
	encrypted += cipher.final("hex");
	return { encrypted, iv: iv.toString("hex") };
}
