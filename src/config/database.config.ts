const databaseConfig = {
  databaseUri:
    process.env.DATABASE_URI || 'mongodb://localhost:27017/text-search',
};

export default databaseConfig;
