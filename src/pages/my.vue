<template>
<div class='me'>
  <div class='me-content'>
    <div class='me-con-head'>
      <div class='me-head-userH' v-if="headImg == ''" :style="{backgroundImage:'url('+headPhoto+')'}"></div>
      <div class='me-head-userH' v-if="headImg !== ''" :style="{backgroundImage:'url('+headImg+')'}"></div>
      <div class='me-head-text'>
        <p>我的余额</p>
        <p v-if='myBalance'>
          <span class='me-head-font'>{{(myBalance.account || 0) | keepTwoNum}}元</span>
        </p>
      </div>
    </div>
    <div class='me-con-order'>
      <div class='me-order-title'>补货状态</div>
      <ul class='me-order-list'>
        <li class='me-order-item' @click='goDfk'>
          <p class='me-dfk'>待付款</p>
        </li>
        <li class='me-order-item' @click='goDqr'>
          <p class='me-dfh'>待确认</p>
        </li>
        <li class='me-order-item' @click='goYwc'>
          <p class='me-dsh'>已完成</p>
        </li>
      </ul>
    </div>
    <ul class='me-con-user'>
      <li class='me-user-list' @click='goGetAd'>
        <p class='shdz'></p>
        <p>收货地址</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goAwardLog'>
        <p class='award-icon'></p>
        <p>推荐奖励</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goTradingLog'>
        <p class='deal-icon'></p>
        <p>交易记录</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goEarningsLog'>
        <p class='earnings-icon'></p>
        <p>收益记录</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goWithdrawLog'>
        <p class='withdraw-icon'></p>
        <p>提现记录</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goBalance'>
        <p class='yetx'></p>
        <p>余额提现</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='goBank'>
        <p class='yhk'></p>
        <p>我的银行卡</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='showMyQrcode'>
        <p class='icon-qrcode'></p>
        <p>店铺二维码</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click="showShareQrcode">
        <p class='tjlj'></p>
        <p>推荐二维码</p>
        <p class='arrow-rt'></p>
      </li>
      <li class='me-user-list' @click='offerMoneys'>
        <p class='yetx'></p>
        <p>押金</p>
        <p class='arrow-rt'></p>
      </li>
    </ul>
    <div class="back-btn-bar">
      <div class="back-btn" @click="goBack">返 回</div>
    </div>
  </div>
  <transition name="showDetails">
    <div v-if="isShare" class="mask share" @click="isShare = false">
      <div class="details-box">
        <div id="share-qrcode"></div>
      </div>
    </div>
  </transition>
  <transition name="showDetails">
    <div v-show="isShowQrCode" ref="myQrcodeMask" class="mask my-qrcode" @click="closeQrcodeMask">
      <div class="qrcode-box">
        <div id="qrcodeImg" class="qrcode-img"></div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import {
  WARequest,
  loginInfo,
  storage,
  scanQR
} from '../util.js'
import shareArrows from '../assets/share-arrows.png'
import headPhoto from '../assets/user-head.png'
export default {
  data() {
    const info = loginInfo();
    return {
      headPhoto,
      headImg: info['user'].headImg,
      shareArrows,
      isShare: false,
      choseBank: 1,
      myBalance: '',
      uid: info['user'].id,
      shopInfo : {},
      isShowQrCode:false
    }
  },
  created() {
    this.bankInfo = storage.get('bankInfo');
    this.shopInfo = storage.get('shopInfo');
    // console.log(this.bankInfo)
    // 我的余额
    this.balAccount();
  },
  mounted() {
    const shop = this.shopInfo.shop;
    shop.qrUrl && $('#qrcodeImg').qrcode(shop.qrUrl);
    $('title').html('掌柜信息');
  },
  methods: {
    // 账户余额
    balAccountSuc(data) {
      // console.log(data);
      this.myBalance = data.shopaaccount;
    },
    balAccount() {
      WARequest({
        // url:`http://192.168.31.14:8086/shop/getshopbyuid/`+'1',
        url: `/shops/shop/getshopbyuid/` + this.uid,
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
    goBalance() {
      this.$router.push({
        name: 'balance',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goShop() {
      this.$router.push({
        name: 'shopList',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goStatistics() {
      this.$router.push({
        name: 'statistics',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goBank() {
      if (this.bankInfo) {
        this.$router.push({
          name: 'bank',
          query: {
            timestamp: (new Date()).getTime()
          }
        })
      } else {
        this.$router.push({
          name: 'bankStart',
          query: {
            timestamp: (new Date()).getTime()
          }
        })
      }
    },
    goPwd() {
      this.$router.push({
        name: 'password',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goGetAd() {
      this.$router.push({
        name: 'myAddress',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goDfk() {
      this.$router.push({
        name: 'allOrderDzf',
        query: {
          timestamp: (new Date()).getTime()
        },

      })
    },
    goDqr() {
      this.$router.push({
        name: 'allOrderDqr',
        query: {
          timestamp: (new Date()).getTime()
        },

      })
    },
    goYwc() {
      this.$router.push({
        name: 'allOrderYwc',
        query: {
          timestamp: (new Date()).getTime()
        },

      })
    },
    bindQrcode(ewcode,cb){
      const shop = this.shopInfo.shop;
      WARequest({
        url : `/shops/shop/bindewCode/${shop.id}`,
        method : 'POST',
        dataType : 'JSON',
        data : {
          shopId : shop.id,
          ewcode : ewcode
        },
        done : (res)=>{
          console.log(res);
          this.shopInfo = Object.assign({},this.shopInfo,{shop:res.data});
          storage.set('shopInfo',this.shopInfo);
          cb && cb()
        },
        fail : (err)=>{
          if(err.responseJSON){
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }else{
              alert(err.message);
            }
          }else{
            alert('二维码绑定失败！');
          }
        }
      })
    },
    showMyQrcode(){
      const shop = this.shopInfo.shop;
      if(shop.qrUrl){
        this.isShowQrCode = true;
      }else{
        scanQR((code)=>{
          let codeArr = code.split('/');
          if(codeArr.length > 2){
            codeArr = codeArr[codeArr.length - 2];
            console.log(codeArr);
            this.bindQrcode(codeArr,()=>{
              $('#qrcodeImg').qrcode(this.shopInfo.shop.qrUrl);
              alert('二维码绑定成功！');
            });
          }else{
            alert('二维码格式不正确！');
          }
        })
      }
    },
    closeQrcodeMask(e){
      if(this.$refs.myQrcodeMask == e.target){
        this.isShowQrCode = false;
      }
    },
    goAwardLog(){
      this.$router.push({
        name : 'awardLog',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goEarningsLog(){
      this.$router.push({
        name: 'earningsLog',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goTradingLog(){
      this.$router.push({
        name: 'tradingLog',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goWithdrawLog(){
      this.$router.push({
        name: 'withdrawLog',
        query : {
          timestamp: (new Date()).getTime()
        }
      })
    },
    offerMoneys() {
      this.$router.push({
        name: 'offerMoney',
        query : {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goBack(){
      this.$router.go(-1);
    },
    showShareQrcode(){
      this.isShare = true;
      const info = loginInfo();
      setTimeout(()=>{
        $('#share-qrcode').qrcode(`https://cartmall.net/enters/selfd/driver/1?param=${info.user.id}`);
      }, 10);
    }
  },
  filters: {
    'keepTwoNum': function(val) {
      val = Number(val);
      return val.toFixed(2);
    }
  }

}
</script>
<style>
/*me详细列表*/
.shareImg {
  width: 6em;
  margin: 0 auto;
}

.me-con-user {
  width: 100%;
  background-color: #fff;
  margin-top: 0.4em;
  padding-top: 0.5em;
}

.me-user-list {
  width: 90%;
  margin: 0 auto;
  padding: 0.6em 0;
  display: flex;
  border-bottom: 1px solid #f8f8f8;
}

.me-user-list>p {
  flex: 5;
  line-height: 1.8em;
}

.me-user-list>p:first-child {
  width: 2em;
  height: 2em;
  flex: 1;
  text-align: left;
  background-position: 10% 15%;
  background-size: 50%;
  background-repeat: no-repeat;
}

.me-user-list>p:last-child {
  float: right;
  flex: 1;
}

.yetx {
  background-image: url('../assets/te.png');
}

.dpsp {
  background-image: url('../assets/dp.png');
}

.yxtj {
  background-image: url('../assets/tz.png');
}

.yhk {
  background-image: url('../assets/yhk.png');
  background-size: 46% !important;
}

.me-user-list p.tjlj {
  background-image: url('../assets/share-b.png');
  background-size: 42%;
}

.shdz {
  background-image: url('../assets/location.png');
}

.icon-qrcode{
  background-image: url('../assets/qrcode.png');
  background-size: 45% !important;
}
.deal-icon{
  background-image: url('../assets/deal-icon.png');
  background-size: 45% !important;
}
.earnings-icon{
  background-image: url('../assets/earnings-icon.png');
  background-size: 45% !important;
}
.withdraw-icon{
  background-image: url('../assets/withdraw-icon.png');
  background-size: 50% !important;
}
.award-icon{
  background-image: url('../assets/award-icon.png');
  background-size: 50% !important;
}

.arrow-rt {
  width: 2em;
  height: 2em;
  text-align: right;
  background: url('../assets/arrows-link.png') no-repeat 85% 50% / 45%;
  opacity: 0.8;
}

/*me所有订单*/

.me-con-order {
  background-color: #fff;
}

.me-order-list {
  display: flex;
  padding: 0.5em 0;
}

.me-order-title {
  padding: 0.6em 1em;
  overflow: hidden;
  text-align: center;
  background-color: #f1f1f1;
  border-bottom: 1px solid #f2f2f2;
}

.me-order-all {
  float: left;
}

.me-order-arrow {
  width: 2em;
  height: 1.2em;
  float: right;
  background: url('../assets/arrows-link.png') no-repeat 50% 50% / 80%;
}

.me-order-item {
  flex: 1;
  text-align: center;
}

.me-order-item>p {
  padding-top: 4.4em;
  background-repeat: no-repeat;
  background-size: 45%;
  background-position: 50% 10%;
}

.me-dfk {
  background-image: url('../assets/mn-1.png')
}

.me-dfh {
  background-image: url('../assets/mn-2.png')
}

.me-dsh {
  background-image: url('../assets/mn-3.png')
}

/*me头部*/

.me {
  width: 100%;
  background-color: #fff;
  overflow: auto;
}

.me-content {
  width: 100%;
  margin: 0 auto;
  background-color: #f2f2f2;
}

.me-con-head {
  padding: 1em 0;
  background-color: #efc31c;
}

.me-head-userH {
  height: 4em;
  width: 4em;
  border-radius: 100%;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.me-head-text {
  margin-top: 0.5em;
  text-align: center;
  color: #fff;
}

.me-head-font {
  font-size: 1.5em;
  color: #333;
}

@media (min-width:768px) {
  .me-content {
    width: 75%;
    height: 100%;
  }
  .me {
    background-color: #333;
  }
  .me-con-head {
    padding: 3em 0;
  }
  .me-order-title {
    padding: 1em;
  }
  .me-con-user {
    height: 100%;
  }
  .me-order-list {
    padding: 1em 0;
  }
  .me-order-item>p {
    padding-top: 7em;
  }
  .me-user-list {
    padding: 0.5em 0;
  }
  .me-user-list>p {
    line-height: 2.2em;
  }
  .me-user-list>p:first-child {
    height: 2.5em;
    background-position: 50% 15%;
    background-size: 40%;
  }
  .arrow-rt {
    background-size: 45%;
  }
}

.me {
  & .my-qrcode{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .qrcode-box{
    width: 60%;
    margin: 0 auto;
    text-align: center;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    & .qrcode-img canvas{
      width: 100%;
      border: 0.8em solid #fff;
      box-sizing: border-box;
    }
  }
  & .showDetails-enter-active{
    animation: fadeIn 0.3s;
    & .qrcode-box{
      animation: zoomIn 0.3s;
    }
  }
  & .showDetails-leave-active{
    animation: fadeIn 0.3s reverse;
    & .qrcode-box{
      animation: zoomIn 0.3s reverse;
    }
  }
  & .back-btn-bar{
    padding: 2em 0;
    background-color: #fff;
  }
  & .back-btn{
    width: 90%;
    margin: 0 auto;
    line-height: 3em;
    text-align:center;
    background-color: #eee;
  }
  & #share-qrcode{
    width: 100%;
    & canvas{
      box-sizing: border-box;
    }
  }
  & .details-box{
    padding: 1em;
  }
}



@keyframes zoomIn {
  0%{
    opacity: 0;
    transform: scale3d(0.3,0.3,1);
  }
  100%{
    opacity: 1;
    transform: none;
  }
}
</style>
