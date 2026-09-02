
import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDb } from "./config/db.js"
import productRoute from "./routes/productRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import sellerRoute from "./routes/sellerRoutes.js"
import cookieParser from "cookie-parser"
import orderRoute from "./routes/orderRoute.js"
import productEditRoute from "./routes/productEditRoute.js"
import sellerDashboardRoute from "./routes/sellerDashboardRoutes.js"


const PORT = process.env.PORT || 5003
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

app.use("/sellers/product", productRoute);
app.use("/sellers/category", categoryRoute);
app.use("/sellers/seller", sellerRoute);
app.use("/sellers/seller", orderRoute)
app.use("/sellers/product-edit", productEditRoute)
app.use("/sellers/dashboard",sellerDashboardRoute);

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

