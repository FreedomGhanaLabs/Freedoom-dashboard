<!-- src/routes/dashboard/user/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import type { FinancialData } from '$lib/finance';
  import { formatCurrency, formatPercentage, getStatusColor, getBackgroundColor } from '$lib/finance';
  import { onMount } from 'svelte';

  export let data: PageData;

  $: financials = data.financials as unknown as FinancialData;
  
  // Calculate additional metrics
  $: burnRate = financials?.metrics ? Math.abs(financials.metrics.averageDailyExpenses) : 0;
  $: revenueGrowth = financials?.monthlyTrends?.length > 1 ? 
    ((financials.monthlyTrends[financials.monthlyTrends.length - 1]?.earnings || 0) - 
     (financials.monthlyTrends[financials.monthlyTrends.length - 2]?.earnings || 0)) / 
    (financials.monthlyTrends[financials.monthlyTrends.length - 2]?.earnings || 1) * 100 : 0;

  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Financial Dashboard | Freedom Analytics</title>
</svelte:head>

<div class="min-h-screen bg-white w-[70vw] rounded-2xl mx-auto p-4 sm:p-6 lg:p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Financial Overview
          </h1>
          <p class="text-slate-600 mt-2">
            Real-time insights into your business performance
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-slate-700">Live Data</span>
          </div>
          <div class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
            Last {financials?.metrics?.totalDays || 0} Days
          </div>
        </div>
      </div>
    </div>

    {#if financials}
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Earnings -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-100 rounded-xl">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <span class="text-[0.9rem] font-semibold px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl">
                Total Revenue
              </span>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(financials.totalEarnings)}
            </h3>
            <p class="text-sm text-slate-600">
              Avg: {formatCurrency(financials.metrics.averageDailyEarnings)}/day
            </p>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-linear-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-red-100 rounded-xl">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
              </div>
              <span class="text-[0.9rem] font-semibold px-3 py-2 bg-red-100 text-red-700 rounded-xl">
                Expenses
              </span>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(financials.totalExpenses)}
            </h3>
            <p class="text-sm text-slate-600">
              Avg: {formatCurrency(financials.metrics.averageDailyExpenses)}/day
            </p>
          </div>
        </div>

        <!-- Net Profit -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 {financials.netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'} rounded-xl">
                <svg class="w-6 h-6 {financials.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <span class="text-[0.9rem] font-semibold px-3 py-2 {financials.netProfit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} rounded-xl">
                Net Profit
              </span>
            </div>
            <h3 class="text-2xl font-bold {getStatusColor(financials.netProfit)} mb-1">
              {formatCurrency(financials.netProfit)}
            </h3>
            <p class="text-sm text-slate-600">
              Margin: {formatPercentage(financials.metrics.profitMargin)}
            </p>
          </div>
        </div>

        <!-- Transactions -->
        <div class="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="absolute inset-0 bg-linear-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-100 rounded-xl">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span class="text-[0.9rem] font-semibold px-3 py-2 bg-purple-100 text-purple-700 rounded-xl">
                Activity
              </span>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-1">
              {financials.metrics.totalTransactions}
            </h3>
            <p class="text-sm text-slate-600">
              {financials.metrics.totalExpenseEntries} expense entries
            </p>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Financial Health Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-2">Financial Health</h2>
            <p class="text-slate-600 text-sm">Key performance indicators for your business</p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Burn Rate -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-100 rounded-lg">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Daily spending Rate</p>
                  <p class="text-sm text-slate-600">Average daily spending</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-orange-600">{formatCurrency(burnRate)}</p>
              </div>
            </div>

            <!-- Revenue per Transaction -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Revenue per Transaction</p>
                  <p class="text-sm text-slate-600">Average transaction value</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">
                  {formatCurrency(financials.totalEarnings / (financials.metrics.totalTransactions || 1))}
                </p>
              </div>
            </div>

            <!-- Expense Ratio -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-violet-100 rounded-lg">
                  <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">Expense Ratio</p>
                  <p class="text-sm text-slate-600">Expenses as % of revenue</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-violet-600">
                  {formatPercentage((financials.totalExpenses / (financials.totalEarnings || 1)) * 100)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-2">Period Summary</h2>
            <p class="text-slate-600 text-sm">Overview of the last {financials.metrics.totalDays} days</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div class="text-2xl font-bold text-emerald-700 mb-1">
                  {financials.metrics.totalDays}
                </div>
                <div class="text-sm text-emerald-600 font-medium">Active Days</div>
              </div>
              
              <div class="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div class="text-2xl font-bold text-blue-700 mb-1">
                  {financials.metrics.totalTransactions}
                </div>
                <div class="text-sm text-blue-600 font-medium">Transactions</div>
              </div>
              
              <div class="p-4 bg-linear-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <div class="text-2xl font-bold text-purple-700 mb-1">
                  {financials.metrics.totalExpenseEntries}
                </div>
                <div class="text-sm text-purple-600 font-medium">Expense Entries</div>
              </div>
              
              <div class="p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div class="text-2xl font-bold text-amber-700 mb-1">
                  {Math.round((financials.metrics.totalTransactions / financials.metrics.totalDays) * 10) / 10}
                </div>
                <div class="text-sm text-amber-600 font-medium">Daily Avg Trans</div>
              </div>
            </div>

            <!-- Performance Indicator -->
            <div class="mt-6 p-4 {getBackgroundColor(financials.netProfit)} rounded-xl border">
              <div class="flex items-center gap-3">
                <div class="p-2 {financials.netProfit >= 0 ? 'bg-emerald-200' : 'bg-red-200'} rounded-lg">
                  <svg class="w-5 h-5 {financials.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {#if financials.netProfit >= 0}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    {:else}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                    {/if}
                  </svg>
                </div>
                <div>
                  <p class="font-semibold {getStatusColor(financials.netProfit)}">
                    {financials.netProfit >= 0 ? 'Profitable Period' : 'Loss Period'}
                  </p>
                  <p class="text-sm text-slate-600">
                    {financials.netProfit >= 0 
                      ? 'Revenue exceeded expenses this period' 
                      : 'Expenses exceeded revenue this period'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Monthly Trends -->
      {#if financials.monthlyTrends.length === 0}
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div class="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Monthly Trends Coming Soon</h3>
          <p class="text-slate-600 max-w-md mx-auto">
            Historical trend data will appear here as more data becomes available over time.
          </p>
        </div>
      {/if}

    {:else}
      <!-- Loading State -->
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600">Loading financial data...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

