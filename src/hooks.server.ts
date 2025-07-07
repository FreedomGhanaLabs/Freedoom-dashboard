import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const admin_token = event.cookies.get('admin_token');

  // In a real application, you would validate the admin_token with your backend
  // For this example, we'll assume any presence of admin_token means authenticated
  event.locals.user = admin_token ? { isAuthenticated: true } : { isAuthenticated: false };

  // Protect dashboard routes
  if (event.url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user.isAuthenticated) {
      throw redirect(302, '/'); // Redirect to login page
    }
  }

  const response = await resolve(event);
  return response;
};