// src/routes/setup/enable/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('admin_token');
  if (!token) throw redirect(303, '/login');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const token = cookies.get('admin_token');
    if (!token) return fail(401, { error: 'Not authenticated' });

    const formData = await request.formData();
    const pin = formData.get('pin');

    if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) {
      return fail(400, { error: 'Please enter a valid 6-digit code.' });
    }

    const res = await fetch('https://api-freedom.com/api/v2/admin/auth/enable-totp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ token: pin })
    });

    console.log('Enable OTP response:', res);

    if (!res.ok) {
      const text = await res.text();
      console.error('Enable OTP failed:', res.status, text);
      return fail(res.status, { error: 'Invalid TOTP code.' });
    }

    // on success, return a flag your page can render
    return { success: true };
  }
};
