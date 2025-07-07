<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { PageData } from './$types';

  export let data: PageData;

  let commission = data.commission;

  let formData = { ...commission };
  let isEditing = false;

  function toggleEdit() {
    isEditing = !isEditing;
    if (!isEditing) {
      formData = { ...commission };
    }
  }

  const handleCommissionResult: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === 'success' && result.data?.success) {
        commission = result.data.commissionConfig;
        formData = { ...commission };
        isEditing = false;
        toast.success('Commission configuration updated successfully');
      } else {
        toast.error('Failed to update commission configuration');
      }
      await update();
    };
  };

  let amount = 0;
  let category = '';
  let description = '';
  let reference = '';
  let currency = 'GHS';

  const handleExpenseResult: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === 'success' && result.data?.success) {
        toast.success('Expense recorded successfully');
        amount = 0;
        category = '';
        description = '';
        reference = '';
        currency = 'GHS';
      } else {
        toast.error('Failed to record expense');
      }
      await update();
    };
  };
</script>

<svelte:head>
  <title>Commissions - Admin Panel</title>
</svelte:head>

<!-- Commission Configuration Section -->
<div class="min-h-screen  py-8">
  <div class="mx-auto max-w-6xl px-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl  border border-gray-200 p-8">
        <div>
          <h1 class="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Commission Configuration
          </h1>
          <p class="text-gray-600 mt-2">Manage your commission rates and fee structures</p>
        </div>
        <button
          on:click={toggleEdit}
          class="group px-6 py-3 bg-orange-400 text-white rounded-xl flex items-center gap-3 font-medium transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isEditing}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            {/if}
          </svg>
          {#if isEditing}
            Cancel
          {:else}
            Edit Configuration
          {/if}
        </button>
      </div>
    </div>

    <!-- Main Configuration Form -->
    <div class="bg-white  rounded-3xl border border-gray-200 overflow-hidden">
      <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <h2 class="text-2xl font-bold text-white">Configuration Settings</h2>
      </div>
      
      <div class="p-8">
        <form method="POST" use:enhance={handleCommissionResult}>
          <input type="hidden" name="formType" value="commission" />
          <input type="hidden" name="commissionData" value={JSON.stringify(formData)} />
          
          <div class="space-y-12">
            <!-- Default Rates Section -->
            <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-8 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Default Rates</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Company (%)</label>
                  <div class="relative">
                    <input
                      type="number"
                      bind:value={formData.defaultRates.company}
                      disabled={!isEditing}
                      min="0"
                      max="100"
                      name="commissionData.defaultRates.company"
                      class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      style="background: linear-gradient(
                        to right,
                        rgba(59,130,246,0.1) {formData.defaultRates.company}%,
                        transparent {formData.defaultRates.company}%
                      )"
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-blue-600">
                      {formData.defaultRates.company}%
                    </div>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver (%)</label>
                  <div class="relative">
                    <input
                      type="number"
                      bind:value={formData.defaultRates.driver}
                      disabled={!isEditing}
                      min="0"
                      max="100"
                      name="commissionData.defaultRates.driver"
                      class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      style="background: linear-gradient(
                        to right,
                        rgba(59,130,246,0.1) {formData.defaultRates.driver}%,
                        transparent {formData.defaultRates.driver}%
                      )"
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-blue-600">
                      {formData.defaultRates.driver}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method Rates Section -->
            <div class="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-8 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Payment Method Rates</h2>
              </div>
              
              <div class="space-y-6">
                {#each Object.entries(formData.paymentMethodRates) as [method, rates]}
                  <div class="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 class="text-lg font-bold text-gray-800 capitalize mb-4 flex items-center gap-2">
                      <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {method}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Company (%)</label>
                        <div class="relative">
                          <input
                            type="number"
                            bind:value={formData.paymentMethodRates[method].company}
                            disabled={!isEditing}
                            min="0"
                            max="100"
                            name={`commissionData.paymentMethodRates.${method}.company`}
                            class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                            style="background: linear-gradient(
                              to right,
                              rgba(16,185,129,0.1) {formData.paymentMethodRates[method].company}%,
                              transparent {formData.paymentMethodRates[method].company}%
                            )"
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-emerald-600">
                            {formData.paymentMethodRates[method].company}%
                          </div>
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver (%)</label>
                        <div class="relative">
                          <input
                            type="number"
                            bind:value={formData.paymentMethodRates[method].driver}
                            disabled={!isEditing}
                            min="0"
                            max="100"
                            name={`commissionData.paymentMethodRates.${method}.driver`}
                            class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                            style="background: linear-gradient(
                              to right,
                              rgba(16,185,129,0.1) {formData.paymentMethodRates[method].driver}%,
                              transparent {formData.paymentMethodRates[method].driver}%
                            )"
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-emerald-600">
                            {formData.paymentMethodRates[method].driver}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Service Type Rates Section -->
            <div class="bg-linear-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-8 bg-linear-to-b from-purple-500 to-violet-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Service Type Rates</h2>
              </div>
              
              <div class="space-y-6">
                {#each Object.entries(formData.serviceTypeRates) as [type, rates]}
                  <div class="bg-white rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 class="text-lg font-bold text-gray-800 capitalize mb-4 flex items-center gap-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {type}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Company (%)</label>
                        <div class="relative">
                          <input
                            type="number"
                            bind:value={formData.serviceTypeRates[type].company}
                            disabled={!isEditing}
                            min="0"
                            max="100"
                            name={`commissionData.serviceTypeRates.${type}.company`}
                            class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                            style="background: linear-gradient(
                              to right,
                              rgba(147,51,234,0.1) {formData.serviceTypeRates[type].company}%,
                              transparent {formData.serviceTypeRates[type].company}%
                            )"
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-purple-600">
                            {formData.serviceTypeRates[type].company}%
                          </div>
                        </div>
                      </div>
                      
                      <div class="space-y-3">
                        <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Driver (%)</label>
                        <div class="relative">
                          <input
                            type="number"
                            bind:value={formData.serviceTypeRates[type].driver}
                            disabled={!isEditing}
                            min="0"
                            max="100"
                            name={`commissionData.serviceTypeRates.${type}.driver`}
                            class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                            style="background: linear-gradient(
                              to right,
                              rgba(147,51,234,0.1) {formData.serviceTypeRates[type].driver}%,
                              transparent {formData.serviceTypeRates[type].driver}%
                            )"
                          />
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-purple-600">
                            {formData.serviceTypeRates[type].driver}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Fees Section -->
            <div class="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-8 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Fees</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Platform Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    bind:value={formData.fees.PLATFORM_FEE}
                    disabled={!isEditing}
                    min="0"
                    name="commissionData.fees.PLATFORM_FEE"
                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>
                
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Processing Fee (%)</label>
                  <div class="relative">
                    <input
                      type="number"
                      step="0.01"
                      bind:value={formData.fees.PROCESSING_FEE_PERCENTAGE}
                      disabled={!isEditing}
                      min="0"
                      max="10"
                      name="commissionData.fees.PROCESSING_FEE_PERCENTAGE"
                      class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      style="background: linear-gradient(
                        to right,
                        rgba(245,158,11,0.1) {formData.fees.PROCESSING_FEE_PERCENTAGE * 10}%,
                        transparent {formData.fees.PROCESSING_FEE_PERCENTAGE * 10}%
                      )"
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-amber-600">
                      {formData.fees.PROCESSING_FEE_PERCENTAGE}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Minimum Threshold Section -->
            <div class="bg-linear-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-8 bg-linear-to-b from-rose-500 to-pink-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Minimum Threshold</h2>
              </div>
              
              <div class="max-w-md">
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Threshold (GHS)</label>
                  <input
                    type="number"
                    step="0.01"
                    bind:value={formData.minimumThreshold}
                    disabled={!isEditing}
                    min="0"
                    name="commissionData.minimumThreshold"
                    class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {#if isEditing}
            <div class="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
              <button
                type="button"
                on:click={toggleEdit}
                class="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          {/if}
        </form>
      </div>
    </div>

    <!-- Company Expense Section -->
    <div class="mt-12 bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div class="bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-6">
        <h2 class="text-2xl font-bold text-white">Record a Company Expense</h2>
        <p class="text-emerald-100 mt-1">Track and manage your company expenditures</p>
      </div>
      
      <div class="p-8">
        <form method="POST" use:enhance={handleExpenseResult} class="space-y-8">
          <input type="hidden" name="formType" value="expense" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Amount -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Amount (GHS)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                bind:value={amount}
                required
                class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium"
                placeholder="0.00"
              />
            </div>

            <!-- Category -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Category</label>
              <select
                name="category"
                bind:value={category}
                class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium bg-white"
              >
                <option value="">Select a category</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="technology">Technology</option>
                <option value="salaries">Salaries</option>
                <option value="office">Office</option>
                <option value="legal">Legal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</label>
            <textarea
              name="description"
              bind:value={description}
              required
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium resize-none"
              placeholder="Describe the expense..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Reference -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Reference</label>
              <input
                type="text"
                name="reference"
                bind:value={reference}
                required
                class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium"
                placeholder="Reference number or ID"
              />
            </div>

            <!-- Currency -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Currency</label>
              <select
                name="currency"
                bind:value={currency}
                class="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-medium bg-white"
              >
                <option value="GHS">GHS - Ghana Cedi</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-8 border-t border-gray-200">
            <button
              type="submit"
              class="group px-8 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3"
            >
              <svg class="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>