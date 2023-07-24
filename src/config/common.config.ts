const commonConfig = {
  port: process.env.PORT || 8000,
  allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  sibApiKey: process.env.SIB_API_KEY || 'fXH65scOJgYnWrFV',
};

export default commonConfig;
