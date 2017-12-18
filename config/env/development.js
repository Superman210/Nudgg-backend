const connectionString = process.env.SITE_MONGO_URI || "mongodb://127.0.0.1:27017/nudgg";

module.exports = {
  db: {
    connectionString: connectionString
  },
  log: {
    format: 'dev',
    options: {}
  },
  errPort1: 500,
  errPort2: 11000,
  errPort3: 11001,
  success: 200,
  failed: 400
};
