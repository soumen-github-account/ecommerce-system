
import http from "http";

import app from "./app.js";

import env from "./config/env.js";

const server = http.createServer(app);

server.listen(env.port, () => {

    console.log("");

    console.log("===================================");

    console.log("🚀 API Gateway Started");

    console.log("===================================");

    console.log(`Port : ${env.port}`);

    console.log(`Env  : ${env.nodeEnv}`);

    console.log("");

});

process.on("SIGINT", () => {

    server.close(() => process.exit(0));

});

process.on("SIGTERM", () => {

    server.close(() => process.exit(0));

});