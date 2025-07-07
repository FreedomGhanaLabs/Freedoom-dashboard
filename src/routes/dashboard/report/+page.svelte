<!-- src/routes/dashboard/user/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: analytics = data.analytics as Record<string, any>;
  
  // Helper functions
  function formatCurrency(amount: number, currency: string = 'GHS'): string {
    const formatted = new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency || 'GHS'
    }).format(amount);
    
    // Add space between currency symbol and amount
    return formatted.replace(/^([^\d]+)/, '$1 ');
  }
  
  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function formatPercentage(value: string | number): string {
    return `${parseFloat(value.toString()).toFixed(1)}%`;
  }
  
  function formatPhoneNumber(phone: string): string {
    if (!phone) return 'N/A';
    return phone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  
  // Calculate additional metrics
  $: averageRideValue = analytics?.summary?.rides?.total > 0 
    ? analytics.summary.financial.totalRevenue / analytics.summary.rides.total 
    : 0;
  
 $: recentFinancialData = analytics?.timeSeriesData?.financial
    ?.slice(-15) // Last 15 entries
    ?.sort((a: { _id: string | number | Date; }, b: { _id: string | number | Date; }) => new Date(a._id).getTime() - new Date(b._id).getTime()) || [];
</script>

<svelte:head>
  <title>Analytics - Admin Panel</title>
</svelte:head>

<div class="min-h-screen w-[75vw] mx-auto p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
      <p class="text-gray-600">
        Platform performance overview from {analytics?.periodStart || 'all time'} to {analytics?.periodEnd || 'present'}
      </p>
    </div>

    {#if analytics}
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900">{analytics.summary.totalUsers}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Drivers -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Drivers</p>
              <p class="text-3xl font-bold text-gray-900">{analytics.summary.totalDrivers}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Rides -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Rides</p>
              <p class="text-3xl font-bold text-gray-900">{analytics.summary.rides.total}</p>
              <p class="text-sm text-gray-500 mt-1">
                {analytics.summary.rides.completed} completed, {analytics.summary.rides.cancelled} cancelled
              </p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900">
                {formatCurrency(analytics.summary.financial.totalRevenue, analytics.summary.financial.currency)}
              </p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Overview & Completion Rate -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Financial Breakdown -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Platform Commission</span>
              <span class="font-semibold text-gray-900">
                {formatCurrency(analytics.summary.financial.platformCommission, analytics.summary.financial.currency)}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Driver Earnings</span>
              <span class="font-semibold text-gray-900">
                {formatCurrency(analytics.summary.financial.driverEarnings, analytics.summary.financial.currency)}
              </span>
            </div>
            <div class="flex justify-between items-center border-t pt-4">
              <span class="text-gray-600">Average Ride Value</span>
              <span class="font-semibold text-gray-900">
                {formatCurrency(averageRideValue, analytics.summary.financial.currency)}
              </span>
            </div>
          </div>
        </div>

        <!-- Ride Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ride Performance</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Completion Rate</span>
                <span class="font-semibold text-gray-900">
                  {formatPercentage(analytics.summary.rides.completionRate)}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style="width: {analytics.summary.rides.completionRate}%"
                ></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">{analytics.summary.rides.completed}</p>
                <p class="text-sm text-gray-600">Completed</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-red-600">{analytics.summary.rides.cancelled}</p>
                <p class="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- New Users -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent User Growth</h3>
          <div class="space-y-3">
            {#each analytics.timeSeriesData.users as userDay}
              <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span class="text-gray-600">{formatDate(userDay._id)}</span>
                <span class="font-semibold text-blue-600">+{userDay.newUsers} users</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- New Drivers -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Driver Onboarding</h3>
          <div class="space-y-3">
            {#each analytics.timeSeriesData.drivers as driverDay}
              <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span class="text-gray-600">{formatDate(driverDay._id)}</span>
                <div class="text-right">
                  <span class="font-semibold text-green-600">+{driverDay.newDrivers} new</span>
                  <span class="text-sm text-gray-500 block">{driverDay.approvedDrivers} approved</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Top Drivers -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Drivers</h3>
        <div class="overflow-x-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Driver ID</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Total Rides</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Earnings</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {#each analytics.topDrivers as driver}
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm font-mono text-gray-600">
                    {driver.driverId.slice(-8)}...
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {formatPhoneNumber(driver.phone)}
                  </td>
                  <td class="py-3 px-4 text-sm font-semibold text-gray-900">
                    {driver.totalRides}
                  </td>
                  <td class="py-3 px-4 text-sm font-semibold text-green-600">
                    {formatCurrency(driver.totalEarnings, analytics.summary.financial.currency)}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {#if driver.avgRating}
                      <div class="flex items-center">
                        <span class="mr-1">{driver.avgRating}</span>
                        <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    {:else}
                      <span class="text-gray-400">No rating</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Popular Routes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
        <div class="overflow-x-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Route</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Rides</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Avg Fare</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-900">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {#each analytics.popularRoutes as route}
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm text-gray-900 max-w-xs">
                    <div class="truncate">
                      <strong>From:</strong> {route._id.pickup}
                    </div>
                    <div class="truncate text-gray-600">
                      <strong>To:</strong> {route._id.dropoff}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm font-semibold text-gray-900">
                    {route.count}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900">
                    {formatCurrency(route.avgFare, analytics.summary.financial.currency)}
                  </td>
                  <td class="py-3 px-4 text-sm font-semibold text-green-600">
                    {formatCurrency(route.totalRevenue, analytics.summary.financial.currency)}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      
      <!-- Recent Financial Activity -->
      {#if recentFinancialData.length > 0}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Financial Activity</h3>
          <div class="overflow-x-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-900">Driver Earnings</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-900">Platform Commission</th>
                  <th class="text-left py-3 px-4 font-semibold text-gray-900">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {#each recentFinancialData as day}
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm text-gray-900">
                      <div class="flex items-center">
                        <span class="font-medium">{formatDate(day._id)}</span>
                        {#if day.platformCommission > 0}
                          <span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        {/if}
                      </div>
                    </td>
                    <td class="py-3 px-4 text-sm font-semibold text-blue-600">
                      {formatCurrency(day.driverEarnings, analytics.summary.financial.currency)}
                    </td>
                    <td class="py-3 px-4 text-sm font-semibold text-purple-600">
                      {formatCurrency(day.platformCommission, analytics.summary.financial.currency)}
                    </td>
                    <td class="py-3 px-4 text-sm font-semibold text-green-600">
                      {formatCurrency(day.totalRevenue, analytics.summary.financial.currency)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}


    {:else}
      <!-- Loading State -->
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    {/if}
  </div>
</div>