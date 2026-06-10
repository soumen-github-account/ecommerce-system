import dotenv from "dotenv";

dotenv.config();

console.log("URI =", process.env.MONGODB_URI);
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";


async function updateImages() {
  await connectDb();

  const collection = mongoose.connection.collection("subcategorylevel2");

  await collection.updateOne(
    { name: "Men T-Shirts" },
    {
      $set: {
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      },
    }
  );

  await collection.updateOne(
    { name: "Men Jeans" },
    {
      $set: {
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
      },
    }
  );

  await collection.updateOne(
    { name: "Women Dresses" },
    {
      $set: {
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      },
    }
  );

  await collection.updateOne(
    { name: "Women Tops" },
    {
      $set: {
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      },
    }
  );

  await collection.updateOne(
    { name: "Android Phones" },
    {
      $set: {
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      },
    }
  );

  console.log("Images updated");
  process.exit(0);
}

updateImages();