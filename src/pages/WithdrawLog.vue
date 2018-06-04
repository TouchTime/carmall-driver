<template>
  <div class="withdraw-logs-page">
    <div class="withdraw-logs-list">
      <div class="withdraw-item-title">
        <div class="col">描述/时间</div>
        <div class="col">金额(元)</div>
      </div>
      <div v-if="withdrawLogList.length > 0" v-for="(item,index) in withdrawLogList" :key="item.id" class="withdraw-item">
        <div class="col">
          <p>{{item.cashStepDesc}}</p>
          <p class="apply-time">{{formatTime(item.createTime)}}</p>
        </div>
        <div class="col red-font">¥ {{(item.cashNumber || 0).toFixed(2)}}</div>
      </div>
      <div v-else class="no-data">
        <p>您还有没有提现记录！</p>
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
      withdrawLogList : []
    }
  },
  created(){
    const titleNode = document.querySelector('title');
    this.queryWithdrawList();
    titleNode.innerText = `提现记录-${titleNode.innerText}`;
  },
  methods:{
    queryWithdrawList(){
      WARequest({
        url : `/platforms/platform/check/ownercash`,
        data : {userId:storage.get('loginInfo').user.id},
        done : (res)=>{
          this.withdrawLogList = res.data.result;
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
    },
    formatTime(date){
      return moment(date).format("YYYY/MM/DD HH:mm:ss")
    },
  }
}
</script>
<style>
.withdraw-logs-page{
  overflow: auto;
  & .withdraw-item-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8em 6%;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
  }
  & .withdraw-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4em 6%;
    border-bottom: 1px solid #f5f5f5;
    background-color: #fff;
  }
  & .apply-time{
    color: #999;
    font-size: 90%;
  }
  & .no-data{
    background-color: rgba(255,255,255,0);
    color: #999;
  }
  & .red-font{
    color: red;
  }
}
</style>
