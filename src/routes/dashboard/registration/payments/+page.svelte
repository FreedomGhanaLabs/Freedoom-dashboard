<script lang="ts">
  import { onMount } from 'svelte';
  
  // Data from page.server.ts
  export let data;
  
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
    filteredPayments = payments.filter((payment: { receiptNumber: string; notes: string; paymentStatus: string; latePayment: { isLate: boolean; daysLate: number; }; }) => {
      const matchesSearch = searchTerm === '' || 
        payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.notes && payment.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'confirmed' && payment.paymentStatus === 'confirmed') ||
        (filterStatus === 'pending' && payment.paymentStatus === 'pending') ||
        (filterStatus === 'late' && payment.latePayment && 
         (payment.latePayment.isLate === true || 
          (payment.latePayment.daysLate && payment.latePayment.daysLate > 0)));
      
      return matchesSearch && matchesStatus;
    });
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

function calculateSummary(payments: { balanceAfterPayment: any; latePayment?: { isLate: boolean; daysLate: number }; amount?: number | string }[]) {
  if (!payments || payments.length === 0) {
    return { totalAmount: 0, totalPayments: 0, latePayments: 0, currentBalance: 0 };
  }
  
  // Count payments where latePayment object exists and has isLate true
  const lateCount = payments.filter(p => p.latePayment && p.latePayment.isLate).length;
  
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

<div class="min-h-screen bg-gradient-to-br w-[80w] mx-auto from-slate-50 to-slate-100 p-4 lg:p-8">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          class="p-2 hover:bg-white/50 rounded-xl transition-colors"
          on:click={() => history.back()}
        >
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Driver Payment History
          </h1>
          <p class="text-slate-600 mt-1">ID: {id}</p>
        </div>
      </div>
     
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 font-medium">Total Payments</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {computedSummary.totalPayments}
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-xl">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 font-medium">Total Amount</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(computedSummary.totalAmount)}
            </p>
          </div>
          <div class="p-3 bg-purple-100 rounded-xl">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
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
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div class="flex flex-col lg:flex-row gap-4 justify-between">
        <div class="relative flex-1 max-w-md">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search payments..."
            bind:value={searchTerm}
            class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <select
            bind:value={filterStatus}
            class="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          >
            <option value="all">All Payments</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="late">Late</option>
          </select>
          <button class="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Payment History -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-900">Payment History</h2>
        <p class="text-slate-600 mt-1">Recent payment transactions</p>
      </div>
      
      <div class="divide-y divide-slate-200">
        {#each filteredPayments as payment}
          <div class="p-6 hover:bg-slate-50/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                  <span class="text-xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-semibold text-slate-900 capitalize">
                      {payment.paymentFor.replace('_', ' ')}
                    </h3>
                    <!-- Status Badge -->
                    {#if payment.latePayment.isLate}
                      <div class="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        Late ({payment.latePayment.daysLate} days)
                      </div>
                    {:else if payment.paymentStatus === 'confirmed'}
                      <div class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Confirmed
                      </div>
                    {:else}
                      <div class="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Pending
                      </div>
                    {/if}
                  </div>
                  <p class="text-sm text-slate-600">{payment.notes}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Receipt: {payment.receiptNumber}</span>
                    <span>Month: {payment.monthOf}</span>
                    <span>By: {payment.recordedBy.firstName}</span>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-2xl font-bold text-slate-900">
                  {formatCurrency(payment.amount)}
                </p>
                <p class="text-sm text-slate-600 mt-1">
                  {formatDate(payment.paymentDate)}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  Balance: {formatCurrency(payment.balanceAfterPayment)}
                </p>
              </div>
            </div>
          </div>
        {:else}
          <div class="p-8 text-center text-slate-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-lg font-medium">No payments found</p>
            <p class="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Pagination -->
    {#if pagination}
      <div class="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
        <p class="text-sm text-slate-600">
          Showing {pagination.currentPage * pagination.limit - pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} payments
        </p>
        <div class="flex items-center gap-2">
          <button 
            class="px-4 py-2 border border-slate-200 rounded-xl transition-colors {pagination.hasPrevious ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-400 cursor-not-allowed'}"
            disabled={!pagination.hasPrevious}
          >
            Previous
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">
            {pagination.currentPage}
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 rounded-xl transition-colors {pagination.hasNext ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-400 cursor-not-allowed'}"
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
        <p class="text-sm text-slate-600">
          Showing 1-{filteredPayments.length} of {filteredPayments.length} payments
        </p>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 text-slate-400 border border-slate-200 rounded-xl cursor-not-allowed">
            Previous
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">
            1
          </button>
          <button class="px-4 py-2 text-slate-400 border border-slate-200 rounded-xl cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

