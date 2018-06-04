<template>
<div class="page order-page">
  <div class='orderConent'>
    <div class="order-tab">
      <div class='tab-item' @click='tabToggle(item,index)' v-for='(item,index) in itemTab' :class='{"active":currIndex == index}'>{{item.itemText}}</div>
    </div>
    <div class="tab-container">
      <div class="tab-item-box">
        <ul class="order-list">
          <li class='proOrder' v-for='(item,i) in dfkData'>
            <div class='order-sel-list'>
              <div class='order-sel-item'>
                <div class="order-title">
                  <span>订单编号：{{item.orderCode}}</span>
                  <span class="yellow-font" v-if='tabItem == 0' @click='readCode(item.id,i)'>查看二维码</span>
                </div>
                <div class="order-goods-list">
                  <div class='order-goods-wrap' v-for='(gv,index) in item.orderList'>
                    <div class="ogl-item" :style="{backgroundImage:'url('+gv.productUrl+')'}"></div>
                    <div class="ogl-desc">
                      <p>{{gv.productName}}</p>
                      <p class="yellow-font">¥ {{gv.actualPrice}}</p>
                    </div>
                    <div class="ogl-count">X {{gv.numbers}}</div>
                  </div>
                </div>
                <div class="order-footer">
                  <span>{{item.account}}</span>
                  <span>总金额：<span class='order-foot-yellow'>￥{{item.paySum}}</span></span>
                  <span>&nbsp;&nbsp;&nbsp;退款金额：<span class='order-foot-yellow'>￥{{item.checkReturnSum || 0}}</span></span>
                </div>
              </div>
            </div>
            <div class="order-opts" v-if='tabItem == 2' >
              <span class="yellow-btn" @click='showModel(item.id)'>确认收货</span>
            </div>
          </li>
        </ul>
        <div v-if="dfkData.length < 1" class="no-data">
          <p>您还没有{{itemTab[currIndex].itemText}}的订单</p>
        </div>
      </div>
    </div>
  </div>
  <transition name='sureDelOrder'>
    <div v-if='isShowModel' @click='closeShowModel' class="modelContent">
      <div class="modelBody">
        <h3>确认收货吗？</h3>
        <p class="clickaBtn">
          <a class="noLogin" @click='isShowModel = isShowModel'>取消</a>
          <a class="sureLogin" @click='sureGetGoods' href="javascript:">确定</a>
        </p>
      </div>
    </div>
  </transition>
  <transition name='sureDelOrder'>
    <div v-if='isSureModel' @click='closeSureModel' class="modelContent" id="megsModel">
      <div class="modelBody">
        <h3>已确认收货！</h3>
        <p class="clickaBtn">
          <a class="sureLogin" @click='isSureModel = isSureModel' href="javascript:">确定</a>
        </p>
      </div>
    </div>
  </transition>
  <transition name='sureDelOrder'>
    <div v-if='isCode' @click='isCode = false' class="modelContent">
      <div id="QRCode"></div>
    </div>
  </transition>
</div>
</template>

<script>
import {
  WARequest,
  loginInfo,
  storage,
  sessionStorage
} from '../util.js'

export default {
  data() {
    const info = loginInfo();
    return {
      dfkData: '', //待付款列表
      isShowModel: false,
      isSureModel: false,
      tabItem: '', //每个tab的itemI
      currIndex: 0,
      itemTab: [{
          itemText: '已付款',
          itemI: 0
        },
        {
          itemText: '已接单',
          itemI: 1
        },
        {
          itemText: '已发货',
          itemI: 2
        }
      ],
      orderList: [],
      jsonData: {
        type: 1,
        shopId: window.shopID || '',
        userId: info['user'].id,
        status: 2
      },
      // jsonData:{type:1,shopId:1,userId:1,status:2},
      orderUnionId: '', //确认收货的订单id
      isLookWl: true,
      isCode: false
    }
  },
  created() {
    this.userAllOrder();
    window.shopID = Number(sessionStorage.get('shopID'));
  },
  methods: {
    // 查看二维码
    readCode(unionOrderId) {
      this.isCode = !this.isCode;
      WARequest({
        url: `/orders/order/getorderunionerweicodebyunionid/` + unionOrderId,
        // url:`http://192.168.31.14:8089/order/getorderunionerweicodebyunionid/`+unionOrderId,
        done: (data) => {
          $('#QRCode').empty().qrcode(data.data);
        },
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
    //确认收货
    sureGetGoodsSuc(data) {
      this.isSureModel = !this.isSureModel;
      this.isLookWl = !this.isLookWl;
    },
    sureGetGoods() {
      WARequest({
        method: 'POST',
        url: `/orders/order/checkorder/${this.orderUnionId}`,
        // url:`http://192.168.31.14:8089/order/checkorder/${this.orderUnionId}`,
        done: this.sureGetGoodsSuc,
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
    // 订单列表数据查询
    userAllOrderSuc(data) {
      // console.log(data)
      this.dfkData = data.data.result;
    },
    userAllOrder() {
      WARequest({
        method: 'GET',
        data: this.jsonData,
        // url:'http://192.168.31.14:8085/order/getorderunionpage/',
        url: '/orders/order/getorderunionpage/',
        done: this.userAllOrderSuc,
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
    closeShowModel() {
      this.isShowModel = !this.isShowModel;
    },
    // 关闭确认收货
    closeSureModel() {
      this.isSureModel = !this.isSureModel
    },
    // 切换tab
    tabToggle(item, index) {
      this.tabItem = item.itemI;
      this.currIndex = index;
      const info = loginInfo();

      if (index == 0) {
        this.jsonData = {
          type: 1,
          shopId: window.shopID || "",
          userId: info['user'].id,
          status: 2
        };
        this.userAllOrder();
      } else if (index == 1) {
        this.jsonData = {
          type: 1,
          shopId: window.shopID || '',
          userId: info['user'].id,
          status: 3
        }; //已接单
        this.userAllOrder();
      } else {
        this.jsonData = {
          type: 1,
          shopId: window.shopID || '',
          userId: info['user'].id,
          status: 4
        }; //已发货
        this.userAllOrder();
      }
    },
    showModel(itemId) {
      // document.getElementById('megsModel').style.display = 'block';
      this.isShowModel = !this.isShowModel;
      this.orderUnionId = itemId;
    },

  },
  mounted() {
    $('title').html('车猫掌柜-待确认订单');
  }
}
</script>

<style>
#QRCode {
  width: 12em;
  height: 12em;
  background: #fff;
  border-radius: 10px;
}

.order-foot-yellow {
  color: #ffc700;
}

.order-page {
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  overflow-y: auto;
}

.order-page .tab-container {
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

.order-page .order-tab {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.order-page .order-tab .tab-item {
  width: 33.33%;
  line-height: 44px;
  text-align: center;
}

.order-page .order-tab .tab-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: #fec62e;
}

.order-page .order-tab .tab-item.active {
  position: relative;
  color: #fec62e;
}

.order-page .order-tab .tab-item.active::after {
  width: 100%;
}

.order-page .order-list li {
  background-color: #fff;
  margin: 1em 0;
}

.order-page .order-list li .order-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
  line-height: 3.2em;
}

.yellow-font {
  color: #ffc700;
}

@media (min-width:768px) {
  .order-page {
    background: #333;
  }
  .orderConent {
    width: 75%;
    margin: 0 auto;
    background: #fff;
    height: 100%;
  }
}

/* 模态框 */

.modelContent {
  width: 100%;
  height: 100%;
  z-index: 999;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modelBody {
  font-size: 1em;
  max-width: 29.375em;
  width: 87%;
  max-height: 25em;
  background: #f2f2f2;
  margin: 0 auto;
  border-radius: 0.8em;
  padding-bottom: 1.25em;
}

.modelBody h3 {
  padding-top: 0.8em;
}

.clickaBtn {
  overflow: hidden;
}

.modelBody .sureLogin,
.modelBody .noLogin {
  color: #fff;
  background: #ffc700;
  padding: 0.5em 1.3em;
  display: inline-block;
  border-radius: 0.5em;
  margin-top: 0.5em;
}

.modelBody .noLogin {
  color: #fff;
  background-color: #ddd;
  margin-left: 0;
}

.modelBody h1 {
  font-size: 1em;
  padding: 1.25em;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
}

.modelBody h1 span {
  float: right;
  font-size: 1.25em;
  line-height: 0.5em;
}

.sureDelOrder-enter-active {
  animation: fadeIn 0.4s;
}

.sureDelOrder-enter-active .sureDelOrder {
  animation: fadeInUp 0.4s;
}

.sureDelOrder-leave-active {
  animation: fadeIn 0.4s reverse;
}

.sureDelOrder-leave-active .sureDelOrder {
  animation: fadeInUp 0.4s reverse;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 100, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@media (min-width:768px) {
  .order-page .order-tab .tab-item {
    line-height: 60px;
  }
}

canvas {
  display: block;
  width: 100%;
  border: 0.5em solid #fff;
}
</style>
