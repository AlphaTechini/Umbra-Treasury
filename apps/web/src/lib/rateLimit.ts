type RateLimitConfig = {
	maxOperations: number;
	windowMs: number;
};

type OperationTimestamps = Map<string, number[]>;

const operationTimestamps: OperationTimestamps = new Map();

const defaultConfigs: Record<string, RateLimitConfig> = {
	deposit: { maxOperations: 10, windowMs: 60_000 }, // 10 deposits per minute
	withdraw: { maxOperations: 10, windowMs: 60_000 }, // 10 withdrawals per minute
	complianceGrant: { maxOperations: 5, windowMs: 60_000 }, // 5 grants per minute
	registration: { maxOperations: 3, windowMs: 300_000 }, // 3 registrations per 5 minutes
};

export function checkRateLimit(operation: string, config?: RateLimitConfig): boolean {
	const { maxOperations, windowMs } = config ?? defaultConfigs[operation] ?? { maxOperations: 10, windowMs: 60_000 };

	const now = Date.now();
	const timestamps = operationTimestamps.get(operation) ?? [];
	const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);

	if (recentTimestamps.length >= maxOperations) {
		return false;
	}

	recentTimestamps.push(now);
	operationTimestamps.set(operation, recentTimestamps);
	return true;
}

export function getRateLimitStatus(operation: string, config?: RateLimitConfig): {
	allowed: boolean;
	remaining: number;
	resetAt: Date;
} {
	const { maxOperations, windowMs } = config ?? defaultConfigs[operation] ?? { maxOperations: 10, windowMs: 60_000 };

	const now = Date.now();
	const timestamps = operationTimestamps.get(operation) ?? [];
	const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);

	const oldestTimestamp = recentTimestamps[0] ?? now;
	const resetAt = new Date(oldestTimestamp + windowMs);

	return {
		allowed: recentTimestamps.length < maxOperations,
		remaining: Math.max(0, maxOperations - recentTimestamps.length),
		resetAt,
	};
}

export function clearRateLimitHistory(operation?: string): void {
	if (operation) {
		operationTimestamps.delete(operation);
	} else {
		operationTimestamps.clear();
	}
}

export class RateLimitError extends Error {
	constructor(
		operation: string,
		public resetAt: Date,
	) {
		super(`Rate limit exceeded for ${operation}. Try again after ${resetAt.toLocaleTimeString()}.`);
		this.name = 'RateLimitError';
	}
}
