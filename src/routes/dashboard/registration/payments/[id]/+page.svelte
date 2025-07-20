<script lang="ts">
	import { Download, Filter } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { onMount } from 'svelte';

	// Data from page.server.ts
	export let data: {
		id: string;
		ride: any[];
		summary?: any;
		pagination?: any;
	};

	let searchTerm = '';
	let filterStatus = 'all';
	/**
	 * @type {string | any[]}
	 */
	let filteredPayments: string | any[] = [];

	// Destructure data from server
	$: ({ id, ride: payments, summary, pagination } = data);

	// Filter payments based on search and status
	$: {
		if (payments) {
			filteredPayments = payments.filter(
				(payment: {
					receiptNumber: string;
					notes: string;
					paymentStatus: string;
					latePayment: { isLate: boolean; daysLate: number };
				}) => {
					const matchesSearch =
						searchTerm === '' ||
						payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
						(payment.notes && payment.notes.toLowerCase().includes(searchTerm.toLowerCase()));

					const matchesStatus =
						filterStatus === 'all' ||
						(filterStatus === 'confirmed' && payment.paymentStatus === 'confirmed') ||
						(filterStatus === 'pending' && payment.paymentStatus === 'pending') ||
						(filterStatus === 'late' &&
							payment.latePayment &&
							(payment.latePayment.isLate === true ||
								(payment.latePayment.daysLate && payment.latePayment.daysLate > 0)));

					return matchesSearch && matchesStatus;
				}
			);
		}
	}

	function formatCurrency(amount: string | number | bigint) {
		const numericAmount = typeof amount === 'string' ? Number(amount) : amount;
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'GHS'
		}).format(numericAmount);
	}

	function formatDate(dateString: string | number | Date) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getPaymentMethodIcon(method: any) {
		switch (method) {
			case 'bank_transfer':
				return '🏦';
			case 'mobile_money':
				return '📱';
			case 'cash':
				return '💵';
			default:
				return '💳';
		}
	}

	// Replace your existing calculateSummary function with this improved version:

	function calculateSummary(
		payments: {
			balanceAfterPayment: any;
			latePayment?: { isLate: boolean; daysLate: number };
			amount?: number | string;
		}[]
	) {
		if (!payments || payments.length === 0) {
			return { totalAmount: 0, totalPayments: 0, latePayments: 0, currentBalance: 0 };
		}

		// Count payments where latePayment object exists and has isLate true
		const lateCount = payments.filter((p) => p.latePayment && p.latePayment.isLate).length;

		return {
			totalAmount: payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
			totalPayments: payments.length,
			latePayments: lateCount,
			currentBalance: payments[0]?.balanceAfterPayment || 0
		};
	}

	$: computedSummary = summary || calculateSummary(payments);
</script>

<svelte:head>
	<title>Driver Payment History - {id}</title>
</svelte:head>

<div class="mx-auto min-h-screen w-[80w] bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
	<div class="mx-auto max-w-7xl space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<button
					class="rounded-xl p-2 transition-colors hover:bg-white/50"
					onclick={() => history.back()}
				>
					<svg class="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<div>
					<h1
						class="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold text-transparent"
					>
						Driver Payment History
					</h1>
					<p class="mt-1 text-slate-600">ID: {id}</p>
				</div>
			</div>
			<div>
				<Dialog.Root>
					<Dialog.Trigger class="inline-flex items-center space-x-2 rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-500"><Download class="h-4 w-4" />
										<span>Export</span></Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Download PDF</Dialog.Title>
							<Dialog.Description>
								<form
									method="GET"
									action={`/dashboard/registration/payments/${id}/download-pdf`}
									class="flex flex-col items-center gap-4"
								>
									<div>
										<label class="text-sm font-medium mb-1 block">Start Date</label>
										<input
											type="date"
											name="startDate"
											required
											class="w-full rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
										/>
									</div>
									<div>
										<label class="text-sm font-medium mb-1 block">End Date</label>
										<input
											type="date"
											name="endDate"
											required
											class="w-full rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
										/>
									</div>
									<button
										type="submit"
										class="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
									>
										<Download class="h-4 w-4" />
										<span>Export</span>
									</button>
								</form>
							</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>

		<!-- Summary Cards -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 font-medium">Current Balance</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(computedSummary.currentBalance)}
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-xl">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
        </div>
      </div> -->

			<div
				class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Total Payments</p>
						<p class="mt-1 text-2xl font-bold text-slate-900">
							{computedSummary.totalPayments}
						</p>
					</div>
					<div class="rounded-xl bg-green-100 p-3">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div
				class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Total Amount</p>
						<p class="mt-1 text-2xl font-bold text-slate-900">
							{formatCurrency(computedSummary.totalAmount)}
						</p>
					</div>
					<div class="rounded-xl bg-purple-100 p-3">
						<svg
							class="h-6 w-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 font-medium">Late Payments</p>
            <p class="text-2xl font-bold text-red-600 mt-1">
              {computedSummary.latePayments}
            </p>
          </div>
          <div class="p-3 bg-red-100 rounded-xl">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
        </div>
      </div> -->
		</div>

		<!-- Filters and Search -->
		<div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
			<div class="flex flex-col justify-between gap-4 lg:flex-row">
				<div class="relative max-w-md flex-1">
					<svg
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search payments..."
						bind:value={searchTerm}
						class="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-10 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
					/>
				</div>
				<div class="flex items-center gap-3">
					<select
						bind:value={filterStatus}
						class="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
					>
						<option value="all">All Payments</option>
						<option value="confirmed">Confirmed</option>
						<option value="pending">Pending</option>
						<option value="late">Late</option>
					</select>
					<button class="rounded-xl bg-slate-100 p-3 transition-colors hover:bg-slate-200">
						<Filter class="size-5" />
					</button>
				</div>
			</div>
		</div>

		<form
			method="POST"
			action="?/record"
			class="space-y-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
		>
			<h2 class="text-xl font-semibold text-slate-900">Record New Payment</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="flex flex-col space-y-1">
					<label for="amount" class="text-sm font-medium text-slate-700">Amount (GHS)</label>
					<input
						type="number"
						name="amount"
						id="amount"
						required
						class="w-full rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
						placeholder="Amount"
					/>
				</div>

				<div class="flex flex-col space-y-1">
					<label for="paymentMethod" class="text-sm font-medium text-slate-700"
						>Payment Method</label
					>
					<select
						name="paymentMethod"
						id="paymentMethod"
						required
						class="w-full rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
					>
						<option value="">Select Payment Method</option>
						<option value="mobile_money">Mobile Money</option>
						<option value="bank_transfer">Bank Transfer</option>
						<option value="cash">Cash</option>
					</select>
				</div>

				<div class="flex flex-col space-y-1">
					<label for="monthOf" class="text-sm font-medium text-slate-700"
						>Payment Month (In Numbers)</label
					>
					<input
						type="month"
						placeholder="YYYY-MM"
						name="monthOf"
						id="monthOf"
						required
						class="w-full rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				<div class="flex flex-col space-y-1">
					<label for="paymentFor" class="text-sm font-medium text-slate-700">Payment For</label>
					<input
						type="text"
						name="paymentFor"
						id="paymentFor"
						value="monthly_payment"
						readonly
						class="w-full rounded-lg border border-slate-300 bg-gray-100 px-4 py-3 text-slate-900"
					/>
				</div>
			</div>

			<div class="flex flex-col space-y-1">
				<label for="notes" class="text-sm font-medium text-slate-700">Notes</label>
				<textarea
					name="notes"
					id="notes"
					placeholder="Notes..."
					class="h-24 w-full resize-none rounded-lg border border-slate-300 bg-gray-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
				></textarea>
			</div>

			<button
				type="submit"
				name="record"
				class="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-500"
			>
				Record Payment
			</button>
		</form>

		<!-- Payment History -->
		<div class="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm">
			<div class="border-b border-slate-200 p-6">
				<h2 class="text-xl font-semibold text-slate-900">Payment History</h2>
				<p class="mt-1 text-slate-600">Recent payment transactions</p>
			</div>

			<div class="divide-y divide-slate-200">
				{#each filteredPayments as payment (payment._id)}
					<!-- Update Payment Form -->
					<form
						method="POST"
						action="?/update"
						class="flex flex-col gap-4 border-t border-slate-100 p-6 hover:bg-slate-50/50"
					>
						<input type="hidden" name="paymentId" value={payment._id} />

						<div class="flex flex-wrap items-start justify-between gap-4">
							<div class="flex items-center gap-4">
								<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
									<span class="text-xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
								</div>
								<div class="space-y-1">
									<h3 class="font-semibold text-slate-900 capitalize">
										{payment.paymentFor.replace('_', ' ')}
									</h3>
									<p class="text-sm text-slate-600">
										<input
											type="text"
											name="notes"
											value={payment.notes}
											class="w-full rounded border px-2 py-1 text-sm text-slate-700"
										/>
									</p>
									<div class="flex flex-wrap gap-4 text-xs text-slate-500">
										<span>Receipt: {payment.receiptNumber}</span>
										<span>Month: {payment.monthOf}</span>
										<span>By: {payment.recordedBy.firstName}</span>
									</div>
								</div>
							</div>

							<div class="space-y-1 text-right">
								<input
									type="number"
									name="amount"
									value={payment.amount}
									class="w-28 rounded border px-2 py-1 text-right font-semibold text-slate-900"
								/>
								<div>
									<select
										name="paymentMethod"
										class="w-full rounded border text-sm text-slate-700"
										required
									>
										<option
											value="mobile_money"
											selected={payment.paymentMethod === 'mobile_money'}
										>
											Mobile Money
										</option>
										<option
											value="bank_transfer"
											selected={payment.paymentMethod === 'bank_transfer'}
										>
											Bank Transfer
										</option>
										<option value="cash" selected={payment.paymentMethod === 'cash'}> Cash </option>
									</select>
								</div>
								<p class="text-xs text-slate-500">
									Balance: {formatCurrency(payment.balanceAfterPayment)}
								</p>
								<p class="text-xs text-slate-500">
									{formatDate(payment.paymentDate)}
								</p>
							</div>
						</div>

						<div class="mt-2 flex justify-end">
							<button
								type="submit"
								class="relative rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
							>
								Update
							</button>
						</div>
					</form>

					<!-- Delete Payment Form -->
					<form method="POST" action="?/delete" class="mt-2 flex justify-end px-6">
						<input type="hidden" name="paymentId" value={payment._id} />
						<button
							type="submit"
							class="relative right-[6rem] bottom-[4.3rem] rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
							onclick={() => confirm('Are you sure you want to delete this payment?')}
						>
							Delete
						</button>
					</form>
				{:else}
					<div class="p-8 text-center text-slate-500">
						<svg
							class="w-12 h-12 mx-auto mb-4 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<p class="text-lg font-medium">No payments found</p>
						<p class="text-sm">Try adjusting your search or filter criteria</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Pagination -->
		{#if pagination}
			<div
				class="flex items-center justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
			>
				<p class="text-sm text-slate-600">
					Showing {pagination.currentPage * pagination.limit - pagination.limit + 1}-{Math.min(
						pagination.currentPage * pagination.limit,
						pagination.total
					)} of {pagination.total} payments
				</p>
				<div class="flex items-center gap-2">
					<button
						class="rounded-xl border border-slate-200 px-4 py-2 transition-colors {pagination.hasPrevious
							? 'text-slate-700 hover:bg-slate-50'
							: 'cursor-not-allowed text-slate-400'}"
						disabled={!pagination.hasPrevious}
					>
						Previous
					</button>
					<button class="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">
						{pagination.currentPage}
					</button>
					<button
						class="rounded-xl border border-slate-200 px-4 py-2 transition-colors {pagination.hasNext
							? 'text-slate-700 hover:bg-slate-50'
							: 'cursor-not-allowed text-slate-400'}"
						disabled={!pagination.hasNext}
					>
						Next
					</button>
				</div>
			</div>
		{:else}
			<div
				class="flex items-center justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
			>
				<p class="text-sm text-slate-600">
					Showing 1-{filteredPayments.length} of {filteredPayments.length} payments
				</p>
				<div class="flex items-center gap-2">
					<button
						class="cursor-not-allowed rounded-xl border border-slate-200 px-4 py-2 text-slate-400"
					>
						Previous
					</button>
					<button class="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white"> 1 </button>
					<button
						class="cursor-not-allowed rounded-xl border border-slate-200 px-4 py-2 text-slate-400"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
