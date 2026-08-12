import dotenv from "dotenv";

dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 5000,

    apiPrefix: process.env.API_PREFIX || "/api",

    requestTimeout: Number(process.env.REQUEST_TIMEOUT) || 30000
};

export default env;