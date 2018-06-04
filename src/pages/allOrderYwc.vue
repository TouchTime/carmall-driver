<template>
<div class="page order-page">
  <div class='orderConent'>
    <div class="order-tab">
      <!--<div  @click="goDZF"class="tab-item ">待付款</div>
        <div  @click="goDFH" class="tab-item ">待确认</div>-->
      <div class="tab-item">已完成</div>
    </div>
    <div class="tab-container">
      <div class="tab-item-box">
        <ul class="order-list">
          <li class='proOrder' v-for='(item,i) in dfkData'>
            <div class='order-sel-list'>
              <div class='order-sel-item'>
                <div class="order-title"><span>订单编号：{{item.orderCode}}</span><span class="red-font">已完成</span></div>
                <div class="order-goods-list">
                  <div class='order-goods-wrap' v-for='(gv,index) in item.orderList'>
                    <div class="ogl-item" :style="{backgroundImage:'url('+gv.productUrl+')'}"></div>
                    <div class="ogl-desc">
                      <p>{{gv.productName || ''}}</p>
                      <p class="yellow-font">¥ {{gv.actualPrice || 0}}</p>
                    </div>
                    <div class="ogl-count">X {{gv.numbers || 0}}</div>
                  </div>
                </div>
                <div class="order-footer"><span>{{item.account}}</span>订单金额：<span style='color:#ffc700'>￥{{item.paySum}}</span></div>
              </div>
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
          <p>您还没有已完成的订单</p>
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
  storage,
  sessionStorage
} from '../util.js'
import xmtx from '../assets/xmtx.png'
import nrg from '../assets/nrg.png'
import seeds from '../assets/seeds.png'
import nrb from '../assets/nrb.png'
import redn from '../assets/redn.png'
export default {
  data() {
    return {
      dfkData: '', //待付款列表
      isShowModel: false,
      currIndex: this.$route.params.id,
      tabs: ['全部', '待付款', '待发货', '待收货'],
      orderList: []
    }
  },
  created() {
    this.userAllOrder();
    window.shopID = Number(sessionStorage.get('shopID'));
  },
  methods: {
    goDFH() {
      this.$router.push({
        name: 'allOrderDqr'
      })
    },
    goDZF() {
      this.$router.push({
        name: 'allOrderDzf'
      })
    },
    // 订单列表数据查询
    userAllOrder() {
      const info = loginInfo();
      WARequest({
        data: {
          type: 1,
          shopId: window.shopID || '',
          userId: info['user'].id,
          status: 5
        },
        // url:'http://192.168.31.14:8089/order/getorderunionpage/',
        url: '/orders/order/getorderunionpage/',
        done: (data) => {
          this.dfkData = data.data.result
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
    closeShowModel() {
      this.isShowModel = !this.isShowModel;
    },
    chooseTab(index) {
      // this.currIndex = index;
      this.currIndex = index;
    },
    showModel() {
      this.isShowModel = !this.isShowModel;
    },
    deleteOrder(i) {
      this.orderList.splice(i, 1);
    }
  },
  mounted() {
    $('title').html('车猫掌柜-已完成订单');
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
  border-bottom: 1px solid #eee;
}

.red-font {
  color: #ffc700;
}

.order-page .order-goods-list .order-goods-wrap{
  position: relative;
  padding: 0.5em 4%;
  display: flex;
  align-items: center;
  &::after{
    content : '';
    position: absolute;
    bottom: 0;
    left: 5%;
    right: 5%;
    height: 1px;
    background-color: #f5f5f5;
  }
}
.order-page .order-goods-wrap .ogl-desc{
  flex-grow: 1;
  padding: 0 1em;
}
.order-page .order-goods-list .ogl-item {
  width: 4em;
  height: 4em;
  box-sizing: border-box;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
.order-page .order-goods-wrap .ogl-count{
  width: 3em;
  flex-shrink: 0;
}

.order-page .order-footer {
  padding: 0 4%;
  line-height: 2.8em;
  text-align: right;
}

.order-page .order-opts {
  padding: 0.5em 4%;
  text-align: right;
  border-top: 1px solid #f5f5f5;
}

.order-page .order-opts span {
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #ddd;
  line-height: 1.8em;
  padding: 0 1em;
  border-radius: 0.9em;
  margin-left: 1em;
  font-size: 90%;
  color: #999;
}

.yellow-btn {
  border: 1px solid #fec62e !important;
  color: #fec62e !important;
}

.red-btn {
  border: 1px solid #db4727 !important;
  color: #db4727 !important;
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
</style>
