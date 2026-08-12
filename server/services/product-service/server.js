
import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/categoryService.routes.js"
import internalProductRouter from "./routes/internalProduct.routes.js"

const PORT = process.env.PORT || 5004
const app = express()
app.use(cors())

app.use(express.json())

connectDb()

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/products", productRouter);
app.use("/products/category", categoryRouter)
app.use("/internal", internalProductRouter)

app.listen(PORT, "0.0.0.0", () => {
    console.log("app started on port :", PORT);
});

