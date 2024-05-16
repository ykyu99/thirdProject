김영규 3번째 프로젝트 설명


1.  조회 get: ykyu99.store/api/shop
    상품목록을 조회한다.

2.  상세조회 get: ykyu99.store/api/shop/id 
    상품을 상세조회한다. id 예) 66465b27ee6ccfa4258af8e8
    
3.  등록 post: ykyu99.store/api/shop
    상품을 등록한다.
    예)
    {
    	"name" : "시금치무침",
    	"detail" : "시금치를 맛있게 버무렸다.",
    	"manager" : "김영규",
    	"password" : "123123"
    }
    
4.  상품 수정 patch: ykyu99.store/api/shop
    상품을 수정한다.
    예)
    1) 상품 상태 변경
    {
	    "password" : "123123",
	    "state" : "SOLD_OUT"
    }
    2) 상품 내용 변경
    {
    	"name" : "시금치무침",
    	"detail" : "시금치를 맛있게 버무렸다.",
    	"manager" : "김영규",
    	"password" : "123123"
    }

5.  상품 삭제 delete: ykyu99.store/api/shop
    상품을 삭제한다.
    예)
    {
    	"password" : "123123"
    }
