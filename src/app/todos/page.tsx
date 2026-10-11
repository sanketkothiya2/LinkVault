import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <div className="min-h-screen bg-[#090D16] text-white p-8">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Supabase SSR Server Component</h1>
        <p className="text-xs text-slate-400">
          Queried using <code>@/utils/supabase/server</code> and Next.js cookies.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            Note: {error.message} (Create a <code>todos</code> table in your Supabase dashboard to populate data here).
          </div>
        )}

        <ul className="space-y-2 pt-2">
          {todos?.map((todo: any) => (
            <li
              key={todo.id}
              className="p-3 rounded-xl bg-[#111728] border border-white/[0.08] text-sm"
            >
              {todo.name || todo.title || JSON.stringify(todo)}
            </li>
          ))}

          {(!todos || todos.length === 0) && !error && (
            <li className="text-sm text-slate-400 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              No todos found.
            </li>
          )}
        </ul>

        <div className="pt-4">
          <a
            href="/"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            ← Back to LinkVault Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
