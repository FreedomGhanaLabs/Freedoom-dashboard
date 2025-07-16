
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('admin_token');
  if (!token) {
    throw redirect(303, '/');
  }

  const res = await fetch('https://api-freedom.com/api/v2/admin/commission/financials', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw error(res.status, `Failed to load users (${res.status})`);
  }

  const payload = await res.json();
  const financials: any[] = payload.data ?? [];

  
  return { financials };
};


