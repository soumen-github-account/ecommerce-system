// srvices/server.js

import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import admin from "./config/firebase.js"

const PORT = process.env.PORT || 8000
const app = express()
app.use(cors())

app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.originalUrl);
    console.log(req.body);
    next();
});

connectDb()
console.log("Firebase initialized successfully")

app.get("/", (req, res) => {
    res.json("Api is running")
})


app.use("/auth", authRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

