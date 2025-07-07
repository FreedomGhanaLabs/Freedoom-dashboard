<script lang="ts">
  import { goto } from '$app/navigation';
  import { ChevronLeft, Mail, Phone, Home, CreditCard, Clock, Check, X, AlertCircle, Calendar, TrendingUp } from 'lucide-svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import type { User } from '$lib/userStore';

  export let data: { user: User };
  const user = data.user;

  function formatDate(ts: string) {
    return new Date(ts).toLocaleString();
  }

  function goBack() {
    goto('/dashboard/user');
  }

  // Get status icon and color for transactions
  function getStatusIcon(status: string) {
    switch (status) {
      case 'successful':
        return { icon: Check, class: 'text-green-600' };
      case 'failed':
        return { icon: X, class: 'text-red-600' };
      case 'pending':
        return { icon: Clock, class: 'text-yellow-600' };
      default:
        return { icon: AlertCircle, class: 'text-gray-600' };
    }
  }
</script>

<div class="mx-auto w-3/4">
  <button on:click={goBack} class="mt-6 mb-8 flex items-center text-gray-600 hover:text-gray-900">
    <ChevronLeft class="h-5 w-5" /> <span>Back to Users</span>
  </button>

  <div class="bg-white rounded-lg shadow p-8 space-y-8">
    <header>
      <h1 class="text-3xl font-semibold">{user.firstName} {user.surname}</h1>
      <p class="text-gray-500">User ID: {user._id}</p>
      <div class="flex gap-4 mt-2 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <Calendar class="h-4 w-4" />
          <span>Created: {formatDate(user.createdAt)}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="h-4 w-4" />
          <span>Updated: {formatDate(user.updatedAt)}</span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- User Info -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-xl font-semibold">User Information</h2>
        <div class="flex items-center gap-4">
          <Mail class="h-5 w-5 text-gray-500" />
          <p>{user.email}</p>
        </div>
        <div class="flex items-center gap-4">
          <Phone class="h-5 w-5 text-gray-500" />
          <p>{user.phone}</p>
        </div>
        <div class="flex items-center gap-4">
          <CreditCard class="h-5 w-5 text-gray-500" />
          <p class="capitalize">{user.paymentMethod}</p>
        </div>
      </section>

      <!-- Transaction Stats -->
      <section class="border rounded-lg p-6 space-y-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <TrendingUp class="h-5 w-5" />
          Transaction Statistics
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-2xl font-bold text-blue-600">{user.transactionStats?.total || 0}</p>
            <p class="text-sm text-blue-600">Total Transactions</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-2xl font-bold text-green-600">{user.transactionStats?.successful || 0}</p>
            <p class="text-sm text-green-600">Successful</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4">
            <p class="text-2xl font-bold text-red-600">{user.transactionStats?.failed || 0}</p>
            <p class="text-sm text-red-600">Failed</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <p class="text-2xl font-bold text-yellow-600">{user.transactionStats?.pending || 0}</p>
            <p class="text-sm text-yellow-600">Pending</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Payment Details -->
    <section class="border rounded-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold">Payment Details</h2>
      
      <!-- Default Card -->
      {#if user.paymentDetails?.defaultCard}
        <div>
          <p class="text-sm font-medium text-gray-500 mb-2">Default Payment Method</p>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium">{user.paymentDetails.defaultCard.brand} •••• {user.paymentDetails.defaultCard.last4}</p>
            <p class="text-sm text-gray-500">
              Expires {user.paymentDetails.defaultCard.expiryMonth}/{user.paymentDetails.defaultCard.expiryYear}
            </p>
          </div>
        </div>
      {:else}
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-500">No default payment method set</p>
        </div>
      {/if}

      <!-- Mobile Money Provider -->
      {#if user.paymentDetails?.mobileMoneyProvider}
        <div>
          <p class="text-sm font-medium text-gray-500 mb-2">Mobile Money Provider</p>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium">{user.paymentDetails.mobileMoneyProvider}</p>
          </div>
        </div>
      {/if}

      <!-- Saved Cards -->
      <div>
        <h3 class="font-medium mb-3">Saved Payment Methods</h3>
        {#if user.paymentDetails?.savedCards && user.paymentDetails.savedCards.length > 0}
          <div class="space-y-3">
            {#each user.paymentDetails.savedCards as card}
              <div class="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p class="font-medium">
                    {card.brand}{card.mobileMoneyProvider ? '' : ` •••• ${card.last4}`}
                  </p>
                  {#if card.mobileMoneyProvider}
                    <p class="text-sm text-gray-500">{card.mobileMoneyNumber}</p>
                  {:else}
                    <p class="text-sm text-gray-500">
                      Expires {card.expiryMonth}/{card.expiryYear}
                    </p>
                  {/if}
                </div>
                {#if card.isDefault}
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Default</span>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-500">No saved payment methods</p>
          </div>
        {/if}
      </div>
    </section>

    <!-- Recent Transactions -->
    <section class="border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Transactions</h2>
      {#if user.transactions && user.transactions.length > 0}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Transaction ID</Table.Head>
              <Table.Head>Amount</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head>Description</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each user.transactions as transaction}
              <Table.Row>
                <Table.Cell class="font-mono text-sm">{transaction.id || transaction._id}</Table.Cell>
                <Table.Cell class="font-medium">
                  {transaction.currency || 'GHS'} {transaction.amount}
                </Table.Cell>
                <Table.Cell>
                  {#if transaction.status}
                    {@const statusInfo = getStatusIcon(transaction.status)}
                    <div class="flex items-center gap-2">
                      <svelte:component this={statusInfo.icon} class="h-4 w-4 {statusInfo.class}" />
                      <span class="capitalize {statusInfo.class}">{transaction.status}</span>
                    </div>
                  {/if}
                </Table.Cell>
                <Table.Cell>{formatDate(transaction.createdAt || transaction.date || '')}</Table.Cell>
                <Table.Cell class="text-gray-600">{transaction.description || 'N/A'}</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {:else}
        <div class="bg-gray-50 rounded-lg p-8 text-center">
          <AlertCircle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No transactions found for this user</p>
        </div>
      {/if}
    </section>
  </div>
</div>