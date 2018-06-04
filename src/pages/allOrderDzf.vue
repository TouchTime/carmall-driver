<template>
<div class="page order-page">
  <div class='orderConent'>
    <div class="order-tab">
      <div class="tab-item">待付款</div>
    </div>
    <div class="tab-container">
      <div class="tab-item-box">
        <ul class="order-list">
          <li class='proOrder' v-for='(item,i) in dfkData'>
            <div class='order-sel-list' v-for='(list,index) in item.orderUnionDtoList'>
              <div class='order-sel-item'>
                <div class="order-title"><span>订单编号：{{list.orderCode}}</span><span class="red-font">待付款</span></div>
                <div class="order-goods-list">
                  <div class='order-goods-wrap' v-for='(gv,j) in list.orderList'>
                    <div class="ogl-item" :style="{backgroundImage:'url('+gv.productUrl+')'}"></div>
                    <div class="ogl-desc">
                      <p>{{gv.productName || ''}}</p>
                      <p class="yellow-font">¥ {{gv.actualPrice || 0}}</p>
                    </div>
                    <div class="ogl-count">X {{gv.numbers || 0}}</div>
                  </div>
                </div>
                <div class="order-footer"><span>金额：</span><span style='color:#ffc700'>￥{{list.paySum}}</span></div>
              </div>
            </div>
            <div class="order-opts">
              <span class="red-pay-btn" @click='goPay(item.orderPay.id)'>支付</span> 需付款：
              <b style='color:#ffc700;font-weight:normal;'>￥{{item.orderPay.payActualSum}}</b>
            </div>
            <transition name='sureDelOrder'>
              <div v-if='isShowModel' @click='closeShowModel' class="modelContent" id="megsModel">
                <div class="modelBody">
                  <h3>确定删除吗？</h3>
                  <p class="clickaBtn">
                    <a class="sureLogin" @click='deleteOrder(i);' href="javascript:">确定</a>
                    <a class="noLogin" @click='isShowModel = isShowModel'>取消</a>
                  </p>
                </div>
              </div>
            </transition>
          </li>
        </ul>
        <div v-if="dfkData.length < 1" class="no-data">
          <p>您还没有待付款的订单</p>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import {
  WARequest,
  loginInfo,
  Pay,
  storage
} from '../util.js'

export default {
  data() {
    return {
      payId: '', //拿到的支付订单id
      dfkData: '', //待付款列表
      isShowModel: false,
      currIndex: this.$route.params.id,
      tabs: ['全部', '待付款', '待发货', '待收货'],
      orderList: [{
        title: '订单号码：HHUUB1231231213',
        status: '待发货',
        imgUrl: [],
        account: '共需6件商品',
        pay: ' ¥506.30',
        type: '2'
      }]
    }
  },
  created() {
    this.userAllOrder();

  },
  methods: {

    // 支付
    goPaySuc(res) {
      console.log(res);
      this.payId = res.data.payOrderId
      // this.alipay();
      if (res.data.isOtherPay == 1) {
        //微信或支付宝支付
        Pay({
          appId: res.data.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.packageurl,
          signType: res.data.signType,
          paySign: res.data.paySign,
          tradeNO: res.data.payOrderId,
          done: (res) => {
            this.$router.replace({
              name: 'pay'
            });
          }
        });
      } else {
        //余额支付
        this.$router.replace({
          name: 'pay'
        });
      }
    },
    goPay(pid) {
      const info = loginInfo();
      WARequest({
        method: 'POST',
        data: {
          uid: info['user'].id,
          payType: 1
        },
        // url:'http://192.168.31.14:8089/order/payorderunion/'+pid,
        url: '/orders/order/payorderunion/' + pid,
        done: this.goPaySuc,
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
    goDFH() {
      this.$router.push({
        name: 'allOrderDqr',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goDSH() {
      this.$router.push({
        name: 'allOrderYwc',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    // 订单列表数据查询
    userAllOrderSuc(data) {
      // console.log(data)
      this.dfkData = data.data.result;
    },
    userAllOrder() {
      const info = loginInfo();
      WARequest({
        method: 'GET',
        data: {
          orderType: 1,
          statusList: '0,1',
          userId: info['user'].id
        },
        // url:'http://192.168.31.14:8089/orderpay/queryorderpay/',
        url: '/orders/orderpay/queryorderpay/',
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
    showModel() {
      // document.getElementById('megsModel').style.display = 'block';
      this.isShowModel = !this.isShowModel;
    },
  },
  mounted() {
    $('title').html('车猫掌柜-待付款订单');
  }
}
</script>

<style>
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
  width: 100%;
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

.red-font {
  color: #ffc700;
}

.yellow-btn {
  border: 1px solid #fec62e !important;
  color: #fec62e !important;
}

.red-pay-btn {
  border: 1px solid #db4727 !important;
  color: #db4727 !important;
  margin-right: 1em;
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
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
}

.modelBody {
  font-size: 1em;
  max-width: 29.375em;
  width: 87%;
  max-height: 25em;
  background: #f2f2f2;
  margin: 0 auto;
  margin-top: 5.875em;
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
  margin-left: 1.5em;
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

.no-data{
  padding: 5em 0;
  text-align: center;
  font-size: 1.1em;
  color: #444;
}
</style>
