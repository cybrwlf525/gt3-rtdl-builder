export const extractTARatio = (text: string) => {
	// Regular expression to match the TA Ratio value
	const regex = /TA Ratio = ([\d.]+)/;
	const match = text.match(regex);

	if (match?.[1]) {
		// match[1] contains the first captured group, which is the TA Ratio value
		return match[1];
	}
	return null;
};
