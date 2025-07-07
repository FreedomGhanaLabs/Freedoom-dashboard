<script lang="ts">
	import { ListFilter, Plus, Search } from 'lucide-svelte';
	import TableGroup from './TableGroup.svelte';

	import { goto } from '$app/navigation';
  
	 //  the users from the server load
	export let data: { users: any[] };
	let users = data.users;

  // table column definitions — make the `key` match your API props
  const headings = [
    { title: 'ID',           className: 'rounded-s-2xl', key: '_id' },
    { title: 'First Name',                   key: 'firstName' },
    { title: 'Last Name',                    key: 'surname'  },
    { title: 'Email',                        key: 'email'    },
    { title: 'Phone',                        key: 'phone'    },
    { title: 'Payment Method', className: 'rounded-e-2xl', key: 'paymentMethod' }
  ];

  // ③ search/filter
  let searchQuery = '';
  $: filteredUsers = searchQuery
    ? users.filter(u =>
        (u.firstName || u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.surname  || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email    || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u._id      || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

	

  // ④ row click
  function handleRowClick(user: any) {
    goto(`/dashboard/user/${user._id}`);
  }

  </script>

  <svelte:head>
  <title>User  - Admin Panel</title>
</svelte:head>
  
  <div class="mx-auto">
	<div class="my-[3rem] w-[97rem] rounded-lg bg-white">
		<div class="mt-[1rem] flex flex-row items-center justify-between px-[5rem] py-6">
			<h3 class="text-2xl">User Management</h3>
			<div class="flex flex-row items-center justify-between space-x-5">
				<form class="mx-auto max-w-md">
					<label
					  for="default-search"
					  class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label
					>
					<div class="relative">
					  <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
						<Search class="h-4 w-4 text-gray-500" />
					  </div>
					  <input
						type="search"
						id="default-search"
						bind:value={searchQuery}
						class="block w-fit max-w-52 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none "
						placeholder="Search"
					  />
					</div>
				  </form>

				<button
					class="flex flex-row items-center justify-center space-x-3 rounded-lg border border-gray-500 bg-white px-5 py-3 text-gray-600"
				>
					<ListFilter />
					<h4>Filter</h4>
				</button>
			</div>
		</div>
		<TableGroup {headings} invoices={filteredUsers} />
	</div>
</div>
