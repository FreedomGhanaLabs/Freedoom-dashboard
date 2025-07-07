<script lang="ts">
  import type { PageData } from './$types';
  import { formatDistance } from 'date-fns';
  
  export let data: PageData;
  
  
  $: transaction = data.transaction;
  
  // Format currency
  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }
  
  // Format date
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Get relative time
  function getRelativeTime(dateString: string) {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  }
  
  // Get status color
  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'successful': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
  
  // Get payment method icon
  function getPaymentIcon(method: string) {
    switch (method.toLowerCase()) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'bank': return '🏦';
      case 'wallet': return '👛';
      default: return '💰';
    }
  }
  
  // Truncate address for display
  function truncateAddress(address: string, maxLength: number = 50) {
    return address.length > maxLength ? address.substring(0, maxLength) + '...' : address;
  }
</script>

<svelte:head>
  <title>Transaction Details - {transaction.transaction?.reference || 'Unknown'}</title>
</svelte:head>

<div class="mt-8 flex justify-left ml-[10rem] mb-4">
      <button 
        on:click={() => window.history.back()}
        class=""
      >
        <span class="mr-2">←</span>
        Back to Transactions
      </button>
    </div>
<div class="min-h-screen w-[70vw] rounded-2xl bg-white mx-auto bg-gradient-to-br p-4 sm:p-6 lg:p-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Transaction Details</h1>
          <p class="text-gray-600">Complete transaction information and history</p>
        </div>
        <div class="hidden sm:flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm text-gray-500">Transaction ID</p>
            <p class="font-mono text-md text-gray-900">{transaction.transaction?.id}</p>
          </div>
        </div>
      </div>
    </div>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Transaction Card -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Transaction Overview -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">
                  {formatCurrency(transaction.transaction?.amount || 0, transaction.transaction?.currency || 'USD')}
                </h2>
                <p class="text-blue-100 text-sm">
                  {getRelativeTime(transaction.transaction?.createdAt || new Date().toISOString())}
                </p>
              </div>
              <div class="text-right">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-2xl">{getPaymentIcon(transaction.transaction?.paymentMethod || '')}</span>
                  <span class="text-lg font-semibold capitalize">{transaction.transaction?.paymentMethod}</span>
                </div>
                <div class="inline-flex items-center px-3 py-1 rounded-2xl bg-white text-sm font-medium border
                  {getStatusColor(transaction.transaction?.status || '')}">
                  {transaction.transaction?.status?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Reference</p>
                <p class="font-mono text-sm text-gray-900 break-all">{transaction.transaction?.reference}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Service Type</p>
                <p class="font-medium text-gray-900 capitalize">
                  {transaction.transaction?.metadata?.serviceType || 'Unknown'} 
                  {transaction.transaction?.metadata?.type === 'service_payment' ? 'Service' : ''}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Created</p>
                <p class="text-sm text-gray-900">{formatDate(transaction.transaction?.createdAt || '')}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Updated</p>
                <p class="text-sm text-gray-900">{formatDate(transaction.transaction?.updatedAt || '')}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ride Details -->
        {#if transaction.ride}
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
              <h3 class="text-xl font-bold flex items-center">
                <span class="mr-2">🚗</span>
                Ride Details
              </h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <!-- Pickup Location -->
                <div class="flex items-start space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 mb-1">Pickup Location</p>
                    <p class="text-gray-900 font-medium">
                      {transaction.ride.pickupLocation?.address || 'Address not available'}
                    </p>
                  </div>
                </div>
                
                <!-- Route Line -->
                <div class="ml-1.5 w-0.5 h-8 bg-gray-300"></div>
                
                <!-- Dropoff Location -->
                <div class="flex items-start space-x-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 mb-1">Dropoff Location</p>
                    <p class="text-gray-900 font-medium">
                      {transaction.ride.dropoffLocation?.address || 'Address not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- User Information -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <h3 class="text-lg font-bold flex items-center">
              <span class="mr-2">👤</span>
              User Information
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">User ID</p>
              <p class="font-mono text-sm text-gray-900 break-all">{transaction.user?._id}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Email</p>
              <p class="text-sm text-gray-900 break-all">{transaction.user?.email}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Phone</p>
              <p class="text-sm text-gray-900">{transaction.user?.phone}</p>
            </div>
          </div>
        </div>


        <!-- Delivery Status -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white">
            <h3 class="text-lg font-bold flex items-center">
              <span class="mr-2">📦</span>
              Delivery Status
            </h3>
          </div>
          <div class="p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">📭</span>
              </div>
              <p class="text-gray-600 text-sm">
                {transaction.delivery === null ? 'No delivery associated' : 'Delivery information available'}
              </p>
            </div>
          </div>
        </div>

          <!-- Transaction Summary -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
            <h3 class="text-lg font-bold flex items-center">
              <span class="mr-2">📊</span>
              Summary
            </h3>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Amount</span>
              <span class="font-bold text-gray-900">
                {formatCurrency(transaction.transaction?.amount || 0, transaction.transaction?.currency || 'USD')}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Method</span>
              <span class="font-medium text-gray-900 capitalize">{transaction.transaction?.paymentMethod}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Status</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-[0.87rem] font-medium
                {getStatusColor(transaction.transaction?.status || '')}">
                {transaction.transaction?.status?.toUpperCase()}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Service</span>
              <span class="font-medium text-gray-900 capitalize">
                {transaction.transaction?.metadata?.serviceType || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
