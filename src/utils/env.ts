import envalid from "envalid";

const env = envalid.cleanEnv(process.env, {
  BOT_TOKEN: envalid.str(),
});

export default env;
