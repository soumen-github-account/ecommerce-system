// srvices/server.js

import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import orderRouter from "./routes/order.routes.js"
import internalOrderRoutes from "./routes/internalOrder.routes.js";

const PORT = process.env.PORT || 5006
const app = express()
app.use(cors())

app.use(express.json())

connectDb()

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/orders", orderRouter);
app.use(
    "/internal",
    internalOrderRoutes
);

app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

