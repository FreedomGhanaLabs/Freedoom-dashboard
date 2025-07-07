// src/routes/dashboard/user/+page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) {
    throw redirect(303, '/login');
  }

  const res = await fetch('https://api-freedom.com/api/v2/admins/operations', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  //  Handle errors:
  if (!res.ok) {
    throw error(res.status, `Failed to load users (${res.status})`);
  }
  

  const payload = await res.json();
  const operations: any[] = payload.data ?? [];

  // console.log('✅ [server] get operations payload:', payload);

  return { operations };
};


