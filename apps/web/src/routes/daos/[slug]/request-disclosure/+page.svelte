<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getDaoBySlug } from '$lib/api/daos';
	import { createDisclosureRequest } from '$lib/api/disclosures';
	import type { Dao, DisclosureReason, DisclosureScope } from '$lib/api/types';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { walletSession } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { onMount } from 'svelte';
	import { get } from 'svelte';
	import { FileText, Info, ChevronDown, Send, ArrowLeft, Wallet } from 'lucide-svelte';

	let dao = $state<Dao | null>(null);
	let isLoadingDao = $state(true);
	let error = $state<string | null>(null);
	let requiresWallet = $state(true);

	const slug = $derived($page.params.slug);
	const wallet = $derived($walletSession);
	const submitDisclosureRequestAction = 'disclosures:request:create';

	onMount(async () => {
		if (!slug) {
			error = 'Invalid DAO URL';
			isLoadingDao = false;
			return;
		}

		try {
			const response = await getDaoBySlug(slug);
			dao = response.dao;

			if (!dao.isPublic) {
				error = 'This DAO does not accept public disclosure requests';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load DAO';
		} finally {
			isLoadingDao = false;
		}
	});

	async function handleSubmitDisclosureRequest(event: SubmitEvent) {
		event.preventDefault();
		
		if (!dao) {
			toasts.add('DAO not loaded', 'error');
			return;
		}

		if (requiresWallet && wallet.status !== 'connected') {
			toasts.add('Please connect your wallet to request disclosure', 'error');
			return;
		}

		await runRequestAction(submitDisclosureRequestAction, async () => {
			const formData = new FormData(event.currentTarget as HTMLFormElement);
			const requesterName = getRequiredFormValue(formData, 'name', 'Name');
			const reason = mapDisclosureReason(getRequiredFormValue(formData, 'reason', 'Reason'));
			const requestedScope = mapDisclosureScope(getRequiredFormValue(formData, 'scope', 'Scope'));
			const transactionId = getOptionalFormValue(formData, 'transactionId');
			const category = getOptionalFormValue(formData, 'category');
			const startDate = getOptionalDateTimeValue(formData, 'startDate');
			const endDate = getOptionalDateTimeValue(formData, 'endDate');

			if (requestedScope === 'single_transaction' && !transactionId) {
				throw new Error('Transaction ID is required for single-transaction disclosure.');
			}

			if (requestedScope === 'category' && !category) {
				throw new Error('Category is required for category disclosure.');
			}

			if (requestedScope === 'date_range' && (!startDate || !endDate)) {
				throw new Error('Start and end dates are required for date-range disclosure.');
			}

			await createDisclosureRequest(dao!.id, {
				requesterName,
				...(getOptionalFormValue(formData, 'organization') ? { requesterOrganization: getOptionalFormValue(formData, 'organization') } : {}),
				...(wallet.status === 'connected' && wallet.walletAddress ? { requesterContact: wallet.walletAddress } : 
					getOptionalFormValue(formData, 'contact') ? { requesterContact: getOptionalFormValue(formData, 'contact') } : {}),
				reason,
				...(getOptionalFormValue(formData, 'message') ? { message: getOptionalFormValue(formData, 'message') } : {}),
				requestedScope,
				...(transactionId ? { transactionId } : {}),
				...(category ? { category } : {}),
				...(startDate ? { startDate } : {}),
				...(endDate ? { endDate } : {})
			});

			toasts.add('Disclosure request submitted successfully! You will be notified when the DAO owner reviews your request.', 'success');
			
			// Redirect to auditor dashboard if wallet connected, otherwise back to public page
			if (wallet.status === 'connected') {
				await goto('/auditor/requests');
			} else {
				await goto(`/daos/${dao!.slug}`);
			}
		});
	}

	function getRequiredFormValue(formData: FormData, name: string, label: string) {
		const value = String(formData.get(name) ?? '').trim();
		if (!value) {
			throw new Error(`${label} is required.`);
		}
		return value;
	}

	function getOptionalFormValue(formData: FormData, name: string) {
		return String(formData.get(name) ?? '').trim() || undefined;
	}

	function getOptionalDateTimeValue(formData: FormData, name: string) {
		const value = getOptionalFormValue(formData, name);
		return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;
	}

	function mapDisclosureReason(value: string): DisclosureReason {
		if (value === 'review') return 'community_review';
		if (value === 'audit' || value === 'tax' || value === 'grant_review' || value === 'community_review' || value === 'internal_review' || value === 'other') {
			return value;
		}
		return 'other';
	}

	function mapDisclosureScope(value: string): DisclosureScope {
		if (value === 'single') return 'single_transaction';
		if (value === 'daterange') return 'date_range';
		if (value === 'category' || value === 'full_report') return value;
		return 'full_report';
	}

	async function handleConnectWallet() {
		await goto('/connect-wallet?returnTo=' + encodeURIComponent($page.url.pathname));
	}
</script>

<svelte:head>
	<title>Request Disclosure – {dao?.name ?? 'Umbra Treasury'}</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b]">
	<!-- Header -->
	<header class="bg-[#09090b] border-b border-[#27272a] px-6 py-4">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-bold tracking-tighter text-white hover:text-[#10b981] transition-colors">
					Umbra Treasury
				</a>
				{#if dao}
					<span class="text-zinc-600">•</span>
					<a href="/daos/{dao.slug}" class="text-zinc-400 hover:text-white transition-colors">{dao.name}</a>
				{/if}
			</div>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-2 rounded text-sm hover:bg-[#4edea3] transition-colors">
				Owner Login
			</a>
		</div>
	</header>

	<main class="flex flex-col items-center justify-center p-6 py-12">
		{#if error}
			<div class="text-center py-12 max-w-md">
				<FileText class="mx-auto text-zinc-600 mb-4" size={48} />
				<h1 class="text-2xl font-bold text-white mb-2">Cannot Submit Request</h1>
				<p class="text-zinc-400 mb-6">{error}</p>
				<a href="/" class="inline-flex items-center gap-2 bg-[#10b981] text-[#002113] font-bold px-6 py-3 rounded-lg hover:bg-[#4edea3] transition-colors">
					Go Home
				</a>
			</div>
		{:else if isLoadingDao}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981] mb-4"></div>
				<p class="text-zinc-400">Loading...</p>
			</div>
		{:else}
			<div class="w-full max-w-[560px]">
				<!-- Header -->
				<div class="mb-8 text-center flex flex-col items-center">
					<a href="/daos/{dao?.slug}" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
						<ArrowLeft size={16} />
						Back to {dao?.name}
					</a>
					<div class="h-12 w-12 rounded-full border border-[#27272a] bg-[#18181b] flex items-center justify-center mb-4">
						<FileText class="text-[#10b981]" size={22} fill="currentColor" />
					</div>
					<h1 class="font-h2 text-h2 text-white mb-2">Request Transaction Disclosure</h1>
					
					{#if wallet.status !== 'connected'}
						<div class="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg p-4 mb-4 max-w-md">
							<p class="font-body-md text-body-md text-[#3b82f6] flex items-center gap-2 mb-3">
								<Info size={16} />
								Wallet Connection Required
							</p>
							<p class="text-sm text-zinc-400 mb-4">
								To request disclosure, you must connect your wallet. This ensures only you can access the approved reports.
							</p>
							<button
								onclick={handleConnectWallet}
								class="w-full flex items-center justify-center gap-2 bg-[#10b981] text-[#002113] font-bold px-6 py-3 rounded-lg hover:bg-[#4edea3] transition-colors"
							>
								<Wallet size={18} />
								Connect Wallet to Continue
							</button>
						</div>
					{:else}
						<p class="font-body-md text-body-md text-[#10b981] bg-[#10b981]/10 px-4 py-2 border border-[#10b981]/20 rounded inline-flex items-center gap-2">
							<Info size={16} />
							Request will be tied to your wallet: {wallet.walletAddress?.slice(0, 6)}...{wallet.walletAddress?.slice(-4)}
						</p>
					{/if}
				</div>

				<!-- Form -->
				{#if wallet.status === 'connected'}
				<form
					class="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col gap-6"
					onsubmit={handleSubmitDisclosureRequest}
				>
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400" for="name">Your Name *</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="John Doe"
							class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400" for="organization">Organization</label>
						<input
							id="organization"
							name="organization"
							type="text"
							placeholder="Acme Auditing LLC"
							class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400" for="contact">Your Wallet Address</label>
						<input
							id="contact"
							name="contact"
							type="text"
							readonly
							value={wallet.walletAddress}
							class="bg-[#0d0e15] border border-[#27272a] rounded font-mono text-sm text-zinc-400 px-4 py-3 cursor-not-allowed"
						/>
						<p class="text-xs text-zinc-500">Approved reports will be accessible only to this wallet</p>
					</div>

					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400" for="reason">Reason *</label>
						<div class="relative">
							<select
								id="reason"
								name="reason"
								required
								class="appearance-none w-full bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-colors cursor-pointer"
							>
								<option value="" disabled selected>Select reason...</option>
								<option value="audit">Financial Audit</option>
								<option value="tax">Tax Compliance</option>
								<option value="grant_review">Grant Review</option>
								<option value="review">Community Review</option>
								<option value="other">Other</option>
							</select>
							<ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" size={16} />
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<span class="font-label-mono text-label-mono text-zinc-400 mb-1">Disclosure Scope *</span>
						<div class="grid grid-cols-2 gap-2">
							{#each [
								{ value: 'category', label: 'By Category', checked: true },
								{ value: 'daterange', label: 'Date Range' },
								{ value: 'single', label: 'Single Transaction' },
								{ value: 'full_report', label: 'Full Report' },
							] as scope}
								<label class="cursor-pointer relative">
									<input type="radio" name="scope" value={scope.value} class="peer sr-only" checked={scope.checked} />
									<div class="bg-[#09090b] border border-[#27272a] rounded px-4 py-2.5 text-center transition-all font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500">
										{scope.label}
									</div>
								</label>
							{/each}
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="flex flex-col gap-2">
							<label class="font-label-mono text-label-mono text-zinc-400" for="transactionId">Transaction ID</label>
							<input
								id="transactionId"
								name="transactionId"
								type="text"
								placeholder="For single transaction"
								class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors"
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label class="font-label-mono text-label-mono text-zinc-400" for="category">Category</label>
							<select
								id="category"
								name="category"
								class="appearance-none bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-colors cursor-pointer"
							>
								<option value="">All categories</option>
								<option value="grant">Grants</option>
								<option value="payroll">Payroll</option>
								<option value="vendor">Vendor Payments</option>
								<option value="ops">Operations</option>
								<option value="tax">Tax</option>
								<option value="treasury_transfer">Treasury Transfer</option>
								<option value="other">Other</option>
							</select>
						</div>
						<div class="flex flex-col gap-2">
							<label class="font-label-mono text-label-mono text-zinc-400" for="startDate">Start Date</label>
							<input
								id="startDate"
								name="startDate"
								type="date"
								class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-colors"
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label class="font-label-mono text-label-mono text-zinc-400" for="endDate">End Date</label>
							<input
								id="endDate"
								name="endDate"
								type="date"
								class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-colors"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400" for="message">Additional Message</label>
						<textarea
							id="message"
							name="message"
							placeholder="Explain the purpose of your disclosure request..."
							rows="4"
							class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors resize-none"
						></textarea>
					</div>

					<hr class="border-[#27272a] my-1"/>

					<div class="flex items-center gap-4">
						<a
							href="/daos/{dao?.slug}"
							class="px-4 py-3 border border-[#27272a] rounded font-data-point text-data-point text-white hover:bg-[#27272a] transition-colors w-1/3 text-center"
						>
							Cancel
						</a>
						<button
							type="submit"
							disabled={$pendingRequestActions[submitDisclosureRequestAction]}
							class="px-4 py-3 bg-[#10b981] rounded font-data-point text-data-point text-[#002113] hover:bg-[#4edea3] transition-all w-2/3 flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<span>{$pendingRequestActions[submitDisclosureRequestAction] ? 'Submitting...' : 'Submit Request'}</span>
							<Send size={18} />
						</button>
					</div>
				</form>

				<div class="mt-6 text-center font-label-mono text-label-mono text-zinc-500">
					Your request will be reviewed by the DAO owner
				</div>
				{/if}
			</div>
		{/if}
	</main>
</div>
