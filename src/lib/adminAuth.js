import { supabase } from './supabase';

const ADMIN_STORAGE_KEY = 'tss_admin_session_auth';

export const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'mdsamayunreja176@gmail.com';
export const DEFAULT_ADMIN_UNIQUE_ID = import.meta.env.VITE_ADMIN_UNIQUE_ID || 'TSS-ADMIN-732101';

/**
 * Validates admin credentials against environment config and optionally Supabase admin table
 */
export async function authenticateAdmin(email, uniqueId) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanId = (uniqueId || '').trim();

  // 1. Check against master admin configured in env
  const envEmail = (DEFAULT_ADMIN_EMAIL || '').trim().toLowerCase();
  const envId = (DEFAULT_ADMIN_UNIQUE_ID || '').trim();

  if (cleanEmail === envEmail && cleanId === envId) {
    const session = {
      email: cleanEmail,
      uniqueId: cleanId,
      role: 'super_admin',
      name: 'Trimurti Solar Admin',
      loggedInAt: new Date().toISOString(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  // 2. Also check against Supabase admin_users table if user created it
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('unique_id', cleanId)
        .maybeSingle();

      if (data && !error) {
        const session = {
          email: data.email,
          uniqueId: data.unique_id,
          role: data.role || 'admin',
          name: data.name || 'Admin',
          loggedInAt: new Date().toISOString(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
        return { success: true, session };
      }
    } catch {
      // admin_users table might not exist yet, fallback to env credentials only
    }
  }

  return { success: false, error: 'Invalid admin email or unique ID.' };
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_STORAGE_KEY);
}
