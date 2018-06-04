<template>
<div class='balance'>
  <div class='balance-content'>
    <div class='balance-head'>
      <p class='bal-text'>账户余额(元)</p>
      <p class='bal-money' v-if='shopAccount != ""'>{{shopAccount.account | keepTwoNum}}</p>
      <p class='bal-money' v-else>0.00</p>
    </div>
    <ul class='balance-list'>
      <!-- <li v-if='bankInfo && bankInfo.length > 0'>
        <span class='bal-get-text'>到账银行卡号</span>
        <span class='bal-get-bank'>{{bankInfo[0].bankCard | bankCard}}</span>
      </li>
      <li v-if='!bankInfo || bankInfo.length == 0'>
        <span class='bal-get-text'>到账银行卡号</span>
        <span class='bal-go-bank' @click='goBandBank'>点击绑定银行卡</span>
      </li> -->
      <li><span style="color:#999">提现至 “微信钱包零钱” </span></li>
      <li>
        <p class='bal-tx-mon'>提现金额</p>
        <input class='bal-tx-input' type="number" step="0.01" v-model.number='balanceTx' placeholder="¥ 请输入提现金额"/>
      </li>
      <div class="withdraw-explain">
        <p :class="{'disabled':isInvalid}">{{withdrawExplainText}}</p>
        <p><small style='color:#999'>余额中100元为平台提供的补货备用金,可提现金额为100元以上部分</small></p>
      </div>
    </ul>
    <div class='balance-bottom'>
      <p>提现金额：<span class='bal-bot-mon'>￥{{balanceTx || 0}}</span></p>
      <p><a href='javascript:' :class="{'bal-pay-btn':true,'disabled':isInvalid}" @click='balanceData'>提现</a></p>
    </div>
  </div>
  <transition name='txSuccess'>
    <div v-if='isPaySuccess' class='mask txSuc' @click='closePaySuc'>
      <div class='txSuc-box'>提现成功！</div>
    </div>
  </transition>
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
    const info = loginInfo();
    return {
      balanceTx: '',
      isPaySuccess: false,
      bankId: '',
      bankInfo: [],
      uid: info['user'].id,
      // uid:1,
      shopAccount: {}, //余额
    }
  },
  created() {
    this.bankInfo = storage.get('bankInfo') || [];
    // console.log(this.bankInfo)
    // 账户余额
    this.balAccount();
  },
  computed:{
    withdrawExplainText : function(){
      if((this.shopAccount.account-100) < this.balanceTx  && this.balanceTx > 0){
        return `输入的金额超过本次可提现上限`;
      }else{
        return `本次可提现${(this.shopAccount.account-100) > 0 ? (this.shopAccount.account-100).toFixed(2) : 0}元`;
      }
    },
    isInvalid:function(){
      if((this.shopAccount.account-100) < this.balanceTx  && this.balanceTx >= 0){
        return true;
      }else{
        return false;
      }
    }
  },
  mounted() {
    $('title').html('车猫掌柜-余额提现');
  },
  methods: {
    // 关闭模态框
    closePaySuc() {
      this.isPaySuccess = !this.isPaySuccess;
      window.location.reload();
    },
    // 账户余额
    balAccountSuc(data) {
      // console.log(data);
      this.shopAccount = data.shopaaccount;
    },
    balAccount() {
      WARequest({
        url: `/shops/shop/getshopbyuid/${this.uid}`,
        done: this.balAccountSuc,
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
    // 余额提现交互
    balanceDataSuc(data) {
      // console.log(data);
      this.isPaySuccess = !this.isPaySuccess;
    },
    balanceData() {
      if(!this.isInvalid){
        const info = loginInfo();
        let MoneyRegExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; // 金额正则验证
        if (!MoneyRegExp.test(this.balanceTx)) {
          alert('请输入正确的金额！')
        } else {
          WARequest({
            method: 'POST',
            data: {
              userId: info['user'].id,
              bankcardId: this.bankInfo[0] ? this.bankInfo[0].id : '',
              payType: 2,
              cashNumber: this.balanceTx,
              cachBankcard: this.bankInfo[0] ? this.bankInfo[0].bankCard : ''
            },
            url: '/shops/shopaccount/cash/',
            done: this.balanceDataSuc,
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
      }
    },
    // 前往绑定银行卡
    goBandBank() {
      this.$router.push({
        name: 'bankStart',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    }
  },
  filters: {
    'keepTwoNum': function(val) {
      val = Number(val);
      return val.toFixed(2);
    },
    'bankCard': function(num) {
      num = num.toString();
      return num.substr(0, 4) + ' ********* ' + num.substr(-4)
    }
  }

}
</script>
<style>
/*提现成功*/

.txSuc {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}

.txSuc-box {
  width: 72%;
  padding: 2em 1em;
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
  border-radius: 0.8em;
  font-size: 1.2em;
  color: #ffc700;
}

.balance {
  width: 100%;
}

.balance-content {
  width: 100%;
  padding: 1em 1em 0 1em;
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: #fff;
}

.balance-head {
  text-align: center;
  padding: 1em 0;
}

.bal-text {
  color: #999;
}

.bal-money {
  color: #ffc700;
  font-size: 1.5em;
}

.balance-list {
  overflow: hidden;
}

.balance-list>li {
  border-top: 1px solid #f2f2f2;
  padding: 0.8em 0;
  display: flex;
  align-items: center;

}

.balance-list>li:last-child {
  padding: 0.8em 0;
}

.bal-get-text,
.bal-tx-mon {
  color: #999;
  text-align: left;
}

.bal-tx-mon {
  color: #333;
}

.bal-get-bank,
.bal-go-bank,
.bal-tx-input {
  flex-grow: 1;
  text-align: right;
}

.bal-go-bank {
  color: #ffc700
}

.bal-tx-input {
  border: 0;
}

.bal-tx-input:focus {
  outline: none;
}

.balance-bottom {
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 52px;
  line-height: 52px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 1em;
}

.balance-bottom>p {
  flex: 1;
}

.balance-bottom>p:last-child {
  text-align: right;
}

.bal-bot-mon {
  color: #ffc700;
  font-size: 1.2em;
  overflow: hidden;
}

.bal-pay-btn {
  color: #fff;
  display: inline-block;
  width: 80px;
  height: 33px;
  background-color: #ffc700;
  border-radius: 0.2em;
  text-align: center;
  line-height: 33px;
  &.disabled{
    background-color: #999;
  }
}

.txSuccess-enter-active {
  animation: fadeIn 0.3s;
}

.txSuccess-enter-active .txSuc-box {
  animation: zoomIn 0.3s;
}

.txSuccess-leave-active {
  animation: fadeIn 0.3s reverse;
}

.txSuccess-leave-active .txSuc-box {
  animation: zoomIn 0.3s reverse;
}

.withdraw-explain{
  padding: 0.5em 0;
  border-top: 1px solid #f2f2f2;
  & .disabled{
    color: red;
  }
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
  .balance {
    background-color: #333;
  }
  .balance-content {
    width: 75%;
    height: 100%;
    margin: 0 auto;
  }
  .balance-bottom {
    width: 75%;
    left: 12.5%;
  }
  .balance-head {
    padding: 3em 0;
  }
  .bal-money {
    font-size: 1.5em;
  }
  .balance-list>li {
    padding: 0.5em 0;
  }
}
</style>
