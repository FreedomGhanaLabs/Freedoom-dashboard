import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const email = event.url.searchParams.get('email');

  if (!email) {
    // if there's no email, you could redirect back to forgot-password
    throw redirect(303, '/forgot');
  }

  return { email };
};