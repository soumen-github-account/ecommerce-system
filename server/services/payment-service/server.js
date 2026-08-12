// srvices/server.js

import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import paymentRouter from "./routes/payment.routes.js"

const PORT = process.env.PORT || 5007
const app = express()
app.use(cors())

app.use(express.json())

connectDb()

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/payments", paymentRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

