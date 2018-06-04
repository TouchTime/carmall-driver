<template>
<div class='bank'>
  <div class='bank-content'>
    <div class='bank-list' v-if='bankInfo'>
      <div class='bank-id' v-if='bankInfo.bankCard != null'>{{bankInfo.bankCard | bankCardFilter}}</div>
      <div class='bank-user-info'>
        <p><span class='bank-cardholder'>持卡人：</span><span>{{bankInfo.bankUsername}}</span></p>
        <!--<p class='bank-user-del'>解除绑定</p>-->
      </div>
    </div>
    <div v-else class='bank-list-zwsj'>暂无绑定的银行卡！<br/>前往 <span @click='goBandBank' style='color:#ffc700'>绑定</span></div>
  </div>
</div>
</template>
<script>
import {
  WARequest,
  storage,
  loginInfo
} from '../util.js'
export default {
  data() {
    const info = loginInfo();
    return {
      bankInfo: [],
      uid: info['user'].id,
    }
  },
  created() {
    this.bankList();
  },
  mounted() {
    $('title').html('车猫掌柜-我的银行卡');
  },
  methods: {
    // 前往绑定银行卡
    goBandBank() {
      this.$router.replace({
        name: 'bankStart',
        query: {
          timestamp: (new Date()).getTime()
        }
      });
    },
    // 查询银行卡列表
    bankListSuc(data) {
      // console.log(data)
      this.bankInfo = data.data[0];
      storage.set('bankInfo', data.data);
    },
    bankList() {
      WARequest({
        // url:'http://192.168.31.14:8089/shopaccount/cardlist/'+'1',
        url: `/shops/shopaccount/cardlist/${this.uid}`,
        done: this.bankListSuc,
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
    }
  },
  filters: {
    'bankCardFilter': function(val) {
      val = val.toString();
      return val.substr(0, 4) + ' ********* ' + val.substr(-4)
    }
  }
}
</script>
<style>
.bank-list-zwsj {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1em;
  color: #999;
  text-align: center;
}

.bank-content {
  width: 100%;
  padding-top: 2em;
}

.bank-list {
  width: 90%;
  background-color: #f8f8f8;
  padding: 1.5em;
  box-sizing: border-box;
  border-radius: 0.8em;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.bank-title {
  overflow: hidden;
}

.bank-img,
.bank-name {
  float: left;
  line-height: 3em;
}

.bank-img {
  width: 3em;
  height: 3em;
  background-image: url(../assets/ny.png);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.bank-id {
  font-size: 1.4em;
  padding: 0.4em 0.5em;

}

.bank-user-info {
  width: 90%;
  margin: 0 auto;
}

.bank-cardholder {
  color: #999;
}

@media (min-width:768px) {
  .bank {
    background-color: #333;
  }
  .bank-content {
    width: 75%;
    margin: 0 auto;
    height: 100%;
    background-color: #f2f2f2;
  }
  .bank-list {
    width: 75%;
  }
}
</style>
