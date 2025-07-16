
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
  const token = cookies.get('admin_token');
  if (!token) {
	throw redirect(303, '/');
  }

  const page = Number(url.searchParams.get('page') ?? '1');

  const res = await fetch(`https://api-freedom.com/api/v2/admins/rides?page=${page}`, {
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

	return {
		ride: payload.data ?? [],
		currentPage: payload.currentPage ?? page,
		totalPages: payload.totalPages ?? 1
	};
};


