<template>
  <div class="trading-logs-page">
    <div class="trading-logs-tab">
      <div @click="cutTab(index)" v-for="(item,index) in tabs" :key="index" :class="{'tab-item':true,'active':currIndex == index}">{{item.label}}</div>
    </div>
    <div class="tab-container">
      <div class="tab-item-box">
        <div class="logs-list">
          <div class="logs-item-title">
            <div class="col">时间/订单编号</div>
            <div class="col">金额(元)</div>
          </div>
          <div v-for="(item,index) in tabs[currIndex].listData" :key="item.id" class="logs-item" @click="showLogs(item)">
            <div class="col">
              <span>{{formatTime(item.createTime)}}</span><br/>
              <small>{{item.orderCode}}</small><br/>
              <span class="status-desc">{{['支付失败','提交','支付中','支付成功','接单','发货','确认收货'][item.status+1]}}</span>
            </div>
            <div class="col">¥ {{(item.paySum + item.expressSum).toFixed(2)}}</div>
          </div>
        </div>
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
      currIndex : 0,
      tabs : [{
        label : '提货记录',
        listData : []
      },{
        label : '销售记录',
        listData : []
      }]
    }
  },
  created(){
    const titleNode = document.querySelector('title');
    this.queryTradList({type:1});
    titleNode.innerText = `交易记录-车猫掌柜`;
    if(sessionStorage.get('tlogsIndex')){
      this.cutTab(sessionStorage.get('tlogsIndex'));
    }
  },
  methods:{
    cutTab(index){
      this.currIndex = index;
      this.queryTradList(index == 0 ? {type:1} : {type:2});
      sessionStorage.set('tlogsIndex',index);
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    },
    queryTradList(param){
      WARequest({
        url : `/orders/order/getorderunionpage`,
        data : Object.assign({},{shopId:storage.get('shopID')},param),
        done : (res)=>{
          let oldTabs = Object.assign({},this.tabs);
          oldTabs[this.currIndex].listData = res.data.result.reverse();
          this.tabs = oldTabs;
        },
        fail : (err)=>{
          if(err.responseJSON){
						if (err.responseJSON.error_mesg) {
							alert(err.responseJSON.error_mesg);
						} else if (err.responseJSON.error) {
							alert(err.responseJSON.error);
						}
					}else{
						alert('交易记录获取失败！');
					}
        }
      })
    },
    showLogs(item){
      this.$router.push({
        name: 'orderDetails',
        query: {
          timestamp: (new Date()).getTime(),
          unionId : item.id
        }
      })
    }
  }
}
</script>
<style>
.trading-logs-page{
  overflow: auto;
  & .trading-logs-tab{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  & .tab-item{
    position: relative;
    padding: 0 0.5em;
    line-height: 44px;
    text-align: center;
    &::before{
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: #fec62e;
      transition: all 0.3s;
    }
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      right: 50%;
      width: 0;
      height: 2px;
      background-color: #fec62e;
      transition: all 0.3s;
    }
    &.active{
      color: #fec62e;
    }
    &.active::before{
      width: 50%;
    }
    &.active::after{
      width: 50%;
    }
  }
  & .tab-item-box{
    background-color: #fff;
    color: #666;
  }
  & .logs-item-title{
    display: flex;
    padding: 0.8em 6%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  & .logs-item{
    position: relative;
    display: flex;
    padding: 0.8em 8% 0.8em 6%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    &::after{
      content : '';
      position: absolute;
      top: 50%;
      right: 1em;
      width: 0.8em;
      height: 0.8em;
      margin-top: -0.4em;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      transform: rotate(45deg);
    }
    & small{
      font-size: 95%;
      color: #999;
    }
    & .status-desc{
      font-size: 95%;
    }
  }
}
</style>
