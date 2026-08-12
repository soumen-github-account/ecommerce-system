
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import httpContext from "express-http-context";
import { v4 as uuid } from "uuid";

import env from "./config/env.js";
import routes from "./routes/index.js";

const app = express();

app.set("trust proxy", 1);


app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// app.use(
//     cors({
//         origin: "*",
//         credentials: true,
//     })
// );

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(cors({
    origin: function (origin, callback) {

        // Postman / server-to-server request
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
}));

app.use(compression());


app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


app.use(httpContext.middleware);

app.use((req, res, next) => {

    const requestId = uuid();

    httpContext.set("requestId", requestId);

    res.setHeader("x-request-id", requestId);

    next();

});


morgan.token("id", () => httpContext.get("requestId"));

app.use(
    morgan(":id :method :url :status :response-time ms")
);

app.use(

    rateLimit({

        windowMs: 15 * 60 * 1000,

        max: 500,

        standardHeaders: true,

        legacyHeaders: false

    })

);


app.get("/health", (req, res) => {

    res.json({

        success: true,

        service: "API Gateway",

        status: "UP"

    });

});

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "CityBasket API Gateway"

    });

});

app.use(`${env.apiPrefix}/v1`, routes);


app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});

// error handle
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: err.message

    });

});

export default app;