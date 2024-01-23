import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import connect from "./schemas/index.js";
import ProductRouter from "./routes/products.router.js";

const app = express();

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

app.use("/api", [router, ProductRouter]);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT} 포트로 서버가 열렸어요!`);
});
