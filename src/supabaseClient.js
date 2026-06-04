import { createClient } from '@supabase/supabase-js'

// L'URL de ton projet Supabase
const SUPABASE_URL = 'https://wpnqbxpjoextlkvuoziy.supabase.co'

// >>> COLLE ICI ta clé "anon public" (Project Settings -> API) <<<
// (c'est la clé publique, conçue pour le navigateur — PAS la clé service_role)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnFieHBqb2V4dGxrdnVveml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODI2MTQsImV4cCI6MjA5NjE1ODYxNH0.OpBHLTULMgHuKvG5qL4TVbbKWoUs54xjvKVAa40386M'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)