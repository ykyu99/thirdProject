// schemas/schema.js

import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 상품명
  },
  detail: {
    type: String,
    required: true, // 설명
  },
  manager: {
    type: String, 
    required: true, // 담당자
  },
  password: {
    type: String, 
    required: true, // 비밀번호
  },
  state: {
    type: String, 
    required: true, // 상품상태
  },
  registDate: {
    type: Date, 
    required: true, // 등록날짜
  },
  updateDate: {
    type: Date, 
    required: false, // 수정날짜
  },

});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
shopSchema.virtual("productId").get(function () {
  return this._id.toHexString();
});
shopSchema.set("toJSON", {
  virtuals: true,
});

// shopSchema 바탕으로 shop모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("shop", shopSchema);
