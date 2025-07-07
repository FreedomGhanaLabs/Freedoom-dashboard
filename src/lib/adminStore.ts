import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Admin {
  id: string;
  firstName: string;
  surname: string;
  otherNames: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
}

function createAdminStore() {
  // Default admin data for server-side rendering
  const defaultAdmins: Admin[] = [{
    id: crypto.randomUUID(),
    firstName: 'John',
    surname: 'Doe',
    otherNames: 'Kwame',
    email: 'john@example.com',
    password: '••••••••',
    role: 'Super Admin',
    avatarUrl: 'https://i.pravatar.cc/150?img=3'
  }];

  const { subscribe, set, update } = writable<Admin[]>(defaultAdmins);

  // Only access localStorage in the browser
  if (browser) {
    // Load existing data from localStorage
    const storedData = localStorage.getItem('admins');
    if (storedData) {
      try {
        const storedAdmins = JSON.parse(storedData);
        set(storedAdmins);
      } catch (error) {
        console.error('Error parsing admins from local storage:', error);
      }
    }

    // Save to localStorage whenever the store updates
    subscribe(admins => {
      localStorage.setItem('admins', JSON.stringify(admins));
    });
  }

  return {
    subscribe,
    addAdmin: (admin: Omit<Admin, 'id'>) => {
      update(admins => [...admins, { id: crypto.randomUUID(), ...admin }]);
    }
  };
}

export const adminStore = createAdminStore();