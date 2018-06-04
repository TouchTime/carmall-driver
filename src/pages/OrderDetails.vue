<template>
  <div class="order-details">
    <div class="od-list">
      <div class="list-title">购买清单</div>
      <div v-for="(item,index) in orderDetails.orderList" class="od-item">
        <div class="goods-photo"><img :src="item.productUrl" alt=""/></div>
        <div class="goods-desc">
          <p>{{item.productName}} {{item.unit}}</p>
          <p> X {{item.numbers}}</p>
        </div>
        <div class="goods-price">¥ {{item.actualPrice}}</div>
      </div>
    </div>
    <div class="settle-block">
      <div class="block-title">结算</div>
      <div class="settle-body">
        <p><span>总价：</span><span>¥ {{orderDetails.totalSum}}</span></p>
        <p><span>运费：</span><span>¥ {{orderDetails.expressSum}}</span></p>
        <p><span>支付：</span><span class="red-font">¥ {{orderDetails.paySum + orderDetails.expressSum}}</span></p>
      </div>
    </div>
    <div class="settle-block">
      <div class="block-title">订单信息</div>
      <div class="settle-body">
        <p><span>订单编号：</span><span>{{orderDetails.orderCode}}</span></p>
        <p><span>下单时间：</span><span>{{formatTime(orderDetails.createTime)}}</span></p>
        <p><span>下单时间：</span><span>{{formatStatus(orderDetails.status)}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  loginInfo,
  WARequest,
  storage,
  sessionStorage
} from '../util.js';
import moment from 'moment';
moment.locale('zh-CN');
  export default {
    data(){
      return {
        orderDetails : {}
      }
    },
    created(){
      this.queryOrderDetails();
    },
    methods : {
      queryOrderDetails(){
        let unionId = this.$route.query.unionId;
        WARequest({
          url :`/platforms/platform/order/getOrderUnionInfo/${unionId}`,
          method: 'GET',
          data : {},
          done : (res)=>{
            this.orderDetails = res.data;
          },
          fail : (err)=>{
            console.warn(err);
          }
        })
      },
      formatTime(date){
        return moment(date).format("YYYY/MM/DD HH:mm:ss")
      },
      formatStatus(s){
        return ['支付失败','订单提交','支付中','支付成功','接单','发货','确认收货'][s+1]
      }
    }
  }
</script>
<style>
  .order-details{
    overflow: auto;
    & .od-list{
        border-bottom: 1px solid #e5e5e5;
    }
    & .list-title{
      padding: 1em 4%;
      background-color: #fff;
    }
    & .od-item{
      display: flex;
      align-items: center;
      padding: 0 4%;
      background-color: #fff;
    }
    & .goods-photo{
      width: 6em;
    }
    & .goods-desc{
      padding: 0 1em;
      flex-grow: 1;
    }
    & .goods-price{
      width: 5em;
      text-align: right;
    }
    & .settle-block{
      margin: 0.6em 0;
      background-color: #fff;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      & .block-title{
        padding: 0.6em 4%;
      }
    }
    & .settle-body{
      padding: 1px 4%;
      & p{
        margin: 0 0 0.6em 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    & .red-font{
      color: red;
    }
  }
</style>
