import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  try {
    const adminToken = cookies.get('admin_token');
    const response = await fetch('https://api-freedom.com/api/v2/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken || ''}`
      }
    });

    if (!response.ok) {
      console.warn('⚠️ Server-side logout failed:', response.status, response.statusText);
    }

    // Clear the admin_token cookie
    cookies.set('admin_token', '', {
      path: '/',
      expires: new Date(0)
    });

    return json({ success: response.ok });
  } catch (error) {
    console.error('❌ Server-side logout error:', error);
    // Clear the cookie even if the API call fails
    cookies.set('admin_token', '', {
      path: '/',
      expires: new Date(0)
    });

    console.log('⚠️ Cookie cleared due to error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return json({ success: false, error: errorMessage }, { status: 500 });
  }
}