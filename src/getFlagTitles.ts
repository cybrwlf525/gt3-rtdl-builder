export function getFlagTitles(
	className: string,
	flg_d: { o: number; d: string; n: string }[],
): string[] {
	const binaryLength = 32;
	const referenceZeros = "00000000000000000000000000000000";
	const flagNumber = Number.parseInt(className.replace("flg-", ""), 16); // Specify the radix (base) as 16
	const binaryString = flagNumber.toString(2).padStart(binaryLength, "0"); // Pad the binary string, not the sum of referenceZeros and binaryString

	// console.log(`className: ${className}`);

	const flagTitles = [];
	for (let i = 0; i < binaryString.length; ++i) {
		if (binaryString[i] === "1") {
			// console.log(`i: ${i}`);
			const flag = flg_d[i]; // Access the flag object using the index directly
			if (flag?.n) {
				// console.log(flag.n);
				flagTitles.push(flag.n);
			}
		}
	}

	flagTitles.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

	return flagTitles;
}
