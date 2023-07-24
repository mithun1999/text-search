const authConfig = {
  supabaseUrl:
    process.env.SUPABASE_URL || 'https://wiiffqrxlylhjwtznymy.supabase.co',
  supabaseKey:
    process.env.SUPABASE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaWZmcXJ4bHlsaGp3dHpueW15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODY5MzE4MSwiZXhwIjoxOTk0MjY5MTgxfQ.juZQ26JrexHCYxhYzsMwK--Ph7N2CkfS035kTRE_eaU',
  supabaseJwtSecret:
    process.env.SUPABASE_JWT_SECRET ||
    'xE+TgfbpYkSffZfNROt3rYWQHR6ytuPONgDygzwUxaquZ7kd4EWeV1pKUTxET2smDLMCBGiYul7wyqT/Xgw9sw==',
};

export default authConfig;
