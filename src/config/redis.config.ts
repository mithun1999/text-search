export default {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME || '',
  password: process.env.REDIS_PASSWORD || '',
  uri: process.env.REDIS_URI || '',
  ttl: process.env.REDIS_DB_TTL || 3600,
};
