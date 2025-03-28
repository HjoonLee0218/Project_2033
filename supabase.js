import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rszzfncegbsnqkvsfqag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenpmbmNlZ2JzbnFrdnNmcWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzgyNzAsImV4cCI6MjA1ODcxNDI3MH0.8Fal0fxtungpjZ0Ou-Tez84r2N4USxFaUvlIkfvT1lw';
export const supabase = createClient(supabaseUrl, supabaseKey);