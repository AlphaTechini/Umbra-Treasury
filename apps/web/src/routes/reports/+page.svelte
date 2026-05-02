<script lang="ts">
	import { goto } from '$app/navigation';
	import { 
		Share2, 
		Maximize2, 
		FileText, 
		PieChart, 
		LineChart as LucideLineChart,
		Zap,
		Download
	} from 'lucide-svelte';
	import { createPublicSummaryReport } from '$lib/api/daos';
	import { getDaoDisclosureRequests } from '$lib/api/disclosures';
	import { generateUmbraComplianceReport, getDaoReports } from '$lib/api/reports';
	import type { DisclosureRequest, Report } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatDate, formatLabel } from '$lib/display';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/toasts';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession, requireActiveUmbraSession, signWalletAuthorization, walletSession } from '$lib/session';
	import { issueUmbraComplianceGrant } from '$lib/umbra';
	import { get } from 'svelte/store';

	let mounted = $state(false);
	let reports = $state<Report[]>([]);
	let disclosureRequests = $state<DisclosureRequest[]>([]);
	let isLoadingReports = $state(true);
	let reportEmptyMessage = $state('Loading reports...');
	let selectedRequestId = $state('');
	let grantTransactionSignature = $state('');
	let grantAccountAddress = $state('');
	let nonce = $state('');
	let receiverAddress = $state('');
	let granterX25519PublicKeyHex = $state('');
	let receiverX25519PublicKeyHex = $state('');
	let optionalDataHex = $state('');
	let isChartExpanded = $state(false);
	const generateReportAction = 'reports:generate-public-summary';
	const ingestUmbraReportAction = 'reports:ingest-umbra';

	const reportSourceEntries = $derived(getReportSourceEntries(reports));
	const flowBars = $derived(getFlowBars(reports, disclosureRequests));

	onMount(async () => {
		mounted = true;
		const dao = get(daoSession).dao ?? (await daoSession.loadDemoDao());

		if (!dao) {
			reportEmptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingReports = false;
			return;
		}

		try {
			const [reportResponse, disclosureResponse] = await Promise.all([
				getDaoReports(dao.id),
				getDaoDisclosureRequests(dao.id)
			]);
			reports = reportResponse.reports;
			disclosureRequests = disclosureResponse.disclosureRequests;
			selectedRequestId = disclosureResponse.disclosureRequests.find((request) => request.status === 'approved')?.id ?? '';
			reportEmptyMessage = 'No data yet.';
		} catch (error) {
			reportEmptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingReports = false;
		}
	});

	async function handleGenerateReport() {
		await runRequestAction(generateReportAction, async () => {
			const dao = get(daoSession).dao;
			const walletAddress = get(walletSession).walletAddress;

			if (!dao) {
				throw new Error('Connect a wallet or create a DAO treasury before generating reports.');
			}

			const response = await createPublicSummaryReport(dao.id, {
				...(walletAddress ? { generatedByWalletAddress: walletAddress } : {})
			});
			reports = [response.report, ...reports];
			toasts.add('Public summary report generated and archived.', 'success');
		});
	}

	async function handleUmbraReportIngestion(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(ingestUmbraReportAction, async () => {
			const requestId = selectedRequestId.trim();
			const walletAddress = get(walletSession).walletAddress;
			const grantNonce = parseComplianceNonce(nonce);

			if (!requestId) {
				throw new Error('Choose an approved disclosure request before ingesting an Umbra report.');
			}

			if (!walletAddress) {
				throw new Error('Connect the DAO owner wallet before ingesting an Umbra report.');
			}

			if (!receiverAddress.trim()) {
				throw new Error('Receiver address is required to issue the Umbra compliance grant.');
			}

			const umbraSession = await requireActiveUmbraSession();
			const issuedGrantSignature = await issueUmbraComplianceGrant(umbraSession, {
				receiverAddress: receiverAddress.trim(),
				granterX25519PublicKeyHex: granterX25519PublicKeyHex.trim(),
				receiverX25519PublicKeyHex: receiverX25519PublicKeyHex.trim(),
				nonce: grantNonce,
				...(optionalDataHex.trim() ? { optionalDataHex: optionalDataHex.trim() } : {})
			});
			grantTransactionSignature = issuedGrantSignature;

			const walletAuthorization = await signWalletAuthorization({
				action: 'report:umbra:create',
				requestId,
				walletAddress
			});
			const response = await generateUmbraComplianceReport(requestId, {
				generatedByWalletAddress: walletAddress,
				walletAuthorization,
				grantTransactionSignature: issuedGrantSignature,
				...(grantAccountAddress.trim() ? { grantAccountAddress: grantAccountAddress.trim() } : {}),
				nonce: grantNonce.toString(),
				operationRefs: {
					source: 'frontend_browser_issued_umbra_grant',
					receiverAddress: receiverAddress.trim()
				},
				notes: ['Browser issued Umbra grant; backend stores verification as unverified until on-chain verification exists.']
			});

			reports = [response.report, ...reports];
			toasts.add('Umbra compliance report ingested as unverified.', 'success');
		});
	}

	function handleShare() {
		void navigator.clipboard?.writeText(window.location.href);
		toasts.add('Reports page link copied to clipboard.', 'success');
	}

	function getReportSourceEntries(reportList: Report[]) {
		const counts = reportList.reduce<Record<string, number>>((accumulator, report) => {
			accumulator[report.source] = (accumulator[report.source] ?? 0) + 1;
			return accumulator;
		}, {});
		const total = Math.max(1, reportList.length);

		return Object.entries(counts).map(([source, count]) => ({
			source,
			count,
			percentage: Math.round((count / total) * 100)
		}));
	}

	function getFlowBars(reportList: Report[], requestList: DisclosureRequest[]) {
		const items = [
			...reportList.map((report) => ({ date: report.generatedAt, weight: report.source === 'umbra_compliance' ? 3 : 2 })),
			...requestList.map((request) => ({ date: request.createdAt, weight: request.status === 'approved' ? 2 : 1 }))
		].slice(0, 24);

		if (items.length === 0) {
			return [];
		}

		const maxWeight = Math.max(...items.map((item) => item.weight));

		return items.map((item, index) => ({
			label: formatDate(item.date),
			value: item.weight,
			height: Math.max(16, Math.round((item.weight / maxWeight) * 100)),
			key: `${item.date}-${index}`
		}));
	}

	function parseComplianceNonce(value: string) {
		const normalized = value.trim();

		if (!normalized) {
			return BigInt(Date.now());
		}

		if (!/^\d+$/.test(normalized)) {
			throw new Error('Nonce must be a non-negative integer.');
		}

		return BigInt(normalized);
	}
</script>

{#if mounted}
<div class="flex">
	<Sidebar />
	
	<main class="flex-1 ml-64 p-8">
		<header class="flex items-center justify-between mb-10" in:fade>
			<div>
				<h1 class="text-3xl font-bold tracking-tight mb-1">Intelligence Reports</h1>
				<p class="text-zinc-500 text-sm">Deep-dive analytics and automated compliance documentation.</p>
			</div>
			
			<div class="flex items-center gap-3">
				<button 
					onclick={handleShare}
					class="p-2 border border-white/5 bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
					aria-label="Share reports"
				>
					<Share2 size={18} />
				</button>
				<button 
					onclick={handleGenerateReport}
					disabled={$pendingRequestActions[generateReportAction]}
					class="px-4 py-2 bg-[#10b981] text-[#002113] text-sm font-bold rounded-lg hover:bg-[#4edea3] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
				>
					{$pendingRequestActions[generateReportAction] ? 'Generating...' : 'Generate Public Summary'}
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
			<div class="glass-card p-6" in:fly={{ y: 20, delay: 200 }}>
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#4edea3]">
						<PieChart size={20} />
					</div>
					<h3 class="font-bold">Report Source Mix</h3>
				</div>
				<div class="aspect-square relative flex items-center justify-center">
					<div class="w-48 h-48 rounded-full border-[16px] border-zinc-900 relative">
						<div class="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-[#10b981] border-r-cyan-400 rotate-45"></div>
						<div class="text-center">
							<p class="text-2xl font-bold">{reports.length}</p>
							<p class="text-[10px] text-zinc-500 uppercase font-black">Reports</p>
						</div>
					</div>
				</div>
				<div class="mt-8 space-y-3">
					{#if reportSourceEntries.length === 0}
						<p class="text-sm text-zinc-500">Generate a public summary or Umbra compliance report to populate this view.</p>
					{:else}
						{#each reportSourceEntries as entry}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="w-2 h-2 rounded-full bg-[#10b981]"></div>
									<span class="text-xs text-zinc-400">{formatLabel(entry.source)}</span>
								</div>
								<span class="text-xs font-bold">{entry.percentage}%</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<div class="lg:col-span-2 glass-card p-6" in:fly={{ y: 20, delay: 400 }}>
				<div class="flex items-center justify-between mb-8">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
							<LucideLineChart size={20} />
						</div>
						<h3 class="font-bold">Institutional Flow</h3>
					</div>
					<button 
						onclick={() => (isChartExpanded = !isChartExpanded)}
						class="p-2 text-zinc-500 hover:text-white transition-colors"
						aria-label="Toggle chart height"
					>
						<Maximize2 size={16} />
					</button>
				</div>
				
				<div class="{isChartExpanded ? 'h-96' : 'h-64'} flex items-end gap-1 transition-all">
					{#if flowBars.length === 0}
						<div class="w-full h-full flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-sm text-zinc-500">
							No report or disclosure activity yet.
						</div>
					{:else}
					{#each flowBars as bar}
						<button 
							class="flex-1 bg-white/5 rounded-t-sm hover:bg-white/10 transition-all cursor-pointer relative group" 
							style="height: {bar.height}%"
							onclick={() => toasts.add(`${bar.label}: activity score ${bar.value}`, 'info')}
							aria-label="View data point for {bar.label}"
						>
							<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
								{bar.value}
							</div>
						</button>
					{/each}
					{/if}
				</div>
				<div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
					<span>{flowBars[0]?.label ?? 'No data yet'}</span>
					<span>Activity Events: {flowBars.length}</span>
					<span>{flowBars.at(-1)?.label ?? 'No data yet'}</span>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="glass-card p-6" in:fly={{ y: 20, delay: 600 }}>
				<h3 class="font-bold mb-6">Generated Archives</h3>
				<div class="space-y-4">
					{#if isLoadingReports}
						<p class="text-sm text-zinc-500">Loading reports...</p>
					{:else if reports.length === 0}
						<p class="text-sm text-zinc-500">{reportEmptyMessage}</p>
					{:else}
					{#each reports as report}
						<button 
							class="w-full flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group text-left"
							onclick={() => goto(`/reports/${report.id}`)}
						>
							<div class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
								<FileText size={18} />
							</div>
							<div class="flex-1">
								<p class="text-sm font-semibold">{report.title}</p>
								<p class="text-[10px] text-zinc-500">{formatDate(report.generatedAt)} - {formatLabel(report.source)}</p>
							</div>
							<div class="p-2 text-zinc-600 group-hover:text-white">
								<Download size={16} />
							</div>
						</button>
					{/each}
					{/if}
				</div>
			</div>

			<form class="glass-card p-6 relative overflow-hidden" in:fly={{ y: 20, delay: 800 }} onsubmit={handleUmbraReportIngestion}>
				<Zap size={120} class="absolute -right-10 -bottom-10 text-[#10b981]/10 rotate-12" />
				<h3 class="font-bold mb-2">Umbra Compliance Ingestion</h3>
				<p class="text-zinc-500 text-sm mb-8">Issue a browser-side Umbra compliance grant, then record its grant reference as an unverified report artifact.</p>
				
				<div class="space-y-4 relative z-10">
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Disclosure Request
						<select
							bind:value={selectedRequestId}
							class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white"
						>
							<option value="">Select approved request...</option>
							{#each disclosureRequests.filter((request) => request.status === 'approved') as request}
								<option value={request.id}>{request.requesterName} - {formatLabel(request.reason)}</option>
							{/each}
						</select>
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Receiver Address
						<input bind:value={receiverAddress} class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="Auditor or reviewer wallet address" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Granter X25519 Public Key
						<input bind:value={granterX25519PublicKeyHex} class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="32-byte hex public key" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Receiver X25519 Public Key
						<input bind:value={receiverX25519PublicKeyHex} class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="32-byte hex public key" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Grant Account Address
						<input bind:value={grantAccountAddress} class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="Optional PDA/reference if known" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Grant Transaction Signature
						<input bind:value={grantTransactionSignature} readonly class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-zinc-300 placeholder:text-zinc-600" placeholder="Filled after browser issuance" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Nonce
						<input bind:value={nonce} inputmode="numeric" class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="Defaults to current timestamp" />
					</label>
					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-500">
						Optional Data
						<input bind:value={optionalDataHex} class="bg-[#0d0e15] border border-[#27272a] rounded-lg px-3 py-2 text-sm normal-case text-white placeholder:text-zinc-600" placeholder="Optional 32-byte hex payload" />
					</label>
					<button
						type="submit"
						disabled={$pendingRequestActions[ingestUmbraReportAction]}
						class="w-full px-4 py-2 bg-emerald-500 text-[#002113] text-sm font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
					>
						{$pendingRequestActions[ingestUmbraReportAction] ? 'Issuing...' : 'Issue Grant And Ingest Report'}
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
{/if}
