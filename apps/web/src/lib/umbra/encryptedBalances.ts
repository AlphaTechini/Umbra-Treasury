import {
	getEncryptedBalanceQuerierFunction,
	getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction,
	getPublicBalanceToEncryptedBalanceDirectDepositorFunction,
	getUserRegistrationFunction
} from '@umbra-privacy/sdk';
import type {
	DepositResult,
	EncryptedBalanceToPublicBalanceDirectWithdrawerOptions,
	QueryEncryptedBalanceResult,
	UserRegistrationOptions,
	WithdrawResult
} from '@umbra-privacy/sdk/interfaces';
import { toUmbraBaseUnits } from './amounts';
import type { UmbraClientSession } from './client';

type DepositFunction = ReturnType<typeof getPublicBalanceToEncryptedBalanceDirectDepositorFunction>;
type WithdrawFunction = ReturnType<typeof getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction>;
type UmbraAddress = Parameters<DepositFunction>[0];
type DepositOptions = Parameters<DepositFunction>[3];

export type RegisterUmbraUserInput = {
	options?: UserRegistrationOptions;
};

export type DepositIntoEncryptedBalanceInput = {
	destinationAddress: string;
	mintAddress: string;
	amountBaseUnits: bigint;
	options?: DepositOptions;
};

export type QueryEncryptedBalancesInput = {
	mintAddresses: string[];
};

export type QueryEncryptedBalancesResult = Map<string, QueryEncryptedBalanceResult>;

export type WithdrawFromEncryptedBalanceInput = {
	destinationAddress: string;
	mintAddress: string;
	amountBaseUnits: bigint;
	options?: EncryptedBalanceToPublicBalanceDirectWithdrawerOptions;
};

function toUmbraAddress(address: string, label: string): UmbraAddress {
	if (!address.trim()) {
		throw new Error(`${label} is required`);
	}

	return address.trim() as UmbraAddress;
}

export async function registerUmbraUser(
	session: UmbraClientSession,
	{ options }: RegisterUmbraUserInput = {}
): Promise<string[]> {
	const register = getUserRegistrationFunction({ client: session.client });

	// Anonymous mixer registration needs a ZK prover; encrypted balances only need confidential mode.
	return register(options ?? { confidential: true, anonymous: false });
}

export async function depositIntoEncryptedBalance(
	session: UmbraClientSession,
	input: DepositIntoEncryptedBalanceInput
): Promise<DepositResult> {
	const deposit = getPublicBalanceToEncryptedBalanceDirectDepositorFunction({ client: session.client });

	return deposit(
		toUmbraAddress(input.destinationAddress, 'destinationAddress'),
		toUmbraAddress(input.mintAddress, 'mintAddress'),
		toUmbraBaseUnits(input.amountBaseUnits),
		input.options
	);
}

export async function queryEncryptedBalances(
	session: UmbraClientSession,
	input: QueryEncryptedBalancesInput
): Promise<QueryEncryptedBalancesResult> {
	const query = getEncryptedBalanceQuerierFunction({ client: session.client });
	const mints = input.mintAddresses.map((mintAddress) => toUmbraAddress(mintAddress, 'mintAddress'));
	const balances = await query(mints);

	return new Map(
		Array.from(balances.entries()).map(([mintAddress, balance]) => [String(mintAddress), balance])
	);
}

export async function withdrawFromEncryptedBalance(
	session: UmbraClientSession,
	input: WithdrawFromEncryptedBalanceInput
): Promise<WithdrawResult> {
	const withdraw = getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction({ client: session.client });

	return withdraw(
		toUmbraAddress(input.destinationAddress, 'destinationAddress'),
		toUmbraAddress(input.mintAddress, 'mintAddress') as Parameters<WithdrawFunction>[1],
		toUmbraBaseUnits(input.amountBaseUnits),
		input.options
	);
}
