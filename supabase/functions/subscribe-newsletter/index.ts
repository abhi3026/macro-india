import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Result {
  success: boolean;
  alreadySubscribed?: boolean;
  message: string;
}

const json = (body: Result, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email: raw } = await req.json().catch(() => ({ email: '' }));
    const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ success: false, message: 'Please enter a valid email address.' });
    }

    const apiKey = Deno.env.get('BUTTONDOWN_API_KEY');
    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY missing');
      return json({ success: false, message: 'Newsletter is temporarily unavailable.' });
    }

    const res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, type: 'regular' }),
    });

    const data: any = await res.json().catch(() => ({}));

    if (res.ok) {
      return json({
        success: true,
        message: 'We have sent you a mail, please verify.',
      });
    }

    // Detect "already exists" across Buttondown's various response shapes
    const blob = JSON.stringify(data).toLowerCase();
    const code = (data?.code || '').toString().toLowerCase();
    const isAlready =
      code.includes('already') ||
      blob.includes('already') ||
      blob.includes('exists') ||
      blob.includes('duplicate');

    if (isAlready) {
      return json({
        success: true,
        alreadySubscribed: true,
        message: 'User already exists',
      });
    }

    // Buttondown firewall / spam block — surface friendly message
    if (blob.includes('firewall') || blob.includes('blocked')) {
      return json({
        success: false,
        message: 'This email could not be subscribed. Please try a different address.',
      });
    }

    console.error('Buttondown error', res.status, data);
    return json({ success: false, message: 'Something went wrong. Please try again.' });
  } catch (err) {
    console.error('subscribe-newsletter error', err);
    return json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});
