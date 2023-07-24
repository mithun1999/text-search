const databaseConfig = {
  databaseUri:
    process.env.DATABASE_URI || 'mongodb://localhost:27017/ciumockupgen',
};

export default databaseConfig;
