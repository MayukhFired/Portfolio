import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();

    // If Supabase is not configured, log and return success
    if (!supabase) {
      console.warn('[contact] Supabase not configured. Message from:', email);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, subject, message, created_at: new Date().toISOString() }])
      .select();

    if (error) {
      console.error('[contact] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
