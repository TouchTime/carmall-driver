<template>
  <div class="earnings-logs-page">
    <div class="earnings-logs-tab">
      <div @click="cutTab(index)" v-for="(item,index) in tabs" :key="index" :class="{'tab-item':true,'active':currIndex == index}">{{item.label}}</div>
    </div>
    <div class="tab-container">
      <div class="tab-item-box">
        <div class="logs-list">
          <div class="logs-item-title">
            <div class="col">时间</div>
            <div class="col">金额(元)</div>
          </div>
          <div v-if="tabs[currIndex].listData.length > 0" v-for="(item,index) in tabs[currIndex].listData" :key="item.id" class="logs-item">
            <div class="col"><span>{{formatTime(item.createTime)}}</span><br/><small>{{item.orderCode}}</small></div>
            <div class="col red-font">¥ {{(item.sum).toFixed(2)}}</div>
          </div>
          <div v-if="tabs[currIndex].listData.length < 1" class="no-data">
            <p>您还有任何记录！</p>
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
        label : '销售利润',
        listData : []
      },{
        label : '推荐分润',
        listData : []
      },{
        label : '推荐奖励',
        listData : []
      }]
    }
  },
  created(){
    const titleNode = document.querySelector('title');
    this.queryLogList();
    titleNode.innerText = `收益记录-${titleNode.innerText}`;
  },
  methods : {
    cutTab(index){
      this.currIndex = index;
      if(index == 0){
        this.queryLogList({type:1});
      }else if(index == 1){
        this.queryLogList({type:4});
      }else{
        this.queryLogList({type:5});
      }
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    },
    queryLogList(param){
      WARequest({
        url : `/shops/shopaccount/${storage.get('shopID')}`,
        data: Object.assign({},{type:4,status:1},param),
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
						alert('获取收益列表失败！');
					}
        }
      });
    }
  }
}
</script>
<style>
.earnings-logs-page{
  overflow: auto;
  & .earnings-logs-tab{
    display: flex;
    align-items: center;
    justify-content: space-around;
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
    display: flex;
    padding: 1em 6%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    & small{
      font-size: 95%;
      color: #999;
    }
  }
  & .red-font{
    color: red;
  }
}
</style>
