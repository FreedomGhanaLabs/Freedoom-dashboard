import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.user.isAuthenticated) {
    throw redirect(302, '/');
  }

  // If authenticated, return data that might be needed by the layout or its children
  // For now, an empty object is fine.
  return {};
};