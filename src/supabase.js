import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://vvgmvpuzmopcasdkbmol.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z212cHV6bW9wY2FzZGtibW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM1NzY3MzcsImV4cCI6MjAxOTE1MjczN30.T_x4J2uX2lJgyvXxv6dquFkMvcD743-ZR1ZKBuzI4HE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
