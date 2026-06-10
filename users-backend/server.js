
import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import paymentRouter from "./routes/paymentRoutes.js"
import admin from "./config/firebase.js"

const PORT = 8000 | process.env.PORT
const app = express()
app.use(express.json())
app.use(cors())
connectDb()
console.log("Firebase initialized successfully")

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/payment", paymentRouter)


app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

