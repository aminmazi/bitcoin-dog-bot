import envalid from 'envalid';

const env = envalid.cleanEnv(process.env, {
  BOT_TOKEN: envalid.str(),
  MONGO: envalid.str(),
  TAAPI: envalid.str(),
  CACHE_INTERVAL: envalid.num({ default: 30 }),
  TAAPI_CACHE_INTERVAL: envalid.num({ default: 3600 }),
});

export default env;
