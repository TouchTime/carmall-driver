<template>
<div class='sureOrder'>
  <div class='sureOrder-content'>
    <div class='so-container' v-show='goodIndex == 1'>
      <div @click='goAddress' v-if="chooseAddr == null" class='so-address-write'>
        请填写收货地址
        <img class='so-address-ar' :src='images[0]' />
      </div>
      <div class='so-address-info' v-if="chooseAddr !== null">
        <div>
          <div class='so-user-name'>
            <p>收货人：{{chooseAddr.customerName}}</p>
            <p>{{chooseAddr.mobile}}</p>
          </div>
          <div class='so-user-adress'>
            <p class='so-ad-img'><img :src='images[1]' /></p>
            <p class='so-ad-text' v-if='chooseAddr.street'>收货地址：{{chooseAddr.province}}{{chooseAddr.city}}{{chooseAddr.address}}{{addressForm.street}}</p>
            <p class='so-ad-text' v-else>收货地址：{{chooseAddr.province}}{{chooseAddr.city}}{{chooseAddr.address}}</p>
            <p class='so-ad-img' @click='goChooseAddr'><img :src='images[0]' /></p>
          </div>
        </div>
      </div>
    </div>
    <div class='so-line'></div>
    <div class='so-pro-list' v-if='homeOrderList.orderUnionDtoList.length > 0' v-for='(item,index) in homeOrderList.orderUnionDtoList'>
      <ul class='so-product'>
        <li class='so-pro-item' v-for='(list,i) in item.orderList'>
          <div class='so-pro-img' :style='{backgroundImage:"url("+list.productUrl+")"}'></div>
          <div class='so-pro-info'>
            <p class='so-pro-title'>{{list.productName}}</p>
            <p class='so-pro-size'>规格：{{list.unit}}</p>
            <p class='so-pro-price'>￥{{(list.actualPrice || 0).toFixed(2)}}</p>
          </div>
          <div class='so-pro-num'><span>x{{list.numbers}}</span></div>
        </li>
      </ul>
      <div class='so-order-amount'>
        <ul class='so-amount-list'>
          <li class='so-amount-item'>
            <span class='so-amount-text'>运费</span>
            <span class='so-amount-price'>￥{{(item.expressSum || 0).toFixed(2)}}</span>
          </li>
          <li class='so-amount-item'>
            <span class='so-amount-text'>总金额</span>
            <span class='so-amount-price'>￥ {{(item.paySum || 0).toFixed(2)}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class='so-order-way'>
      <div class='so-oder-select'>
        <p>提货方式</p>
        <p v-for='(item,index) in getGoodsWay' @click='selectWay(item,index)'>
          <span :class='{"so-o-select":index == goodIndex}' class='so-o-btn'></span>
          <span>{{item.getText}}</span>
        </p>
      </div>
    </div>
    <div v-if="warehouseList && warehouseList.length > 0 && goodIndex == 0" class="warehouse-list">
      <h3>提货点列表</h3>
      <div v-for="(item,index) in warehouseList" :key="item.id" class="warehouse-item">
        <div class="wi-left">
          <div class="warehouse-item-name">
            <span>{{item.store}}</span>
          </div>
          <div class="warehouse-item-addr">
            <span>{{item.storeAddress}}</span>
          </div>
        </div>
        <div class="wi-right">
          <a :href="'tel:'+item.storePhone" class="icon-phone"></a>
        </div>
      </div>
    </div>
  </div>
  <div class='so-bottom'>
    <div class='so-bottom-lf'>
      <span>实付款：</span>
      <span class='so-botton-total'>￥ {{((homeOrderList.orderPay.payActualSum*100) + (homeOrderList.orderPay.payActualAccountSum*100))/100}}</span>
    </div>
    <div class='so-bottom-rt'>
      <span @click='goPay' class='so-bottom-payBtn'>支付</span>
    </div>
  </div>
  <transition name='isSureBand'>
    <diV v-if='isSurePay' class="mask surePay" @click='isSurePay = !isSurePay'>
      <div class="surePay-box">
        <p class="surePay-sure">确定支付吗？</p>
        <p class="surePay-chose">
          <span class="surePay-no" href='javascript:' @click='cancelPay'>取消</span>
          <span class="surePay-yes" href='javascript:' @click='surePay'>确定</span>
        </p>
      </div>
    </diV>
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
import link from '../assets/arrows-link.png'
import location from '../assets/location.png'
export default {
  data() {
    var info = loginInfo();
    return {
      isSurePay: false,
      images: [link, location],
      soOrderRemark: '', //订单备注
      adMsg: '', //存放地址
      adMessage: this.$route.query.adMsg, //接收地址
      // sureO:'',//存放订单信息
      sureOrderList: '', //收货地址信息
      homeProList: '', //订单信息
      homeOrderList: '', //全部订单信息
      homeOrderPayList: '',
      orderId: '', //订单生成之后的订单id
      // sureOList:this.$route.query.sureOrderList,//接收订单列表
      proId: '',
      orderList: [], //空数组接收订单信息
      carriage: '10.00', //运费
      getGoodsWay: [{
          getText: '自提',
          getNum: '0'
        },
        {
          getText: '快递',
          getNum: '1'
        }
      ],
      goodIndex: 0,
      payOrderId: '', //支付id
      addrList: '',
      chooseAddr: '',
      uid: 2000000017,
      buyUid: info['user'].id,
      warehouseList : []
    }
  },
  created() {
    var that = this;
    if (that.adMessage != null) {
      storage.set('adm', this.adMessage);
      this.adMessage = storage.get('adm');
    }
    // this.sureOrderList = JSON.parse(window.localStorage.getItem('sureOrderList'));
    this.addressForm = storage.get('addressForm');
    this.homeOrderList = storage.get('homeOrderList');
    this.homeOrderPayList = storage.get('homeOrderPayList');
    this.chooseAddr = storage.get('chooseAddr');
    //获取仓库列表
    this.getWarehouseList();
  },
  methods: {
    // 确定支付
    surePay() {
      this.actualPay();
    },
    // 取消支付
    cancelPay(e) {
      if (e.target == this.$refs.surePay) {
        this.isSurePay = !this.isSurePay
      }
    },
    // 支付
    actualPaySuc(res) {
      console.log(res)
      this.payOrderId = res.data.payOrderId;
      // 调用支付宝支付
      // this.alipay()
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
          wapHtml: res.data.wapHtml,
          done: (res) => {
            this.$router.push({
              name: 'pay',
              query: {
                timestamp: (new Date()).getTime()
              }
            });
          },
          fail : (err)=>{
            this.$router.push({
              name: 'fail',
              query: {
                timestamp: (new Date()).getTime()
              }
            });
          }
        });
      } else {
        //余额支付
        this.$router.push({
          name: 'pay',
          query: {
            timestamp: (new Date()).getTime()
          }
        });
      }
    },
    actualPay() {
      const info = loginInfo();
      WARequest({
        method: 'POST',
        data: {
          uid: info['user'].id,
          // uid:this.uid,
          payType: 2
        },
        //url:`http://192.168.31.14:8085/order/payorderunion/${this.orderId}`,
        url: `/orders/order/payorderunion/${this.orderId}`,
        done: this.actualPaySuc,
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
    // 确认订单
    goPaySuc(data) {
      // console.log(data)
      this.orderId = data.data.orderPay.id;
      this.isSurePay = !this.isSurePay;
    },
    payChooseKd() {
      if (this.chooseAddr && this.chooseAddr.province && this.chooseAddr.city) {
        WARequest({
          method: 'POST',
          data: {
            takeType: 1,
            address: this.chooseAddr.province + this.chooseAddr.city + this.chooseAddr.address + this.chooseAddr.street,
            consignee: this.chooseAddr.customerName,
            phone: this.chooseAddr.mobile,
            isShow: 0,
            buyUid: this.buyUid,
            // buyUid:this.uid,
            shoppingWay: 2,
            orderType: 1,
            choosedShopProductList: this.homeOrderPayList
          },
          //url:'http://192.168.31.14:8085/order/userbuyproduct/',
          url: '/orders/order/userbuyproduct/',
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
      } else {
        alert('请选择收货地址！');
      }
    },
    payChooseZt() {
      WARequest({
        method: 'POST',
        data: {
          takeType: 0,
          isShow: 0,
          buyUid: this.buyUid,
          // buyUid:this.uid,
          shoppingWay: 2,
          orderType: 1,
          choosedShopProductList: this.homeOrderPayList
        },
        //url:'http://192.168.31.14:8085/order/userbuyproduct/',
        url: '/orders/order/userbuyproduct/',
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
    goPay() {
      if (this.goodIndex == 0) {
        this.payChooseZt();
      } else {
        this.payChooseKd();
      }
    },
    // 选择快递
    kdFun() {
      WARequest({
        method: 'POST',
        data: {
          takeType: 1,
          isShow: 1,
          buyUid: this.buyUid,
          // buyUid:this.uid,
          shoppingWay: 1,
          orderType: 1,
          choosedShopProductList: this.homeOrderPayList
        },
        //url:'http://192.168.31.14:8085/order/userbuyproduct/',
        url: '/orders/order/userbuyproduct/',
        done: (data) => {
          this.homeOrderList = data.data
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
    // 选择自提
    ztFun() {
      WARequest({
        method: 'POST',
        data: {
          takeType: 0,
          isShow: 1,
          buyUid: this.buyUid,
          // buyUid:this.uid,
          shoppingWay: 1,
          orderType: 1,
          choosedShopProductList: this.homeOrderPayList
        },
        //url:'http://192.168.31.14:8085/order/userbuyproduct/',
        url: '/orders/order/userbuyproduct/',
        done: (data) => {
          this.homeOrderList = data.data
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
    // 选择提货方式
    selectWay(item, index) {
      storage.set('goodIndex', index);
      this.goodIndex = storage.get('goodIndex');
      if (index == 0) {
        this.ztFun();
      } else {
        this.kdFun();
      }
    },
    // 接收itemId
    getQueryString: function(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    // 填写地址
    goChooseAddr() {
      this.$router.push({
        name: 'myAddress',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    goAddress() {
      this.$router.replace({
        name: 'myAddress',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    getWarehouseList(){
      WARequest({
        url : '/platforms/platform/store',
        data : {page :1,size:10},
        done : (res)=>{
          this.warehouseList = res.data.result;
        },
        fail : (err)=>{
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            alert('获取提货列表，失败！');
          }
        }
      });
    }
  },
  mounted() {
    $('title').html('车猫掌柜-确认订单');
  },
  computed: {
    // 计算商品总额
    total: function() {
      let total = 0;
      for (let i in this.homeOrderList.orderList) {
        this.orderList.push(this.homeOrderList.orderList[i]);
      }
      this.orderList.map((item, index) => {
        total += Number(item.productPrice * item.numbers);
      });
      total = (total.toString()).split('.');
      if (total[1]) {
        if (total[1].length < 2 && total[1].length > 0) {
          total[1] = total[1] + '0'
        }
      } else {
        total[1] = '00'
      }
      total = total.join('.');
      return Number(total);
    }
  }
}
</script>
<style>
.surePay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.surePay-box {
  width: 72%;
  padding: 2em 1em;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 0.8em;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.surePay-sure {
  text-align: center;
  padding-bottom: 1em;
  font-size: 1.2em;
}

.surePay-chose {
  width: 75%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.surePay-go {
  text-align: center;
}

.surePay-yes,
.surePay-no {
  width: 60px;
  height: 30px;
  border-radius: 0.3em;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  color: #fff;
  margin: 0 1em;
}

.surePay-yes {
  background-color: #ffc700;
}

.surePay-no {
  background-color: #ddd;
}

.so-order-way {
  width: 100%;
  margin-bottom: 2em;
}

.so-oder-select {
  padding: 1em;
  display: flex;
  background-color: #fff;
}

.so-oder-select>p {
  flex: 1;
  padding-left: 2em;
  position: relative;
}

.so-oder-select>p:first-child {
  padding-left: 0;
}

.so-o-btn {
  width: 0.9em;
  height: 0.9em;
  border: 1px solid #ffc700;
  display: inline-block;
  border-radius: 100%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}

.so-o-select {
  background-color: #ffc700;
}

/*sureorder底部*/

.sureOrder-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 52px;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.so-bottom {
  width: 100%;
  height: 52px;
  background-color: #fff;
  line-height: 52px;
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  padding: 0 4%;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.so-bottom-content {
  padding: 0 0.5em;
}


.so-bottom-lf {
  font-size: 1.25em;
}

.so-bottom-payBtn {
  height: 35px;
  width: 6.5em;
  border-radius: 0.2em;
  color: #fff;
  background-color: #ffc700;
  text-align: center;
  line-height: 35px;
  display: inline-block;
}

.so-botton-total {
  color: #ffc700;
}

/*sureorder 金额运费*/

.so-order-amount {
  margin-top: 0.5em;
  background-color: #fff;
  padding: 0 1em;
  border-top: 1px solid #f2f2f2;
}

.so-amount-list {
  width: 100%;
  padding: 0.3em 0;
}

.so-amount-item {
  padding: 0.3em 0;
  overflow: hidden;
}

.so-amount-text {
  float: left;
}

.so-amount-price {
  float: right;
  color: #ffc700;
}

/*sureorder 订单备注*/

.so-order-info {
  margin-top: 0.5em;
  background-color: #fff;
}

.so-order-text {
  padding: 0.5em 0 0 1em;
}

.so-order-msg {
  border: 0;
  width: 100%;
  height: 3em;
  text-indent: 1em;
  padding: 0.3em 0;
  resize: none;
}

.so-order-msg:focus {
  outline: none;
}

/*sureorder 商品列表部分*/

.so-pro-list {
  margin: 0.5em 0 1em 0;
  padding: 0.3em;
  background-color: #fff;
}

.so-product {
  width: 100%;
  margin: 0.8em 0;
}

.so-pro-item {
  display: flex;
  padding: 0.3em 0;
  border-bottom: 1px solid #f2f2f2;
  &:last-child{
    border-bottom: 1px solid #fff;
  }
}

.so-pro-item>div {
  flex: 1;
}

.so-pro-item .so-pro-info {
  flex: 4;
  padding: 0 0.5em;
}

.so-pro-info>p {
  margin: 0;
}

.so-pro-num {
  position: relative;
}

.so-pro-num>span {
  position: absolute;
  bottom: 50%;
  right: 50%;
}

.so-pro-img {
  width: 5em;
  height: 5em;
  background-image: url('../assets/seeds.png');
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
}

.so-pro-img>img {
  display: inline-block;
  vertical-align: middle;
}

.so-pro-img::after {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  width: 0;
  height: 100%;
  content: 'center';
}

.so-pro-size {
  color: #888;
}

.so-pro-price {
  color: #ffc700;
}

/*sureorder 地址部分*/

.so-container {
  width: 100%;
}

.so-address-write {
  height: 80px;
  width: 90%;
  margin: 0 auto;
  line-height: 80px;
  text-align: center;
  position: relative;
}

.so-address-ar {
  width: 8%;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
}

.so-address-info {
  padding: 0.5em 0.3em 1.5em 0.3em;
}

.so-user-name,
.so-user-adress {
  display: flex;
}

.so-user-name>p,
.so-user-adress>p {
  flex: 1;
  text-align: center;
}

.so-user-adress .so-ad-text {
  flex: 5;
}

.so-ad-text {
  max-width: 100%;
  overflow: hidden;
}

.so-ad-img {
  text-align: center;
}

.so-ad-img>img {
  display: inline-block;
  width: 40%;
}

.so-ad-img:after {
  display: inline-block;
  overflow: hidden;
  content: 'center';
  width: 0;
  height: 100%;
  vertical-align: center;
}

.so-line {
  height: 0.3em;
  width: 100%;
  background-image: url(../assets/orderLine.png);
  background-size: 98%;
}

.warehouse-list{
  padding: 0 0 1.5em 0;
  @media screen and (min-width: 410px){
    font-size: 1.1em;
  }
  & h3{
    padding: 0 1em;
    margin: 0.5em 0;
    font-weight: normal;
    font-size: 1em;
    color: #666;
  }
  & .warehouse-item{
    padding: 0.5em 1em;
    margin: 0 0 0.4em 0;
    line-height: 1.6em;
    background-color: #fff;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & .wi-right{
      width: 6em;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    & .icon-phone{
      display: block;
      width: 2em;
      height: 2em;
      opacity: 0.4;
      background: url('../assets/store-phone.png') no-repeat 50% 50% / 70%;
    }
  }
}

@media (min-width:768px) {
  .sureOrder {
    background-color: #333;
  }
  .sureOrder-content {
    width: 75%;
    margin: 0 auto;
    background: #f2f2f2;
  }
  .so-bottom {
    width: 75%;
    left: 12.5%;
  }
}
</style>
