// srvices/server.js

import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import userRouter from "./routes/user.routes.js"
import admin from "./config/firebase.js"
import cartRoute from "./routes/cart.routes.js";


const PORT = process.env.PORT || 5002
const app = express()
app.use(cors())

app.use(express.json())

connectDb()
console.log("Firebase initialized successfully")

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/users", userRouter);
app.use("/api/cart", cartRoute);


app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

