import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ecdhypdynxqwubokimyp.supabase.co";
const supabaseKey = "sb_publishable_X_YF5Xyib8tWgf34C-wdRw_i0eTgrkm";

export const supabase = createClient(supabaseUrl, supabaseKey);
