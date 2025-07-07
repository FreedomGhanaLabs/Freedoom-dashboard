// src/routes/dashboard/user/+page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  // 1️⃣ Ensure we have an admin JWT:
  const token = cookies.get('admin_token');
  if (!token) {
    // not logged in → bounce to login
    throw redirect(303, '/login');
  }

  // 2️⃣ Fetch all users from your API:
  const res = await fetch('https://api-freedom.com/api/v2/user/getAllUser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // 3️⃣ Handle errors:
  if (!res.ok) {
    // you can customize this message or status
    throw error(res.status, `Failed to load users (${res.status})`);
  }

  

  // 4️⃣ Pull out JSON
  const payload = await res.json();
  // assume payload.data is the array of users
  const users: any[] = payload.data ?? [];

  // console.log(payload)
  // 5️⃣ Expose to the page as `data.users`
  return { users };
};
