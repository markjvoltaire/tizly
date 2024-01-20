import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ivxipgaauikqwyguqagw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eGlwZ2FhdWlrcXd5Z3VxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ3MDM3NzgsImV4cCI6MTk3MDI3OTc3OH0.GCuiGxwpuGYW0zQmhFb5ipz_KOvCr_zjyxat_W6BJ0U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
