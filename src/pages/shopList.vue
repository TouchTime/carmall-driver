<template>
<div class='shop'>
  <div class='shop-content'>
    <div v-if='staData || shopDataList.length'>
      <div class='shop-head' v-if='staData'>
        <p>库存总额：<span class='shop-head-money'>￥{{staData.allSum}}</span></p>
        <p>库存总量：<span class='shop-head-money'>{{staData.allNum}}件</span></p>

      </div>
      <ul class='shop-goods-list' v-if='shopDataList.length > 0'>
        <li class='shop-goods-item' v-for='(item,index) in shopDataList' v-if='item.product'>
          <div class='shop-goods-photo' @click='showShopDetail(item)' :style='{backgroundImage:"url("+item.product.productImgUrl+")"}'></div>

          <div class='shop-goods-info'>
            <strong>{{item.product.name}}</strong>
            <p>进货价：<span class='shop-goods-money'>￥{{item.product.shopActualPrice}}</span></p>
            <p>销售价：<span class='shop-goods-money'>￥{{item.product.actualPrice}}</span></p>
            <p>净利润：<span class='shop-goods-money'>￥{{item.product.shopProfit}}</span></p>
          </div>
          <div class='shop-goods-kc'><span>剩余库存：X{{item.productNumber}}</span></div>
        </li>

      </ul>
    </div>
    <div v-else class='shop-zwsp'>暂无商品！<span style='color:#ffc700'>一键补货</span></div>
  </div>
  <transition name='shopShowGoods'>
    <div v-if='isShowShopDetail' @click='isShowShopDetail = !isShowShopDetail' class='mask shopGoods'>
      <div class='shopGoods-box'>
        <div class='shopGoods-img' :style='{backgroundImage:"url("+shopGoodList.goodsPhoto+")"}'></div>
        <div class='shopGoods-price'>￥{{shopGoodList.sales}}</div>
        <div class='shopGoods-info'>其他描述...</div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import {
  WARequest,
  storage,
  sessionStorage
} from '../util.js'
export default {
  data() {
    return {
      isShowShopDetail: false,
      shopGoodList: [],
      shopGoodsList: [

      ],
      shopDataList: '', //店铺商品
      shopId: window.shopID || '',
      staData: '', //总金额 总量
    }
  },
  created() {
    this.shopData();
    this.goodsNum();
    window.shopID = Number(sessionStorage.get('shopID'));
  },
  methods: {
    // 获取点剖总额 和 商品总数量
    goodsNumSuc(data) {
      // console.log(data);
      this.staData = data.data;
    },
    goodsNum() {
      WARequest({
        method: 'GET',
        // data:{shopId:1},
        // url:`http://192.168.31.14:8089/shopproduct/statisticsShopCurrProduct/` + '1',
        url: `/shops/shopproduct/statisticsShopCurrProduct/` + window.shopID || '',
        done: this.goodsNumSuc,
        fail: function(err) {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            alert('请求失败，请重试！');
          }
        }
      })
    },
    // 获取数据
    shopDataSuc(data) {
      // console.log(data);
      this.shopDataList = data.data.result;
    },
    shopData() {
      WARequest({
        method: 'GET',
        // data:{shopId:1},
        data: {
          shopId: window.shopID || ''
        },
        // url:'http://192.168.31.14:8089/shopproduct/getshopproductpage/',
        url: '/shops/shopproduct/getshopproductpage/',
        done: this.shopDataSuc,
        fail: function(err) {
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            alert('请求失败，请重试！');
          }
        }
      })
    },
    showShopDetail(item) {
      this.isShowShopDetail = !this.isShowShopDetail;
      this.shopGoodList = item;
    }
  },
  mounted() {
    $('title').html('车猫掌柜');
  }
}
</script>
<style>
.shop-zwsp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 1.1em;
}

.shopGoods {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}

.shopGoods-box {
  width: 72%;
  padding: 1.5em 1em;
  border-radius: 0.8em;
  background-color: #fff;
}

.shopGoods-price {
  color: #ffc700;
  text-align: center;
  font-size: 1.2em;
}

.shopGoods-img {
  width: 5em;
  height: 5em;
  background-size: 80%;
  margin: 1em auto;
  background-position: center;
  background-repeat: no-repeat;
}

.shopGoods-info {
  text-align: center;
  margin-top: 0.5em;
}

.shop {
  width: 100%;
}

.shop-content {
  width: 100%;
  box-sizing: border-box;
  background-color: #f2f2f2;
  overflow-y: auto;
  height: 100%;
}

.shop-head {
  width: 90%;
  background-color: #fff;
  padding: 1em 0.5em;
  border-radius: 1.2em;
  margin: 2em auto;
  display: flex;
  box-sizing: border-box;
}

.shop-head>p {
  flex: 1;
  text-align: center;
}

.shop-head-money {
  color: #ffc700;
}

.shop-goods-list {
  width: 100%;
  background-color: #fff;
  padding: 0.5em 1em;
  box-sizing: border-box;
}

.shop-goods-item {
  padding: 0.5em 0;
  display: flex;
  box-sizing: border-box;
}

.shop-goods-photo {
  flex: 1;
  width: 5em;
  height: 5em;
  background-size: 70%;
  background-position: 10% 50%;
  background-repeat: no-repeat;
}

.shop-goods-info {
  flex: 2;
  box-sizing: border-box;
}

.shop-goods-money {
  color: #ffc700;
}

.shop-goods-kc {
  flex: 2;
  text-align: right;
  margin-top: 5em;
}

.shopShowGoods-enter-active {
  animation: fadeIn 0.3s;
}

.shopShowGoods-enter-active .shopGoods-box {
  animation: zoomIn 0.3s;
}

.shopShowGoods-leave-active {
  animation: fadeIn 0.3s reverse;
}

.shopShowGoods-leave-active .shopGoods-box {
  animation: zoomIn 0.3s reverse;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 1);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@media (min-width:768px) {
  .shop {
    background-color: #333;
  }
  .shop-content {
    width: 75%;
    margin: 0 auto;
  }
  .shop-head {
    padding: 1.5em 0.5em;
  }
  .shop-goods-kc {
    flex: 1;
  }
  .shop-goods-photo {
    background-size: 50%;
    background-position: center;
  }
}
</style>
