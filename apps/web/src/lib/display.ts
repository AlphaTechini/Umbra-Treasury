export function formatCurrency(value: number | string | null | undefined) {
	const amount = typeof value === 'string' ? Number(value) : value;

	if (!Number.isFinite(amount)) {
		return 'No data yet';
	}

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(amount as number);
}

export function formatDate(value: string | null | undefined) {
	if (!value) {
		return 'No data yet';
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return 'No data yet';
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
}

export function formatLabel(value: string | null | undefined) {
	if (!value) {
		return 'No data yet';
	}

	return value
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function shortId(value: string | null | undefined) {
	if (!value) {
		return 'No data yet';
	}

	if (value.length <= 12) {
		return value;
	}

	return `${value.slice(0, 8)}...${value.slice(-4)}`;
}
