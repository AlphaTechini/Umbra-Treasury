import { assertU64, type U64 } from '@umbra-privacy/sdk/types';

export function toUmbraBaseUnits(amount: bigint): U64 {
	if (amount <= 0n) {
		throw new Error('Umbra token amounts must be greater than zero base units');
	}

	assertU64(amount, 'amount');
	return amount;
}
