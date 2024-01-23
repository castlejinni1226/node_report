import express from "express";
import Product from "../schemas/products.schema.js";

const router = express.Router();

router.post("/products", async (req, res) => {
  const { title } = req.body;
  const { content } = req.body;
  const { author } = req.body;
  const { password } = req.body;
  const status = "FOR_SALE";
  const createAt = new Date();

  if (!title || !content || !author || !password) { 
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  const product = new Product({
    title,
    content,
    author,
    password,
    status,
    createAt,
  });
  await product.save();

  return res.json({ product });
});

router.get("/products", async (req, res) => {
  const product = await Product.find()
    .sort("-createAt")
    .select("_id title author status createdAt")
    .exec();
  return res.status(200).json({ product });
});

router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  const currentProduct = await Product.findById(productId)
    .select("_id title content author status createAt")
    .exec();
  if (!currentProduct) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }
  return res.status(200).json({ currentProduct });
});

router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { title } = req.body;
  const { content } = req.body;
  const { password } = req.body;
  const { status } = req.body;

  if (!productId || !title || !content || !password || !status) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  const targetproduct = await Product.findById(productId).exec();

  if (!targetproduct) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }

  targetproduct.title = title;
  targetproduct.content = content;
  targetproduct.status = status;

  if (password !== targetproduct.password) {
    return res
      .status(401)
      .json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
  }

  await targetproduct.save();

  return res.status(200).json({ targetproduct });
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  if (!productId || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  const product = await Product.findById(productId).exec();
  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }
  await Product.deleteOne({ _id: productId }).exec();

  if (password !== product.password) {
    return res
      .status(401)
      .json({ errorMessage: "상품을 삭제할 권한이 존재하지 않습니다." });
  }

  return res.status(200).json({ message: "상품을 삭제하였습니다." });
});

export default router;
