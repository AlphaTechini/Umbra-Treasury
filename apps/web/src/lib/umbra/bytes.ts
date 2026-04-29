export function hexToBytes(hex: string, expectedLength: number, label: string): Uint8Array {
	const normalized = hex.trim().replace(/^0x/i, '');

	if (normalized.length !== expectedLength * 2) {
		throw new Error(`${label} must be ${expectedLength} bytes encoded as hex`);
	}

	if (!/^[\da-f]+$/i.test(normalized)) {
		throw new Error(`${label} must be valid hex`);
	}

	const bytes = new Uint8Array(expectedLength);

	for (let i = 0; i < expectedLength; i += 1) {
		bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
	}

	return bytes;
}
