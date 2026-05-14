import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please enter a valid email address.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const apiKey = Deno.env.get('BUTTONDOWN_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'Newsletter is not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, type: 'regular' }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "You're subscribed! Check your inbox to confirm." }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Already subscribed → treat as success
    const detail = (data?.detail || data?.email_address?.[0] || '').toString().toLowerCase();
    if (res.status === 400 && (detail.includes('already') || detail.includes('exists'))) {
      return new Response(
        JSON.stringify({ success: true, message: "You're already subscribed — thanks!" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.error('Buttondown error', res.status, data);
    return new Response(
      JSON.stringify({ success: false, message: data?.detail || 'Subscription failed. Please try again.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('subscribe-newsletter error', err);
    return new Response(
      JSON.stringify({ success: false, message: 'An error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
