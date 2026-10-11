import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      configured: false,
      message: 'Supabase URL or Publishable Key is missing from environment variables.',
    });
  }

  const client = supabaseAdmin || supabase;

  try {
    const [categoriesRes, resourcesRes, tasksRes, goalsRes] = await Promise.all([
      client.from('categories').select('id').limit(1),
      client.from('resources').select('id').limit(1),
      client.from('tasks').select('id').limit(1),
      client.from('goals').select('id').limit(1),
    ]);

    const tables = {
      categories: !categoriesRes.error,
      resources: !resourcesRes.error,
      tasks: !tasksRes.error,
      goals: !goalsRes.error,
    };

    const allReady = Object.values(tables).every(Boolean);

    return NextResponse.json({
      configured: true,
      connected: true,
      allTablesReady: allReady,
      tables,
      errors: {
        categories: categoriesRes.error?.message || null,
        resources: resourcesRes.error?.message || null,
        tasks: tasksRes.error?.message || null,
        goals: goalsRes.error?.message || null,
      },
      sqlEditorUrl: `https://supabase.com/dashboard/project/${(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/^https?:\/\//, '').split('.')[0] || 'default'}/sql/new`,
      migrationFile: 'supabase/migrations/20250101_initial_schema.sql',
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: err.message,
    });
  }
}
