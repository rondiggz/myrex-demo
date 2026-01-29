import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmyaalemhmcjtutlwfwr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndteWFhbGVtaG1janR1dGx3ZndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTYzMzcsImV4cCI6MjA4NTE5MjMzN30.cCJRE8xLKcgEiu-5qYG7vmRbowkConFYRw8TT4lQ6Ks'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }
})

export type { Database } from './database.types'