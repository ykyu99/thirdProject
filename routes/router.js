// /routes/router.js

import express from "express";
import Product from "../schemas/schema.js";

const router = express.Router();

/** 등록 **/
router.post("/shop", async (req, res) => {
  // 클라이언트에게 전달받은 value 데이터를 변수에 저장합니다.
  const { name, detail, manager, password  } = req.body;

  // value가 존재하지 않을 때, 클라이언트에게 에러 메시지를 전달합니다.
  if (!name) {
    return res
      .status(400)
      .json({ errorMessage: "상품 데이터가 존재하지 않습니다." });
  }
  const registDate = new Date();
  const state = "FOR_SALE"
  // Product모델을 이용해, 새로운 '상품'을 생성합니다.
  const product = new Product({ name, detail, manager, password, registDate, state });

  // 생성한 '상품'을 MongoDB에 저장합니다.
  await product.save();

  return res.status(201).json({ product });
});

/** 조회 **/
router.get("/shop", async (req, res) => {
  // Product모델을 이용해, MongoDB에서 'registDate' 값이 가장 높은 '상품'을 찾습니다.
  const products = await Product.find({}, { password: 0 } ).sort("-registDate").exec();

  // 찾은 '상품'을 클라이언트에게 전달합니다.
  return res.status(200).json({ products });
});

/** 상세 조회 **/
router.get("/shop/:productId", async (req, res) => {
  // 조회할 '상품'의 ID 값을 가져옵니다.
  const { productId } = req.params;

  // Product모델을 이용해, MongoDB에서 해당 ID의 '상품'을 찾습니다.
  const products = await Product.findById(productId , { password: 0 } ).exec();

  // 찾은 '상품'을 클라이언트에게 전달합니다.
  return res.status(200).json({ products });
});

/** 수정  **/
router.patch("/shop/:productId", async (req, res) => {
  // 변경할 '상품'의 ID 값을 가져옵니다.
  const { productId } = req.params;
  // 수정할'상품'의 상태 값을 가져옵니다.
  const { name, detail, manager, password, state } = req.body;

  // 변경하려는 '상품'을 가져옵니다. 만약, 해당 ID값을 가진 '상품'이 없다면 에러를 발생시킵니다.
  const currentProduct = await Product.findById(productId).exec();
  if (!currentProduct) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 상품 데이터입니다." });
  }

  //비밀번호 변경
  if(password !== currentProduct.password){
    return res
      .status(404)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }

  // 이름 변경
  if (name) {
    // 변경하려는 order 값을 가지고 있는 '해야할 일'을 찾습니다.
    const targetProduct = await Product.findOne({ name }).exec();
    if (targetProduct) {
      // 만약, 이미 해당 order 값을 가진 '해야할 일'이 있다면, 해당 '해야할 일'의 order 값을 변경하고 저장합니다.
      targetProduct.name = currentProduct.name;
      await targetProduct.save();
    }
    // 변경하려는 '해야할 일'의 order 값을 변경합니니다.
    currentProduct.name = name;
  }

  // 설명 변경
  if (detail) {
    const targetProduct = await Product.findOne({ detail }).exec();
    if (targetProduct) {
      targetProduct.detail = currentProduct.detail;
      await targetProduct.save();
    }
    currentProduct.detail = detail;
  }

    // 담당자 변경
    if (manager) {
      const targetProduct = await Product.findOne({ manager }).exec();
      if (targetProduct) {
        targetProduct.manager = currentProduct.manager;
        await targetProduct.save();
      }
      currentProduct.manager = manager;
    }

    // 상태 변경
    if (state) {
      const targetProduct = await Product.findOne({ state }).exec();
      if (targetProduct) {
        targetProduct.state = currentProduct.state;
        await targetProduct.save();
      }
      currentProduct.state = state;
    }



  if (currentProduct.updateDate !== undefined) {
    // 수정일시를 변경합니다.
    currentProduct.doneAt = new Date();
  }

  // 변경된 '상품'을 저장합니다.
  await currentProduct.save();

  return res.status(200).json({currentProduct});
});

/** 삭제 **/
router.delete("/shop/:productId", async (req, res) => {
  // 삭제할 '해야할 일'의 ID 값을 가져옵니다.
  const { productId } = req.params;

  // 삭제할'상품'의 상태 값을 가져옵니다.
  const { password } = req.body;

  // 삭제하려는 '상품'을 가져옵니다. 만약, 해당 ID값을 가진 '상품'이 없다면 에러를 발생시킵니다.
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 상품 데이터입니다." });
  }

    //비밀번호 변경
    if(password !== product.password){
      return res
        .status(404)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }
  // 조회된 '상품'을 삭제합니다.
  await Product.deleteOne({ _id: productId }).exec();

  return res.status(200).json({errorMessage: "삭제가 완료되었습니다."});
});

export default router;
