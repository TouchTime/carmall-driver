import Vue from 'vue'
import App from './App.vue'
import vueRouter from 'vue-router'
import vueResource from 'vue-resource'

import {
  CitySelect
} from 'vue-ydui/dist/lib.rem/cityselect';
Vue.component(CitySelect.name, CitySelect);
import 'vue-ydui/dist/ydui.base.css';

Vue.use(vueRouter);


import Home from './pages/home'
import SureOrder from './pages/sureOrder'
import Pay from './pages/pay'
import Address from './pages/address'
import MyAddress from './pages/myAddress'
import Bind from './pages/Bind'
import Statistics from './pages/statistics'
import My from './pages/my'
import Balance from './pages/balance'
import ShopList from './pages/shopList'
import Bank from './pages/bank'
import BankStart from './pages/bankStart'
import Password from './pages/password'
import AllOrderDzf from './pages/allOrderDzf'
import AllOrderDqr from './pages/allOrderDqr'
import AllOrderYwc from './pages/allOrderYwc'
import Apply from './pages/Apply.vue';
import ApplySucceed from './pages/ApplySucceed'
import WriteAddress from './pages/WriteAddress'
import Fail from './pages/Fail.vue';

import AwardLog from './pages/AwardLog.vue';
import TradingLog from './pages/TradingLog.vue';
import EarningsLog from './pages/EarningsLog.vue';
import WithdrawLog from './pages/WithdrawLog.vue';
import OrderDetails from './pages/OrderDetails.vue';
import OfferMoney from './pages/OfferMoney.vue';

import logo from './assets/small-logo.png';
// import './recordPaint.js';
import {
  WARequest,
  reAuthorization,
  share,
  userLogin,
  gqs,
  initWechatApi,
  sessionStorage,
  storage,
  loginInfo,
  rongCloudInit,
  BDReading
} from './util.js';

const router = new vueRouter({
  routes: [{
    path: '/apply',
    name: 'apply',
    component: Apply
  }, {
    path: '/applySucceed',
    name: 'applySucceed',
    component: ApplySucceed
  }, {
    path: '/home',
    name: 'home',
    component: Home
  }, {
    path: '/sureOrder',
    name: 'sureOrder',
    component: SureOrder
  }, {
    path: '/pay',
    name: 'pay',
    component: Pay
  }, {
    path: '/address',
    name: 'address',
    component: Address
  }, {
    path: '/myAddress',
    name: 'myAddress',
    component: MyAddress
  }, {
    path: '/bind',
    name: 'bind',
    component: Bind
  }, {
    path: '/',
    name: 'statistics',
    component: Statistics
  }, {
    path: '/my',
    name: 'my',
    component: My
  }, {
    path: '/balance',
    name: 'balance',
    component: Balance
  }, {
    path: '/shopList',
    name: 'shopList',
    component: ShopList
  }, {
    path: '/bank',
    name: 'bank',
    component: Bank
  }, {
    path: '/bankStart',
    name: 'bankStart',
    component: BankStart
  }, {
    path: '/password',
    name: 'password',
    component: Password
  }, {
    path: '/allOrderDzf',
    name: 'allOrderDzf',
    component: AllOrderDzf
  }, {
    path: '/allOrderDqr',
    name: 'allOrderDqr',
    component: AllOrderDqr
  }, {
    path: '/allOrderYwc',
    name: 'allOrderYwc',
    component: AllOrderYwc
  }, {
    path: '/WriteAddress',
    name: 'WriteAddress',
    component: WriteAddress
  }, {
    path: '/fail',
    name: 'fail',
    component: Fail
  }, {
    path: '/awardLog',
    name: 'awardLog',
    component: AwardLog
  }, {
    path: '/tradingLog',
    name: 'tradingLog',
    component: TradingLog
  }, {
    path: '/earningsLog',
    name: 'earningsLog',
    component: EarningsLog
  }, {
    path: '/withdrawLog',
    name: 'withdrawLog',
    component: WithdrawLog
  }, {
    path: '/orderDetails',
    name: 'orderDetails',
    component: OrderDetails
  }, {
  path: '/offerMoney',
  name: 'offerMoney',
  component: OfferMoney
}]
});

//应用初始化
function init() {
  const app = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');

  initWechatApi(); //初始化 wechat JSSDK;
  //保存推荐人uid
  if (gqs('state')) {
    const state = gqs('state').split('YYBB');
    if (state[1]) {
      sessionStorage.set('referrerID', state[1]);
    }
  }
  //设置微信分享
  const loginInfo = storage.get('loginInfo');
  // WARequest({
  //   url: `/enters/getSharePath/${loginInfo.user.id}`,
  //   data: {},
  //   done: (res) => {
  //     share({
  //       title: '车猫随手购',
  //       desc: '快来注册车猫随手购掌柜吧',
  //       link: res.data,
  //       imgUrl: window.location.protocol + '//' + window.location.host + logo
  //     });
  //   },
  //   fail: (err) => {
  //     console.log(err);
  //   }
  // });
  share({
    title: '车猫随手购',
    desc: '快来注册车猫随手购掌柜吧',
    link: window.location.protocol + '//' + window.location.host + '/ac/index.html?uid=' + loginInfo.user.id,
    imgUrl: window.location.protocol + '//' + window.location.host + logo
  });

  //启动融云
  try {
    rongCloudInit((token) => {
      RongIMLib.RongIMClient.init('e0x9wycfeteeq');
      RongIMClient.setConnectionStatusListener({
        onChanged: function(status) {
          switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
              break;
            case RongIMLib.ConnectionStatus.CONNECTING:
              break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
              console.warn('IM断开连接');
              break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
              console.warn('其他设备登录');
              break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
              console.error('域名不正确');
              break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.error('网络不可用');
              break;
          }
        }
      });
      RongIMClient.connect(token, {
        onSuccess: function(userId) {
          console.log(`IM链接成功 from ${userId}`);
        },
        onTokenIncorrect: function() {
          console.error('token无效');
        },
        onError: function(errorCode) {
          console.error(errorCode);
        }
      });
      RongIMClient.setOnReceiveMessageListener({
        onReceived: function(message) {
          switch (message.messageType) {
            case RongIMClient.MessageType.TextMessage:
              console.log(`${message.content.content}`);
              BDReading(message.content.content);
              break;
            default:
              console.warn('未处理其他情况');
          }
        }
      });
    });
  } catch (e) {
    console.warn(e);
  }
}

//检查code
if (gqs('code')) {
  //获取用户信息和Token
  userLogin(gqs('code'), init);
} else {
  //查看本地token
  if (storage.get('loginInfo')) {
    init();
  } else {
    reAuthorization();
  }
}
