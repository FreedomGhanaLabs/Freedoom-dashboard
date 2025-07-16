
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) {
    throw redirect(303, '/');
  }

  const res = await fetch('https://api-freedom.com/api/v2/admins/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw error(res.status, `Failed to load users (${res.status})`);
  }

  
  const json = await res.json();
  const profileObj = json.data; 

  return { profile: profileObj };
};
