<script lang="ts">
    import { userStore } from '$lib/userStore';
    import { goto } from '$app/navigation';
    import { ChevronLeft } from 'lucide-svelte';
    import type { User } from '$lib/userStore';
  
    let name = '';
    let email = '';
    let phone = '';
    let address = '';
    let paymentMethod = 'Card';
    let cardLast4 = '';
    let cardBrand = '';
    let cardExpiryMonth = '';
    let cardExpiryYear = '';
    let mobileMoneyProvider = '';
    let mobileMoneyNumber = '';
  
    function handleSubmit() {
      // Generate a random user ID
      const id = `USR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Create payment details based on selected payment method
      const paymentDetails = paymentMethod === 'Card' 
        ? {
            last4: cardLast4,
            brand: cardBrand,
            expiryMonth: cardExpiryMonth,
            expiryYear: cardExpiryYear
          }
        : {
            last4: mobileMoneyNumber.slice(-4),
            brand: mobileMoneyProvider,
            expiryMonth: '',
            expiryYear: ''
          };
      
      // Create saved card based on payment method
      const savedCard = paymentMethod === 'Card'
        ? {
            id: `card_${Math.floor(Math.random() * 1000)}`,
            last4: cardLast4,
            brand: cardBrand,
            expiryMonth: cardExpiryMonth,
            expiryYear: cardExpiryYear,
            isDefault: true
          }
        : {
            id: `mm_${Math.floor(Math.random() * 1000)}`,
            last4: mobileMoneyNumber.slice(-4),
            brand: mobileMoneyProvider,
            expiryMonth: '',
            expiryYear: '',
            isDefault: true,
            mobileMoneyProvider,
            mobileMoneyNumber
          };
      
      // Create new user
      const newUser: User = {
        id,
        name,
        email,
        phone,
        address,
        paymentMethod,
        paymentDetails,
        savedCards: [savedCard],
        transactions: [] // New user starts with no transactions
      };
      
      userStore.add(newUser);
      goto(`/dashboard/users/${id}`);
    }
  </script>
  
  <div class="mx-auto max-w-3xl">
    <button 
      on:click={() => goto('/dashboard/user')}
      class="mb-6 mt-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
    >
      <ChevronLeft class="h-5 w-5" />
      <span>Back to Users</span>
    </button>
  
    <div class="rounded-lg bg-white p-8 shadow-sm">
      <h1 class="mb-6 text-2xl font-semibold">Add New User</h1>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- User Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium">User Information</h2>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                bind:value={name}
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                bind:value={phone}
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                bind:value={address}
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Payment Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium">Payment Information</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  bind:group={paymentMethod} 
                  value="Card" 
                  class="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <span class="ml-2">Card</span>
              </label>
              
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  bind:group={paymentMethod} 
                  value="Mobile Money" 
                  class="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <span class="ml-2">Mobile Money</span>
              </label>
            </div>
          </div>
          
          {#if paymentMethod === 'Card'}
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="cardBrand" class="block text-sm font-medium text-gray-700">Card Brand</label>
                <select
                  id="cardBrand"
                  bind:value={cardBrand}
                  required
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                >
                  <option value="">Select Card Brand</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>
              
              <div>
                <label for="cardLast4" class="block text-sm font-medium text-gray-700">Last 4 Digits</label>
                <input
                  type="text"
                  id="cardLast4"
                  bind:value={cardLast4}
                  
                  maxlength="4"
                  pattern="[0-9]{4}"
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label for="cardExpiryMonth" class="block text-sm font-medium text-gray-700">Expiry Month</label>
                <input
                  type="text"
                  id="cardExpiryMonth"
                  bind:value={cardExpiryMonth}
                  required
                  maxlength="2"
                  pattern="[0-9]{2}"
                  placeholder="MM"
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label for="cardExpiryYear" class="block text-sm font-medium text-gray-700">Expiry Year</label>
                <input
                  type="text"
                  id="cardExpiryYear"
                  bind:value={cardExpiryYear}
                  required
                  maxlength="4"
                  pattern="[0-9]{4}"
                  placeholder="YYYY"
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
            </div>
          {:else}
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="mobileMoneyProvider" class="block text-sm font-medium text-gray-700">Mobile Money Provider</label>
                <select
                  id="mobileMoneyProvider"
                  bind:value={mobileMoneyProvider}
                  required
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                >
                  <option value="">Select Provider</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Vodafone Cash">Vodafone Cash</option>
                  <option value="AirtelTigo Money">AirtelTigo Money</option>
                </select>
              </div>
              
              <div>
                <label for="mobileMoneyNumber" class="block text-sm font-medium text-gray-700">Mobile Money Number</label>
                <input
                  type="tel"
                  id="mobileMoneyNumber"
                  bind:value={mobileMoneyNumber}
                  required
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
            </div>
          {/if}
        </div>
        
        <div class="pt-4">
          <button
            type="submit"
            class="rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>