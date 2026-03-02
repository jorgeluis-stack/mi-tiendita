// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqgoajbttxlzahocwnvl.supabase.co'; // Pega tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZ29hamJ0dHhsemFob2N3bnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQ0ODYsImV4cCI6MjA4ODA1MDQ4Nn0.a_MN8YXj-gZWJvaKpnLzXmVitnvE9bKqt8c0EIt3MKs'; // Pega tu API Key anon

export const supabase = createClient(supabaseUrl, supabaseKey);