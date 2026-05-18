import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/**
 * Lazy-инициализация Supabase клиента.
 * Если env-переменные не заданы — возвращает null, и Realtime тихо деградирует
 * до offline-режима (можно работать без коллаборации).
 */
export function getSupabase(): SupabaseClient | null {
	if (cached) return cached
	if (typeof window === 'undefined') return null

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url || !anon) return null

	try {
		cached = createClient(url, anon, {
			realtime: { params: { eventsPerSecond: 10 } },
			auth: { persistSession: false },
		})
		return cached
	} catch {
		return null
	}
}

export function isSupabaseConfigured(): boolean {
	return Boolean(
		process.env.NEXT_PUBLIC_SUPABASE_URL &&
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	)
}
