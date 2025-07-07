<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { adminStore, type Admin } from '$lib/adminStore';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import { enhance } from '$app/forms';

  let { data }: { data: PageData } = $props();
  let isDialogOpen = $state(false);
  let firstName = $state('');
  let surName = $state('');
  let email = $state('');
  let password = $state('');
  let role = $state('admin');

  interface ApiAdmin {
    id: string;
    name: string;
    firstName: string;
    surname: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
    avatarUrl: string;
  }

  function resetForm() {
    firstName = '';
    surName = '';
    email = '';
    password = '';
    role = 'admin';
  }

  // Format an ISO timestamp into a “Month Day, Year” string
   function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  onMount(() => {
    data.admins.forEach((a: ApiAdmin) => {
      adminStore.addAdmin({
        id: a.id,
        firstName: a.firstName,
        surname: a.surname,
        otherNames: '',
        email: a.email,
        password: '',
        role: a.role,
        avatarUrl: a.avatarUrl
      } as Admin);
    });
  });
</script>

<svelte:head>
  <title>Settings  - Admin Panel</title>
</svelte:head>

<div class="bg-white text-black p-8 w-[70vw] mx-auto">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-3xl font-bold">Admins</h1>
      <p class="text-gray-800">Manage admin users and their permissions.</p>
    </div>

    <Dialog.Root bind:open={isDialogOpen}>
      <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
        Add Admin
      </Dialog.Trigger>
      <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title class="text-black">Create New Admin</Dialog.Title>
          <Dialog.Description class="text-black">
            Fill in the details to create a new admin user.
          </Dialog.Description>
        </Dialog.Header>

        <div class="grid gap-4 py-4 -mt-8 -mb-4">
          <form
            class="p-6 rounded-lg w-full max-w-md"
            use:enhance={() => {
              return ({ result }) => {
                if (result.type === 'success' && result.data?.success) {
                  const raw = result.data.newAdmin as any;
                  adminStore.addAdmin({
                    id: raw._id,
                    firstName: raw.firstName,
                    surname: raw.surname,
                    otherNames: '',
                    email: raw.email,
                    password: '',
                    role: raw.role,
                    avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(raw.email)}`
                  } as Admin);
                  isDialogOpen = false;
                  resetForm();
                }
              };
            }}
            method="POST"
          >
            <h2 class="text-xl font-semibold mb-4">New Admin</h2>
            <div class="space-y-4">
              <input
                name="firstName"
                bind:value={firstName}
                class="w-full p-2 rounded bg-gray-100 focus:outline-none focus:ring-none"
                placeholder="First name"
                required
              />
              <input
                name="surName"
                bind:value={surName}
                class="w-full p-2 rounded bg-gray-100 focus:outline-none focus:ring-none"
                placeholder="Sur name"
                required
              />
              <input
                type="email"
                name="email"
                bind:value={email}
                class="w-full p-2 rounded bg-gray-100 focus:outline-none focus:ring-none"
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                bind:value={password}
                class="w-full p-2 rounded bg-gray-100 focus:outline-none focus:ring-none"
                placeholder="Password"
                required
              />
              <select
                name="role"
                bind:value={role}
                class="w-full p-2 rounded bg-gray-100"
                required
              >
                <option value="super">super</option>
                <option value="finance">finance</option>
                <option value="support">support</option>
                <option value="operations">operations</option>
                <option value="analyst">analyst</option>
              </select>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button type="submit" class="px-4 py-2 rounded bg-green-500">
                Create
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each data.admins as admin (admin.id)}
      <div class="bg-gray-200 p-4 rounded-lg flex items-center space-x-4">
        <img
          src={admin.avatarUrl}
          alt="Avatar"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <p class="font-normal">Name: {admin.name}</p>
          <p class="text-gray-800 text-sm">Email: {admin.email}</p>
          <span class="mt-2 inline-block px-2 py-1 text-xs rounded bg-green-600">
            {admin.role}
          </span>
          <p class="font-normal">Status: {admin.status}</p>
          <!-- Use our helper to format these: -->
          <p class="font-normal">
            Created at: {formatDateTime(admin.createdAt)}
          </p>
          <p class="font-normal">
            Last login: {formatDateTime(admin.lastLogin)}
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>


	<!-- {#each $adminStore as admin (admin.id)} <p class="font-normal">Status: {admin.status}< <p class="font-normal">Status: {admin.status}</p>a/p>
			<div class="bg-gray-200 p-4 rounded-lg flex items-center space-x-4">
				<img
					src={admin.avatarUrl}
					alt="Avatar"
					class="w-12 h-12 rounded-full"
				/>
				<div>
					<p class="font-normal">First Name: {admin.firstName}</p>
					<p class="font-normal">Sur Name: {admin.surname}</p>
					<p class="font-normal">Other Names: {admin.otherNames}</p>
					<p class="text-gray-800 text-sm">Email: {admin.email}</p>
					<span class="mt-2 inline-block px-2 py-1 text-xs rounded bg-green-600">
						{admin.role}
					</span>
				</div>
			</div>
		{/each} -->