'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AuthApiError, Session } from '@supabase/supabase-js'; // Importações para tipagem
import type { NextApiRequest, NextApiResponse } from 'next';

export async function fetchUserProfile(): Promise<any> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return data;
}

export async function fetchAnonId(): Promise<string | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.is_anonymous) {
    return user.id;
  }

  return null;
}

export async function updateAnonConversations(anonId: string | null): Promise<void> {
  if (anonId) {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('conversations')
        .update({ owner_id: user.id })
        .eq('owner_id', anonId);

      await supabase
        .from('human_messages')
        .update({ owner_id: user.id })
        .eq('owner_id', anonId);
    }
  }
}

export async function signIn(formData: FormData, path: string): Promise<{ message?: string } | void> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const anonId = await fetchAnonId();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error instanceof AuthApiError) {
      return { message: 'Credenciais inválidas.' };
    }

    return { message: error.message };
  }

  await updateAnonConversations(anonId);
  revalidatePath('/', 'layout');
  redirect(path === '/login' ? '/' : path);
}

export async function signInAnonymously(): Promise<{ message?: string } | void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signInWithGoogle(path: string): Promise<{ message?: string } | void> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback${
        path === '/login' ? '/' : path
      }`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  redirect(data.url);
}

export async function signOut(): Promise<{ message?: string } | void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { message: error.message };
  }

  redirect('/login');
}

export async function signUp(formData: FormData): Promise<{ message?: string } | void> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const picture = formData.get('picture') as File | null;
  const anonId = await fetchAnonId();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, picture } },
  });

  if (error) {
    if (error instanceof AuthApiError) {
      return { message: 'E-mail já cadastrado.' };
    }

    return { message: error.message };
  }

  await updateAnonConversations(anonId);
  revalidatePath('/', 'layout');
  redirect('/');
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const supabase = createClient();
  const code = req.query.code as string;
  const next = (req.query.next as string) || '/';

  // Troca o código pelo token de acesso
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
    return;
  }

  // Redireciona o usuário para a próxima página ou a página principal
  res.redirect(next);
};