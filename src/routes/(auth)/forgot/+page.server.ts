// src/routes/forgot/+page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email');

    // basic validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return fail(400, { error: 'Please enter a valid email address.' });
    }

     // send login request
     const res = await fetch('https://api-freedom.com/api/v2/admin/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      return fail(res.status, {
        error: `Login failed (${res.status})`,
        error_email: ' '
      });
    }
    const result = await res.json();
        if (!result.success) {
          return fail(400, {
            error: result.error || 'Invalid credentials',
            error_email: ' ',
            error_password: ' '
          });
        }

    console.log(result);

    // build the confirmation‑page URL (adjust path as needed)
    // e.g. you’ve created src/routes/email-confirmation/+page.svelte
    const params = new URLSearchParams({ email });
    throw redirect(303, `/confirm?${params.toString()}`);
  }
};
