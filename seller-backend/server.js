
import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import productRoute from "./routes/productRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import sellerRoute from "./routes/sellerRoutes.js"
import cookieParser from "cookie-parser"
import orderRoute from "./routes/orderRoute.js"

const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // Yahan exact frontend URL dein
  credentials: true,              // Ye line credentials allow karne ke liye hai
}));
app.use(cookieParser());
connectDb()

app.get("/", (req, res) => {
    res.json("Api is running")
})

app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/seller", sellerRoute);
app.use("/seller", orderRoute)

app.use((err, req, res, next) => {
  console.log("Error Code:", err.code);
  console.log("Field:", err.field);
  console.log(err);

  res.status(500).json({
    code: err.code,
    field: err.field,
    message: err.message,
  });
});


app.listen(PORT, () => {
    console.log("app started on port :", PORT);
});

