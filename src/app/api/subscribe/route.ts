// C:/Users/Amit/antigravity/gamesdealshub-next/src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';

// Fix 15: API route to handle email subscriptions via Brevo
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn('BREVO_API_KEY is not configured in environment variables');
      // Return success anyway for testing/development if key is missing
      return NextResponse.json({ success: true, message: 'Simulated subscription (no API key)' });
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        updateEnabled: false,
        listIds: [2] // Replace with actual Brevo list ID
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      
      // If contact already exists, Brevo returns an error, but we can treat it as success for the user
      if (errorData.code === 'duplicate_parameter') {
        return NextResponse.json({ success: true });
      }
      
      throw new Error('Failed to add contact');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
