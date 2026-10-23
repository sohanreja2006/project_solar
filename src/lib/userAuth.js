import { supabase } from './supabase';

const USER_SESSION_KEY = 'tss_user_session';

/**
 * Register a new user with username + password + dob.
 * Stores user in `site_users` table in Supabase.
 */
export async function registerUser({ username, password, fullName, mobile, email, dob }) {
  if (!supabase) return { success: false, error: 'Database not configured.' };

  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanMobile = (mobile || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanDob = (dob || '').trim();

  if (!cleanUsername || !password) return { success: false, error: 'Username and password are required.' };

  // Check if username already exists
  const { data: existing } = await supabase
    .from('site_users')
    .select('id')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (existing) return { success: false, error: 'Username already taken. Please choose another.' };

  // Check if mobile number already registered
  if (cleanMobile) {
    const { data: mobileExists } = await supabase
      .from('site_users')
      .select('id')
      .eq('mobile', cleanMobile)
      .maybeSingle();

    if (mobileExists) {
      return {
        success: false,
        error: 'An account with this mobile number already exists. Please sign in instead.',
        isDuplicate: true,
      };
    }
  }

  // Check if email already registered
  if (cleanEmail) {
    const { data: emailExists } = await supabase
      .from('site_users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (emailExists) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
        isDuplicate: true,
      };
    }
  }

  // Simple hash — using Web Crypto API (SHA-256 with salt)
  const passwordHash = await hashPassword(password);

  // Prepare insert payload
  const insertPayload = {
    username: cleanUsername,
    password_hash: passwordHash,
    full_name: (fullName || '').trim() || null,
    mobile: cleanMobile || null,
    email: cleanEmail || null,
    created_at: new Date().toISOString(),
  };

  if (cleanDob) {
    insertPayload.dob = cleanDob;
  }

  let { data, error } = await supabase
    .from('site_users')
    .insert([insertPayload])
    .select()
    .single();

  // Graceful fallback if `dob` column does not exist yet in Supabase schema
  if (error && error.message && error.message.includes('dob')) {
    delete insertPayload.dob;
    const fallback = await supabase
      .from('site_users')
      .insert([insertPayload])
      .select()
      .single();
    data = fallback.data;
    error = fallback.error;
  }

  if (error) return { success: false, error: error.message };

  const session = buildSession(data);
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

/**
 * Login user by username + password
 */
export async function loginUser({ username, password }) {
  if (!supabase) return { success: false, error: 'Database not configured.' };

  const cleanUsername = (username || '').trim().toLowerCase();
  if (!cleanUsername || !password) return { success: false, error: 'Username and password are required.' };

  const { data, error } = await supabase
    .from('site_users')
    .select('*')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error || !data) return { success: false, error: 'Invalid username or password.' };

  const valid = await verifyPassword(password, data.password_hash);
  if (!valid) return { success: false, error: 'Invalid username or password.' };

  const session = buildSession(data);
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

/**
 * Verify identity for Password Reset:
 * Requires: username, mobile, and date of birth (DOB)
 */
export async function verifyResetCredentials({ username, mobile, dob }) {
  if (!supabase) return { success: false, error: 'Database not configured.' };

  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanMobile = (mobile || '').replace(/\D/g, '').slice(-10);
  const cleanDob = normalizeDate(dob);

  if (!cleanUsername || !cleanMobile || !cleanDob) {
    return { success: false, error: 'Username, Mobile Number, and Date of Birth are all required.' };
  }

  const { data, error } = await supabase
    .from('site_users')
    .select('*')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: 'No registered account found with this username.' };
  }

  const userMobile = (data.mobile || '').replace(/\D/g, '').slice(-10);
  if (userMobile !== cleanMobile) {
    return { success: false, error: 'The mobile number does not match account records.' };
  }

  if (data.dob) {
    const userDob = normalizeDate(data.dob);
    if (userDob !== cleanDob) {
      return { success: false, error: 'The Date of Birth does not match account records.' };
    }
  }

  return { success: true, user: data };
}

/**
 * Reset password after verifying username, mobile, and DOB
 */
export async function resetUserPassword({ username, mobile, dob, newPassword }) {
  if (!supabase) return { success: false, error: 'Database not configured.' };

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  const verification = await verifyResetCredentials({ username, mobile, dob });
  if (!verification.success) {
    return verification;
  }

  const newHash = await hashPassword(newPassword);
  const cleanUsername = (username || '').trim().toLowerCase();

  const { error } = await supabase
    .from('site_users')
    .update({ password_hash: newHash })
    .eq('username', cleanUsername);

  if (error) {
    return { success: false, error: 'Failed to update password: ' + error.message };
  }

  return { success: true };
}

/**
 * Recover forgotten username:
 * Requires: mobile, dob, and email
 */
export async function recoverUsername({ mobile, dob, email }) {
  if (!supabase) return { success: false, error: 'Database not configured.' };

  const cleanMobile = (mobile || '').replace(/\D/g, '').slice(-10);
  const cleanDob = normalizeDate(dob);
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanMobile || !cleanDob || !cleanEmail) {
    return { success: false, error: 'Mobile Number, Date of Birth, and Email are all required to recover username.' };
  }

  // Lookup users matching mobile
  const { data, error } = await supabase
    .from('site_users')
    .select('username, full_name, mobile, email, dob');

  if (error || !data || data.length === 0) {
    return { success: false, error: 'No registered account found matching the provided details.' };
  }

  const match = data.find((u) => {
    const uMobile = (u.mobile || '').replace(/\D/g, '').slice(-10);
    const uEmail = (u.email || '').trim().toLowerCase();
    const uDob = normalizeDate(u.dob);

    const mobileMatches = uMobile === cleanMobile;
    const emailMatches = uEmail === cleanEmail;
    const dobMatches = !u.dob || uDob === cleanDob;

    return mobileMatches && emailMatches && dobMatches;
  });

  if (!match) {
    return {
      success: false,
      error: 'Details do not match any account. Please verify your Mobile, DOB, and Email, or contact support on WhatsApp.',
    };
  }

  return {
    success: true,
    username: match.username,
    fullName: match.full_name || match.username,
  };
}

/** Get current user session */
export function getUserSession() {
  try {
    const raw = sessionStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      sessionStorage.removeItem(USER_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Logout user */
export function logoutUser() {
  sessionStorage.removeItem(USER_SESSION_KEY);
}

/**
 * Fetch applications strictly belonging to this user.
 * 1. Primary: match by user_id (guaranteed unique per user).
 * 2. One-time migration: if no user_id-linked apps exist, look for orphaned
 *    apps (user_id IS NULL) that match the user's mobile number, and
 *    permanently claim them by setting user_id. This ensures old data
 *    submitted before the user system was added gets linked once, and
 *    no two users ever see each other's data.
 */
export async function fetchUserApplications(session) {
  if (!supabase || !session) return [];

  // Step 1: Fetch applications linked to this user_id
  const { data: byId } = await supabase
    .from('solar_applications')
    .select('*')
    .eq('user_id', session.id)
    .order('created_at', { ascending: false });

  if (byId && byId.length > 0) return byId;

  // Step 2: One-time migration — claim orphaned apps (user_id is null) matching mobile
  if (session.mobile) {
    const cleanMobile = session.mobile.replace(/\D/g, '').slice(-10);
    const { data: orphaned } = await supabase
      .from('solar_applications')
      .select('*')
      .is('user_id', null)
      .order('created_at', { ascending: false });

    if (orphaned && orphaned.length > 0) {
      const matched = orphaned.filter((app) => {
        const appMobile = (app.mobile || '').replace(/\D/g, '').slice(-10);
        return appMobile === cleanMobile;
      });

      if (matched.length > 0) {
        // Permanently link these to the current user
        const ids = matched.map((a) => a.id);
        await supabase
          .from('solar_applications')
          .update({ user_id: session.id })
          .in('id', ids);

        // Return the now-linked applications
        return matched.map((a) => ({ ...a, user_id: session.id }));
      }
    }
  }

  // No applications found for this user
  return [];
}

// ────────────────────────────────────────────────
// Internal helpers
// ────────────────────────────────────────────────

function normalizeDate(d) {
  if (!d) return '';
  return d.trim().replace(/\//g, '-').slice(0, 10);
}

function buildSession(data) {
  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name || data.username,
    mobile: data.mobile || '',
    email: data.email || '',
    dob: data.dob || '',
    loggedInAt: new Date().toISOString(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/** Simple SHA-256 based password hash using Web Crypto API */
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password, storedHash) {
  try {
    const [saltHex, hashHex] = storedHash.split(':');
    const encoder = new TextEncoder();
    const data = encoder.encode(saltHex + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const computedHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHex === hashHex;
  } catch {
    return false;
  }
}
