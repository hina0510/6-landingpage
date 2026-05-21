/**
 * Supabase integration for card_applications
 * Set SUPABASE_URL and SUPABASE_ANON_KEY in window before scripts load, or use env in production.
 */
const SupabaseClient = (() => {
  const SUPABASE_URL = window.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

  async function submitApplication(data) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[Supabase] URL or anon key not configured — storing locally for demo.');
      const applications = JSON.parse(localStorage.getItem('card_applications') || '[]');
      applications.push({ ...data, created_at: new Date().toISOString() });
      localStorage.setItem('card_applications', JSON.stringify(applications));
      return { ok: true, demo: true };
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/card_applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        birth: data.birth,
        agree_privacy: data.agree_privacy,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Submit failed');
    }
    return { ok: true };
  }

  return { submitApplication };
})();
