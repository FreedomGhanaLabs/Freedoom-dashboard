// src/routes/setup/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ cookies }: { cookies: Cookies }) => {
  const token = cookies.get('admin_token');
  if (!token) throw redirect(303, '/login');
  return { secret: null as string | null };
};

export const actions: Actions = {
  default: async ({ cookies, fetch, request }) => {
    const token = cookies.get('admin_token');
    if (!token) return fail(401, { error: 'Not authenticated' });
    const formData = await request.formData();
    const secretState = formData.get('secretState') as string;

    const res = await fetch('https://api-freedom.com/api/v2/admin/auth/setup-totp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ enable: true })
    });

    // always log the raw status/text if anything goes wrong
    if (!res.ok) {
      const text = await res.text();
      console.error('TOTP setup failed:', res.status, text);
      return fail(res.status, { error: 'Could not enable TOTP' });
    }

    // parse and *log* the entire JSON payload
    const json = await res.json();
    console.log('✅ TOTP-setup response payload:', JSON.stringify(json, null, 2));

    const { data } = json;
    if (!data?.secret) {
      console.error('No secret returned in payload:', data);
      return fail(500, { error: 'No secret returned from server' });
    }

    // now you can watch in your server logs exactly what came back
    console.log('→ secret:', data.secret);
    // and if you’re returning an otpauth_url:
    if (data.otpauthURL) {
      console.log('→ otpauthURL:', data.otpauthURL);
    }
    console.log('→ qrCode:', data.qrCode);

    return { secret: data.secret as string, qrCode: data.qrCode as string };
  }
};
