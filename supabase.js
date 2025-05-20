// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://swcmndzenaowjhrwjqjd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Y21uZHplbmFvd2pocndqcWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTI5MzksImV4cCI6MjA2MzIyODkzOX0.Hu0WN-oG-nms2nSesxCVAAJh6vbD6XzCvi3W2et52wk'
);
