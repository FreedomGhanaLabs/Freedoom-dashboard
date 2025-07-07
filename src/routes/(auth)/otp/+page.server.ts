// src/routes/otp/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const tempJwt = cookies.get('temp_admin_jwt');
  if (!tempJwt) throw redirect(303, '/');
  return {};
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    // grab the 6-digit code and stored values
    const formData = await request.formData();
    const pin = formData.get('pin');
    const tempJwt = cookies.get('temp_admin_jwt');
    const adminId = cookies.get('temp_admin_id');

    if (!tempJwt) {
      return fail(401, { error: 'Session expired, please log in again.' });
    }
    if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) {
      return fail(400, { error: 'Please enter a valid 6-digit code.' });
    }

    // POST exactly { id, token } per backend docs
    const res = await fetch('https://api-freedom.com/api/v2/admin/auth/verify-totp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempJwt}`
      },
      body: JSON.stringify({
        "id": adminId,
        "token": pin
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('TOTP verification failed:', res.status, text);
      return fail(res.status, { error: 'Invalid TOTP code.' });
    }

    const json = await res.json();
    if (json.success) {
      // if we get back a final admin token, set it
      if (json.token) {
        cookies.set('admin_token', json.token, {
          path: '/', httpOnly: true, sameSite: 'strict', secure: true
        });
      }
      // clean up temps
      cookies.delete('temp_admin_jwt', { path: '/' });
      cookies.delete('temp_admin_id', { path: '/' });
      throw redirect(303, '/dashboard');
    }

    console.log(json);

    return fail(400, { error: json.error || 'Invalid TOTP code.' });
  }
};



// // +page.server.ts
// import { redirect, fail } from '@sveltejs/kit';
// import type { Actions } from './$types';

// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async (event) => {
   
   
// };

// export const actions: Actions = {
//     default: async ({ request, fetch, cookies }) => {
//         const formData = await request.formData();
//         const pin = formData.get('pin');
//         const token = cookies.get('admin_token');
//         const tempJwt = cookies.get('temp_admin_jwt');
//     const adminId = cookies.get('temp_admin_id');
//         if (!token) return fail(401, { error: 'Not authenticated' });


//         const res = await fetch('https://api-freedom.com/api/v2/admin/auth/verify-totp', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${tempJwt}`
//             },
//             body: JSON.stringify({ enable: true,
//                 "id": adminId,
//                  "token": pin
//              })
//           });
//         console.log(res);
//         console.log(pin);
//         // Mock verification (you should replace with real logic)
//         const validOtp = '123456'; // Example only, replace with your actual logic

//         // if (enteredOtp === validOtp) {
//         //     // OTP is correct, redirect to next page (e.g., dashboard)
//         //     throw redirect(303, '/dashboard'); // Change '/dashboard' to your target page
//         // } else {
//         //     // OTP is incorrect, return error
//         //     return fail(400, {
//         //         error: 'Invalid verification "token": "123456"  "token": "123456"code. Please try again.'
//         //     });
//         // }
//     }
// };
