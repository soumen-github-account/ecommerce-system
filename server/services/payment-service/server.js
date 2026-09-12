// srvices/server.js

import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import paymentRouter from "./routes/payment.routes.js"
import { razorpayWebhook } from "./controllers/paymentWebhookController.js"

const PORT = process.env.PORT || 5007
const app = express()
app.use(cors())

connectDb()

app.post(
    "/payments/webhook",
    express.raw({ type: "application/json" }),
    razorpayWebhook
);

app.use(express.json())

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "Payment Service",
    status: "UP"
  });
});

app.use("/payments", paymentRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

