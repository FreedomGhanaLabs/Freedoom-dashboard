<script lang="ts">
  import { onMount } from 'svelte';
  import { profile } from '$lib/profileStore';
  import type { PageData } from './$types';

  // SvelteKit will inject `data` to your page automatically.
  // Because load() returned `{ profile: <object> }`, TS knows `data.profile` is that object.
  export let data: PageData;

  
  const fetched = data.profile;
 
  onMount(() => {
    profile.set({
      firstName: fetched.firstName,
      surname: fetched.surname,
      email: fetched.email,
      image: '',        
      phone: '',        
      role: fetched.role,
      about: ''         
    });
  });

  let showDialog = false;
  let editedProfile = { name: '', email: '', role: '', about: '' };

  function handleEdit() {
  
    editedProfile = { 
      name: `${$profile.firstName} ${$profile.surname}`.trim(),
      email: $profile.email,
      role: $profile.role,
      about: $profile.about
    };
    showDialog = true;
  }

  function saveProfile() {
  
    const [firstName = '', ...surnameParts] = editedProfile.name.trim().split(' ');
    const surname = surnameParts.join(' ');
    profile.set({
      firstName,
      surname,
      email: editedProfile.email,
      image: $profile.image,
      phone: $profile.phone,
      role: $profile.role,
      about: editedProfile.about
    });
    showDialog = false;
  }

  function cancelEdit() {
    showDialog = false;
  }
</script>

<svelte:head>
  <title>Profile  - Admin Panel</title>
</svelte:head>

<main class="p-6 w-[70vw] mx-auto">
  <div class="bg-white p-6 rounded-lg flex flex-row justify-between">
    <div class="flex flex-row text-gray-500 space-x-10">
      <div>
        <h2 class="text-2xl font-bold">
          First Name: <span class="text-black">{$profile.firstName}</span>
        </h2>
        <h2 class="text-2xl font-bold">
          Sur Name: <span class="text-black">{$profile.surname}</span>
        </h2>
        <p class="text-lg">
          Email: <span class="text-black">{$profile.email}</span>
        </p>
        <p class="text-lg text-orange-600">
          Admin Role: <span class="text-black">{$profile.role}</span>
        </p>
      </div>
    </div>
    <div>
      <button
        on:click={handleEdit}
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Edit Profile
      </button>
    </div>
  </div>

  {#if showDialog}
    <dialog open class="bg-white p-6 rounded-lg w-[40vw] mx-auto mt-4">
      <h3 class="text-xl font-bold mb-4">Edit Profile</h3>
      <form on:submit|preventDefault={saveProfile} class="flex flex-col gap-4">
        <label class="flex flex-col">
        <label class="flex flex-col">
          Name:
          <input
            bind:value={editedProfile.name}
            required
            class="mt-1 p-2 border rounded"
          />
        </label>
          Email:
          <input
            bind:value={editedProfile.email}
            type="email"
            required
            class="mt-1 p-2 border rounded"
          />
        </label>
        <label class="flex flex-col">
          About:
          <textarea
            bind:value={editedProfile.about}
            required
            class="mt-1 p-2 border rounded h-24"
          ></textarea>
        </label>
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            type="button"
            on:click={cancelEdit}
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  {/if}
</main>
