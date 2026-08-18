import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader)
        return new Response(JSON.stringify({ error: 'Missing authorization header.' }), { status: 401 });

    const callerClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user)
        return new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401 });

    const adminClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError)
        return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
});
