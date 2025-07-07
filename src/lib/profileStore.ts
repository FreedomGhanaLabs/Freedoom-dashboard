import { writable } from 'svelte/store';
import Avatar from '$lib/assets/account-avatar-profile-user.svg'


export const profile = writable({
  firstName: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  image: Avatar,
  phone: '+1 (555) 123-4567',
  role: 'Super Admin',
  about: 'Manage the system and other administrators.'
});