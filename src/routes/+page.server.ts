// src/routes/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');

    // basic validation...
    const errors: Record<string,string> = {};
    if (typeof email !== 'string' || !email.includes('@')) {
      errors.error_email = 'Please enter a valid email.';
    }
    if (typeof password !== 'string' || !password) {
      errors.error_password = 'Please enter your password.';
    }
    if (Object.keys(errors).length) {
      return fail(400, errors);
    }

    // send login request
    const res = await fetch('https://api-freedom.com/api/v2/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

 
    if (!res.ok) {
      return fail(res.status, {
        error: `Login failed (${res.status})`,
        error_email: ' ',
        error_password: ' '
      });
    }

    const result = await res.json();
    console.log('Login response:', result);
    if (!result.success) {
      return fail(400, {
        error: result.error || 'Invalid credentials',
        error_email: ' ',
        error_password: ' '
      });
    }
   

    // --- CASE A: New user, needs to *set up* TOTP ---
    if (result.data?.totpEnabled === false || result.totpEnabled === false) {
      // stash token so setup page can call setup-totp
      cookies.set('admin_token', result.token, {
        path: '/', httpOnly: true, sameSite: 'strict', secure: true
      });
      throw redirect(303, '/setup');
    }

    // --- CASE B: Already set up, needs to *verify* via OTP ---
    if (result.success && result.totpRequired) {
      cookies.set('temp_admin_jwt', result.token, {
        path: '/', httpOnly: true, sameSite: 'strict', secure: true
      });
      cookies.set('temp_admin_id', result.id, { path: '/', httpOnly: false });
      throw redirect(303, '/otp');
    }

    // --- CASE C: No 2FA at all, full login ---
    cookies.set('admin_token', result.token, {
      path: '/', httpOnly: true, sameSite: 'strict', secure: true
    });

    console.log('cookies', cookies);
    throw redirect(303, '/dashboard');
  }
};

