<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { ArrowLeft, BookA, MapPin, MapPinCheck, Timer, TimerReset } from 'lucide-svelte';
    import { getFinanceReportById, type FinanceReportType } from '$lib/financeStore';

    $: transactionId = $page.params.id;
    let transaction: FinanceReportType | undefined;

    onMount(() => {
        fetchTransactionDetails(transactionId);
    });

    function fetchTransactionDetails(id: string) {
        transaction = getFinanceReportById(id);
    }

    function goBack() {
        window.history.back();
    }

   
    const timeline = [
        { icon: BookA, label: 'Ride type', getValue: (t: FinanceReportType) => t.type },
        { icon: Timer, label: 'Ride Ordered', getValue: (t: FinanceReportType) => t.time },
        { icon: TimerReset, label: 'Ride Ended', getValue: (t: FinanceReportType) => {
            const [time, period] = t.time.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            const durationParts = t.rideDuration.split(' ');
            let totalMinutes = minutes;
            durationParts.forEach((part, i) => {
                if (part === 'hours' || part === 'hour') totalMinutes += parseInt(durationParts[i-1]) * 60;
                if (part === 'mins' || part === 'min') totalMinutes += parseInt(durationParts[i-1]);
            });
            const endHours = Math.floor((hours * 60 + totalMinutes) / 60) % 12 || 12;
            const endMinutes = (totalMinutes % 60).toString().padStart(2, '0');
            const endPeriod = (hours + Math.floor((totalMinutes + hours * 60) / 720)) % 2 ? 'pm' : 'am';
            return `${endHours}:${endMinutes} ${endPeriod}`;
        }},
        { icon: MapPin, label: 'Pick Up', getValue: (t: FinanceReportType) => t.pickup },
        { icon: MapPinCheck, label: 'Drop Off', getValue: (t: FinanceReportType) => t.dropOff }
    ];
</script>

{#if transaction}
    <div class="mx-auto max-w-[80vw] p-4">
        <div class="mb-6 flex items-center">
            <button class="mr-4 flex items-center text-gray-600" on:click={goBack}>
                <ArrowLeft class="mr-1" size={20} />
                <span>Back to Accounts</span>
            </button>
            <h1 class="text-2xl font-bold">Transaction {transaction.id}</h1>
        </div>
        
        <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="col-span-2 rounded-lg border bg-white p-8 shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Transaction Details</h2>
                </div>
                <div class="mb-4">
                    <span class="text-sm text-gray-500">Created: {transaction.time} {transaction.date}</span>
                </div>
                <section class="flex justify-between space-x-2 mt-4">
                    {#each timeline as item}
                        <div class="flex px-4 py-3 border border-gray-300 gap-2 items-center rounded-xl">
                            <svelte:component this={item.icon} class="size-10" />
                            <p class="text-md flex flex-col text-gray-900">
                                {item.label}
                                <span class="text-md text-gray-400">{item.getValue(transaction)}</span>
                            </p>
                        </div>
                    {/each}
                </section>
                <p class="mt-5 text-gray-900">Driver Name: <span class="text-gray-700">{transaction.driverName}</span></p>
                <p class="mt-2 text-gray-900">Amount Paid: <span class="text-gray-700">{transaction.amount}</span></p>
                <p class="mt-2 text-gray-900">Mode of Payment: <span class="text-gray-700">{transaction.payment}</span></p>
            </div>

            <div class="rounded-lg border bg-white p-6 shadow-sm">
                <h2 class="mb-4 text-xl font-semibold">Customer Information</h2>
                <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">Name</h3>
                    <p class="text-gray-900">{transaction.user}</p>
                </div>
                <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p class="text-gray-900">{transaction.phone}</p>
                </div>
                <div class="mb-4">
                    <h3 class="text-sm font-medium text-gray-500">Email</h3>
                    <p class="text-gray-900">{transaction.email}</p>
                </div>
                            
                <div class="mt-6">
                    <h3 class="mb-2 text-sm font-medium text-gray-500">Quick Actions</h3>
                    <div class="space-y-2">
                        <button class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            View Customer Profile
                        </button>
                        <button class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Send Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="mx-auto max-w-[75vw] p-4">
        <p>Transaction not found</p>
    </div>
{/if}