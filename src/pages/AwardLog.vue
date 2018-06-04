<template>
  <div class="award-logs-list">
    <div class="logs-list">
      <div class="award-item-title">
        <div class="col">描述/时间</div>
        <div class="col">金额(元)</div>
      </div>
      <div v-if="logsList.length > 0" v-for="(item,index) in logsList" :key="item.createTime" class="award-item">
        <div class="col">
          <p>{{item.typeName}}-{{item.fromUserName}}</p>
          <p class="create-time">{{formatTime(item.createTime)}}</p>
        </div>
        <div class="col red-font">¥ {{(item.sum || 0).toFixed(2)}}</div>
      </div>
      <div v-else class="no-data">
        <p>您还有任何记录！</p>
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
      logsList : []
    }
  },
  created(){
    this.queryAwardLogs();
  },
  methods : {
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    },
    queryAwardLogs(){
      WARequest({
        url : `/shops/shopaccount/reward/${storage.get('shopID')}`,
        data : {page:1,size:100,type:5,islook:1},
        done : (res)=>{
          this.logsList = res.data.allRewardList;
        },
        fail : (err)=>{
          if(err.responseJSON){
						if (err.responseJSON.error_mesg) {
							alert(err.responseJSON.error_mesg);
						} else if (err.responseJSON.error) {
							alert(err.responseJSON.error);
						}
					}else{
						alert('获取提现记录失败！');
					}
        }
      });
    }
  }
}
</script>
<style>
.award-logs-list{
  overflow: auto;
  & .award-item-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8em 6%;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
  }
  & .award-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6em 6%;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
  }
  & .create-time{
    color: #999;
  }
  & .red-font{
    color: red;
  }
}
</style>
