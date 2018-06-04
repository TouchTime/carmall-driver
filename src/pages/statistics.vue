<template>
<div class="statistics">
  <div :class="{'stati-content':true,'show-bar' : activeText == ''}">
    <div class="roll-box">
      <div class="sta-tj">
        <!--<div class='sta-replenishment' @click='putCargo'>一键补货</div>-->
        <div class='sta-tj-content'>
          <div class='sta-user'>
            <div class='sta-ljsy' v-if='orderTjData'>累计收益：{{allEarnings.toFixed(2)}}元</div>
            <div class='sta-user-img' @click='goMe' v-if="headImg == ''" :style="{backgroundImage:'url('+xsuser+')'}"></div>
            <div class='sta-user-img' @click='goMe' v-if="headImg !== ''" :style="{backgroundImage:'url('+headImg+')'}"></div>
          </div>
          <div class='sta-tj-top'>
            <div :class="{'sta-top-rt sta-xslr':true,'active':activeText == 'allShopProfitSum'}" @click="switchT('allShopProfitSum')">
              <div class='sta-top-list sta-xslr-icon'></div>
              <div class='sta-xszq-con'>
                <p class='sta-rf-text'>销售利润</p>
                <p class='sta-money'><span>{{(orderTjData.allProfitSum || 0.00).toFixed(2)}}</span><small>元</small></p>
              </div>
            </div>
            <div :class="{'sta-top-lf sta-tjfr':true,'active': activeText == '-1'}" @click="switchT(-1)">
              <div class='sta-top-list sta-tjfr-icon'></div>
              <div class='sta-xszq-con'>
                <p class='sta-rf-text'>推荐分润</p>
                <p class='sta-money'><span>{{(shareProfit || 0).toFixed(2)}}</span><small>元</small></p>
              </div>
            </div>
          </div>
          <div class='sta-tj-top'>
            <div :class="{'sta-top-rt sta-xsdd':true,'active': activeText == 'ordercount'}" @click="switchT('ordercount')">
              <div class='sta-top-list sta-xsdd-icon'></div>
              <div class='sta-xszq-con'>
                <p class='sta-rf-text'>销售订单</p>
                <p class='sta-money'>{{(orderTjData.orderCount || 0)}}<small>笔</small></p>
              </div>
            </div>
            <div :class="{'sta-top-lf sta-xsje':true,'active': activeText == 'allPaySum'}" @click="switchT('allPaySum')">
              <div class='sta-top-list sta-xsje-icon'></div>
              <div class='sta-xszq-con'>
                <p class='sta-rf-text'>销售金额</p>
                <p class='sta-money'>{{(orderTjData && orderTjData.allSum || 0.00).toFixed(2)}}<small>元</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sta-qs">
        <div class="sta-qs-content" v-if='isKCShow'>
          <div class="sta-show-navbar">
            <p class='sta-show-nav' :class='{"sta-nav-yellow":index == OSIndex}' @click='switchNav(item,index)' v-for="(item,index) in switchNavText">{{item.navName}}</p>
          </div>
          <ul class="sta-show-list" v-if='otherSales.length > 0' v-show='this.OSIndex == 0'>
            <li class="sta-show-item" v-for='(item,index) in otherSales' v-if='item.product'>
              <div class="sta-show-photo" @click='showProDetail(item)' :style="{backgroundImage:'url('+item.product.productImgUrl+')'}"></div>
              <div class="sta-show-info">
                <p class="sta-show-title">{{item.product.name}}</p>
                <p :class="{'sta-show-gray':true,'zero':item.productNumber ? item.productNumber < 0 : true}">剩余库存：{{item.productNumber || 0}}</p>
                <p class="sta-text-yellow">进货单价：{{(item.product ? item.product.shopActualPrice : 0).toFixed(2)}}元</p>
                <p class="sta-text-yellow">利润：{{((item.product.actualPrice - item.product.shopActualPrice) > 0 ? (item.product.actualPrice - item.product.shopActualPrice) : 0) | keepTwoNum}}元</p>
              </div>
              <div class="sta-show-salesAdd">
                累计销量：{{item.productSells || 0}}
              </div>
            </li>
          </ul>
          <ul class="sta-show-list" v-if='hotSales.length > 0' v-show='this.OSIndex == 1'>
            <li class="sta-show-item" v-for='(item,index) in hotSales' v-if='item'>
              <div class="sta-show-photo" @click='showProHot(item)' :style="{backgroundImage:'url('+item.productImgUrl+')'}"></div>
              <div class="sta-show-info">
                <p class="sta-show-title">{{item.name}}</p>
                <!-- <p :class="{'sta-show-gray':true,'zero':item.storenum ? item.storenum < 0 : true}">剩余库存：{{item.storenum ? (item.storenum > 0 ? item.storenum : 0) : 0}}</p> -->
                <p class="sta-text-yellow">进货单价：{{item.shopActualPrice}}元</p>
                <p class="sta-text-yellow">利润：{{((item.actualPrice - item.shopActualPrice) > 0  ? (item.actualPrice - item.shopActualPrice) : 0) | keepTwoNum}}元</p>
              </div>
              <div class="sta-show-salesAdd">
                累计销量：{{item.sellnum || 0}}
              </div>
            </li>
          </ul>
          <!-- 新增掌柜排行榜的上周排名 -->
          <div class="sta-show-list" v-show="this.OSIndex == 2">
             <ul class="week-bar">
               <li :class="{weekBarActive:isWeek}" @click="weekSwitch(1)">本周</li>
               <li :class="{weekBarActive:!isWeek}" @click="weekSwitch(-1)">上周</li>
             </ul>
              <li class="driver-rank-item rank-list-title">
              <div class="rank-no">排名</div>
              <div class="driver-name">名字</div>
              <div class="driver-sales">销售额</div>
            </li>
            <li v-if="rankList.driverRank.rank" class="driver-rank-item self-row">
              <div class="rank-no">{{rankList.driverRank ? rankList.driverRank.rank : '-'}}</div>
              <div class="driver-name">{{rankList.driverRank ? rankList.driverRank.realname : '-'}}</div>
              <div class="driver-sales">{{rankList.driverRank ? rankList.driverRank.sum : 0 }} 元</div>
            </li>
            <li v-for="(item,index) in rankList.allRank" :key="item.userId" class="driver-rank-item">
              <div class="rank-no">{{index+1}}</div>
              <div class="driver-name">{{item.realname ? formatName(item.realname) : '-'}}</div>
              <div class="driver-sales">{{item.sum || 0}} 元</div>
            </li>
            <p class="no-rank-data" v-if="rankList.allRank.length == 0">暂无排名</p>
          </div>
          <!-- <ul class="sta-show-list" v-show="this.OSIndex == 2">
            <li class="driver-rank-item rank-list-title">
              <div class="rank-no">排名</div>
              <div class="driver-name">名字</div>
              <div class="driver-sales">销售额</div>
            </li>
            <li v-if="rankList.driverRank.rank" class="driver-rank-item self-row">
              <div class="rank-no">{{rankList.driverRank ? rankList.driverRank.rank : '-'}}</div>
              <div class="driver-name">{{rankList.driverRank ? rankList.driverRank.realname : '-'}}</div>
              <div class="driver-sales">{{rankList.driverRank ? rankList.driverRank.sum : 0 }} 元</div>
            </li>
            <li v-for="(item,index) in rankList.allRank" :key="item.userId" class="driver-rank-item">
              <div class="rank-no">{{index+1}}</div>
              <div class="driver-name">{{item.realname ? formatName(item.realname) : '-'}}</div>
              <div class="driver-sales">{{item.sum || 0}} 元</div>
            </li>
            <p class="no-rank-data" v-if="rankList.allRank.length == 0">暂无排名</p>
          </ul> -->
        </div>
        <div class='sta-table-content' v-if='isTableShow'>
          <div class="cut-bar">
            <select class="cutYear" @change="changeYear" v-model="cyear">
              <option v-for="(item,index) in yearList" :key="item" :value="item">{{item}}</option>
            </select>
            <div :class="{'cut-btn':true,'active' : cutIndex == 2}"  @click="handleCut(2)">累 计</div>
            <div :class="{'cut-btn':true,'active' : cutIndex == 1}"  @click="handleCut(1)">本 周</div>
            <div :class="{'cut-btn':true,'active' : cutIndex == 0}" @click="handleCut(0)">本 月</div>
            <div class="back-btn" @click="goBackFirst"></div>
          </div>
          <line-chart v-if="activeText != '-1'" class="chart-box" :chart-data="chartData" :options="chartOpts" :height="300"/>
          <div v-else class="earnings-table-wrapper">
            <table v-if="earningsLogs.length > 0" class="earnings-table">
              <thead>
                <th>被推荐人</th>
                <th>分润奖励</th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in earningsLogs" :key="item.fromUserName">
                  <td>{{item.fromUserName ? item.fromUserName : '-'}}</td>
                  <td>{{item.allSum ? item.allSum.toFixed(2) : '0.00'}}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="no-logs">暂无分润记录</div>
          </div>
          <div class='sta-table-bot'>
            <button class='sta-table-ljbh' @click="putCargo">立即补货</button>
            <button class='sta-table-xyyx' @click='isShare = true'>推荐分享</button>
          </div>
        </div>
      </div>
    </div>
    <div class="sta-tools-bar">
      <div @click='putCargo' class="sta-closing-btn">立即补货</div>
    </div>
  </div>
  <transition name="showDetails">
    <div v-if="isShowPro" class="mask pro" ref="pro" @click="closePro">
      <div class="details-box">
        <div class="details-img"><img :src="proDetailSales.product.productImgUrl" alt="" /></div>
        <div class="details-desc">
          <p class="product-name"><strong>{{proDetailSales.product.name}}</strong></p>
          <p class="product-price"><small>进货单价：¥ </small><span>{{(proDetailSales.product.shopActualPrice || 0).toFixed(2)}}</span></p>
          <p class="product-replenish">{{proDetailSales.product.productContent}}</p>
        </div>
      </div>
    </div>
  </transition>
  <transition name="showDetails">
    <div v-if="isShowHot" class="mask hot" ref="hot" @click="closeHot">
      <div class="details-box">
        <div class="details-img"><img :src="proHot.productImgUrl" alt="" /></div>
        <div class="details-desc">
          <p class="product-name"><strong>{{proHot.name}}</strong></p>
          <p class="product-price"><small>进货单价：¥ </small><span>{{(proHot.shopActualPrice || 0).toFixed(2)}}</span></p>
          <p class="product-replenish">{{proHot.productContent}}</p>
        </div>
      </div>
    </div>
  </transition>
  <transition name="showDetails">
    <div v-if="isShare" class="mask share" @click="isShare = false">
      <div class="details-box">
        <img class='shareImg' :src='shareArrows' />
        <p class='sta-text-yellow'>点击右上角图标进行分享</p>
      </div>
    </div>
  </transition>
  <transition name="showRP">
    <div v-if="isShowRP" class="mask redPacket" @click="isShowRP = false">
      <div class="redPacket-box">
        <div class="redPacket-bg"><img :src="redPacket" alt=""/></div>
        <div class="redPacket-inner">
          <h3>恭喜您已获得推荐红包</h3>
          <p><span>¥</span><strong>{{rpInfo.amount}}</strong><span> X </span><strong> {{rpInfo.count}}</strong></p>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import {
  loginInfo,
  WARequest,
  storage,
  gqs,
  sessionStorage
} from '../util.js';
import LineChart from '../components/LineChart.js';
import xsuser from '../assets/xsuser.png'
import shareArrows from '../assets/share-arrows.png'
import nrb from '../assets/nrb.png'
import nrg from '../assets/nrg.png'
import redPacket from '../assets/redPacket.png'
export default {
  components: {
    LineChart
  },
  data() {
    const info = loginInfo();
    return {
      redPacket,
      headImg: info['user'].headImg,
      isShare: false,
      shareArrows,
      isShowHot: false,
      isShowPro: false,
      isKCShow: true,
      isTableShow: false,
      isBH: false,
      xsuser,
      isShopUser: 1,
      shopID: 1,
      shopAaccountID: '',
      orderTableList: '',
      showNav: 0,
      staNav: [{
          staTitle: '销售金额'
        },
        {
          staTitle: '销售订单'
        }
      ],
      buyHistory: [], //购买记录data
      orderTjData: {
        id: 0,
        allProfitSum: 0,
        allSum: 0,
        orderCount: 0
      },
      //订单统计分润
      orderTjFrData: {
        allSum: 0
      },
      timeSel: [{
          text: '本月',
          value: 1
        },
        {
          text: '本周',
          value: 0
        }
      ],
      optionId: '', //选择本周本月id
      switchNavText: [{
          navName: '本店库存'
        },{
          navName: '全网热销'
        },{
          navName: '掌柜排行榜'
        }
      ],
      otherSales: [{
        OSText: '本店库存',
        OSInfo: []
      }, {
        OSText: '全网热销',
        OSInfo: []
      }],
      hotSales: [],
      OSIndex: 0, //本地库存 本店热销
      switchData: {
        status: 2,
        time: "'%y-%m-%d'",
        type: 2,
        shopId: this.shopID || '',
        starttime: this.getFirstDayOfMonth()
      },
      switchJsonData: '',
      proDetailSales: [], //点击本店库存详情数据
      proHot: [], //点击本月热销展示详情
      shareProfit : '',  //推荐分润
      allEarnings : 0,
      chartData: {
        labels: [],
        datasets: []
      }, //统计图表
      chartOpts:{
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      },
      cutIndex : 0,
      activeText : '',
      isShowRP : false,
      rpInfo : {
        amount : 50,
        count  : 0
      },
      earningsLogs:[],
      yearList : [],
      cyear : (new Date()).getFullYear(),
      rankList : {
        driverRank:{},
        allRank: []
      },
      isWeek: true
    }
  },
  created() {
    const loginInfo = storage.get('loginInfo');
    const getPageData = () => {
      //获取销售利润、订单数、销售金额
      this.selectData()
      //获取本店库存
      this.repertory()
      if(this.shopAaccountID){
        //查询分润
        this.queryShareProfit(this.shopAaccountID);
      }
      this.queryHistorySum();
    };
    if (loginInfo && loginInfo.user) {
      //获取用户店铺
      WARequest({
        url: `/shops/shop/getshopbyuid/${loginInfo.user.id}`,
        done: (res, textStatus) => {
          let {
            shop,
            shopaaccount
          } = res;
          window.shopID = Number(shop.id);
          storage.set('shopID', shop.id);
          this.shopID = shop.id;
          this.shopAaccountID = shopaaccount.id;
          this.switchData.shopId = shop.id;
          storage.set('shopInfo',res);
          this.queryRedPacketInfo(); //显示推荐获得红包
          getPageData();
        },
        fail: (err) => {
          console.log(err);
          //判断token是否已经过期
          if(err.status == 401){
            console.log('重新登录');
          }else{
            //判断是否绑定过手机,绑定过->申请页面，未绑定->去绑定页面
            this.$router.push({
              name: loginInfo.user.phone ? 'apply' : 'bind',
              query: {
                timestamp: (new Date()).getTime()
              }
            });
          }
        }
      });
    } else {
      console.log('未登录');
    }
    //获取最近3年
    this.getLatelyYear();
  },
  mounted() {
    $('title').html('车猫掌柜');

  },
  methods: {
    queryRedPacketInfo(){
      WARequest({
        url : `/shops/shopaccount/reward/${this.shopID}`,
        data : {islook:0,type:5},
        done : (res)=>{
          this.isShowRP = res.data.notSeeNum > 0;
          if(res.data.allRewardList[0]){
            this.rpInfo = {count : res.data.notSeeNum,amount:res.data.allRewardList[0].sum};
          }else{
            this.rpInfo = {count : res.data.notSeeNum,amount:0};
          }
        },
        fail : (err)=>{
          console.warn(err);
        }
      });
    },
    queryShareProfit(shopAccountId,startTime,endTime){
      let st = startTime || this.getCurrentMonthFirst() //本月第一天
      let et  = endTime || this.getCurrentMonthLast(); //本月最后一天
      WARequest({
        url : `/shops/shopaccount/statisticsshareprofit/${shopAccountId}`,
        data : {startTime:st,endTime:et},
        done : (res)=>{
          //推荐分润
          this.shareProfit = res.data.allShareProfit || 0;
          //累计收益
          this.allEarnings = res.data.allEarnings || 0;
        },
        fail : (err)=>{
          if (err.responseJSON) {
            if (err.responseJSON.error_mesg) {
              alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
              alert(err.responseJSON.error);
            }
          } else {
            console.log(err);
          }
        }
      });
    },
    putCargo() {
      // 补货，去仓库商城
      this.$router.push({
        name: 'home',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    showProDetail(item) {
      //点击本地库存图片显示商品详情
      this.proDetailSales = item;
      this.isShowPro = !this.isShowPro;
    },
    closePro() {
      this.isShowPro = !this.isShowPro;  //关闭详情
    },
    // 点击本月热销 展示详情
    showProHot(item) {
      this.proHot = item;
      this.isShowHot = !this.isShowHot;
    },
    closeHot() {
      this.isShowHot = !this.isShowHot;
    },
    // 本月热销
    monthHotSales() {
      WARequest({
        url: '/orders/order/statictiscsellesproductsort',
        data: {
          status: 2,
          type: 2,
          // 修改为历史累计
          // starttime: this.getFirstDayOfMonth,
          // endtime: this.getCurrentMonthLast
        },
        done: (data) => {
          // this.hotSales = data.data.splice(0, 10);
          this.hotSales = data.data;
        },
        fail: (err) => {
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
    // 点击图标下的立即补货 回到最初的本店库存的页面
    goBackFirst() {
      this.isKCShow = true;
      this.isTableShow = false;
      this.activeText = '';
    },
    // 本店库存
    repertory() {
      WARequest({
        url: '/shops/shopproduct/getshopproductpage',
        data: {
          shopId: this.shopID || '1'
        },
        done: (data) => {
          this.otherSales = data.data.result.map((item, index) => {
            return item;
          });
        },
        fail: (err) => {
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
    constrChartData(data,fields){
      let lastDayOfMonth = this.getCurrentMonthLast();
      let lastDayOfWeek = this.getLastDayOfWeek();
      let firstDayOfWeek = this.getFirstDayOfWeek();
      let monthDay = lastDayOfMonth.split(' ')[0].split('-')[2];
      let weekendDay = lastDayOfWeek.split(' ')[0].split('-')[2];
      let weekDayArr = [];
      let cdl = [];
      let fwd  = '';
      let clabel = [];
      if(this.cutIndex == 0){
        //构造本月图表数据
        for(let j = 1 ; j <= monthDay ; j++){
          clabel.push(`${j}日`);
          cdl.push(0);
        }
        data.forEach((item,index)=>{
          let itemDay = item.time.replace(/\'/g,'');
          itemDay = itemDay.split('-')[0].length < 4 ? '20'+itemDay : itemDay;
          itemDay = (new Date(itemDay)).getDate();
          cdl[itemDay-1] = Number(item[fields]);
        });
        return {cdl,clabel}
      }else{
        fwd = firstDayOfWeek.split('-')[0].length < 4 ? '20'+firstDayOfWeek : firstDayOfWeek;
        fwd = this.fmST(fwd); //修复iphone日期格式错误 2018-01-02
        weekDayArr = this.getWeekDays(fwd); //获取周一到周日的日期
        //构造本周图表数据
        ['周一','周二','周三','周四','周五','周六','周日'].forEach((item,index)=>{
          clabel.push(item);
          cdl.push(0);
        });
        data.forEach((item,index)=>{
          let itemDay = item.time.replace(/\'/g,'');
          itemDay = itemDay.split('-')[0].length < 4 ? '20'+itemDay : itemDay;
          itemDay = (new Date(itemDay)).getDate();
          cdl[weekDayArr.indexOf(itemDay)] = Number(item[fields]);
        });
        return {cdl,clabel}
      }
    },
    fmST(str){
      let strArr = str.split(' ');
      let yydArr = strArr[0].split('-');
      return `${yydArr[0] }-${yydArr[1] < 10 ? '0'+yydArr[1] : yydArr[1]}-${yydArr[2] < 10 ? '0'+yydArr[2] : yydArr[2]}`
    },
    getWeekDays(currDay){
      let cd = new Date(currDay);
      let wdArr = [];
      for(let i = 0 ; i <= 6 ; i++){
        wdArr.push(cd.getDate());
        cd.setDate(cd.getDate() + 1);
      }
      return wdArr;
    },
    switchT(fields) {
      //切换推荐列表与图表
      this.isTableShow = true;
      this.isKCShow = false;
      this.activeText = fields;
      if(fields == -1){
        this.queryChartDataProfit();
      }else{
        this.queryChartData(fields);
        this.queryHistorySum();
      }
      this.cyear = (new Date()).getFullYear();
    },
    switchNav(item, index) {
      // 切换 本店库存 本地热销
      this.OSIndex = index;
      if(this.OSIndex == 0){
        this.repertory();
      }else if(this.OSIndex == 1){
        this.monthHotSales()
      }else if(this.OSIndex == 2){
        // this.getRankList();
        const wf = this.getFirstDayOfWeek();
        const wl = this.getLastDayOfWeek();
        this.getRankList(wf,wl)
        // this.getRankList('2018-3-5 00:00:00','2018-3-11 23:59:59')
      }
    },
    queryChartData(fields){
      //获取图表数据，仅需获取一次即可
      //默认获取本月统计信息，销售利润，销售订单，销售金额
      let cmf = this.getCurrentMonthFirst();
      let cml = this.getCurrentMonthLast();
      let tm  = this.getFirstDayOfWeek(); //本周第一天
      let em  = this.getLastDayOfWeek();
      let isMonth = (this.cutIndex == 0 ? true : false);
      WARequest({
        url: '/orders/order/countorderunionidgrouptime',
        data: {
          status: 2,
          time: "'%y-%m-%d'",
          type: 2,
          shopId: this.shopID || '',
          starttime: isMonth ? cmf : tm,
          endtime : isMonth ? cml : em
        },
        done: (data) => {
          let {clabel,cdl} = this.constrChartData(data.data,fields);
          let labelMap = {
            allShopProfitSum : '销售利润',
            ordercount : '销售订单',
            allPaySum : '销售金额'
          };
          this.chartData = {
            labels: clabel,
            datasets: [
              {
                label: labelMap[fields],
                data: cdl,
                borderColor: '#ffc700',
                fill : false,
                pointRadius:2,
                lineTension:0,
                borderWidth: 1.5
              }
            ]
          };
        },
        fail: (err) => {
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
    queryChartDataProfit(year){
      //推荐分润图表
      let currYear = year ? year : (new Date()).getFullYear();
      let cmf = this.getCurrentMonthFirst();
      let cml = this.getCurrentMonthLast();
      let tm  = this.getFirstDayOfWeek(); //本周第一天
      let em  = this.getLastDayOfWeek();
      let isMonth = (this.cutIndex == 0 ? true : false);
      WARequest({
        url : `/shops/shopaccount/statisticsShareProfit`,
        data : {
          shopId : this.shopID,
          startTime : (this.cutIndex == 2) ? `${currYear}-01-01 00:00:00` : (isMonth ? cmf : tm),
          endTime : (this.cutIndex == 2) ? `${currYear}-12-31 23:59:59` : (isMonth ? cml : em)
        },
        done : (res)=>{
          this.earningsLogs = res.data;
        },
        fail : (err)=>{
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
      });
    },
    handleCut(val) {
      //月份/周直接切换
      this.cutIndex = val;
      let cmf = this.getCurrentMonthFirst(); //本月第一天
      let cml = this.getCurrentMonthLast(); //本月最后一天
      let tm  = this.getFirstDayOfWeek(); //本周第一天
      let em  = this.getLastDayOfWeek();
      if(val == 0){
        //周统计
        this.selectData();
        if(this.activeText == -1){
          this.queryChartDataProfit();
        }else{
          this.queryChartData(this.activeText);
        }
        this.queryShareProfit(this.shopAaccountID,cmf,cml);
      }else if(val == 1){
        //月统计
        this.selectData();
        if(this.activeText == -1){
          this.queryChartDataProfit();
        }else{
          this.queryChartData(this.activeText);
        }
        this.queryShareProfit(this.shopAaccountID,tm,em);
      }else{
        //累计
        if(this.activeText == -1){
          this.queryChartDataProfit();
          this.queryShareProfit(this.shopAaccountID,`${this.cyear}-01-01 00:00:00`,`${this.cyear}-12-31 23:59:59`);
        }else{
          this.queryHistorySum();
        }
        this.selectData();
      }
    },
    selectData(year) {
      //默认获取本月统计信息，销售利润，销售订单，销售金额
      let cmf = this.getCurrentMonthFirst();
      let cml = this.getCurrentMonthLast();
      let tm  = this.getFirstDayOfWeek(); //本周第一天
      let em  = this.getLastDayOfWeek();
      let isMonth = (this.cutIndex == 0 ? true : false);
      let currYear = year ? year : (new Date()).getFullYear();
      WARequest({
        url: '/orders/order/countorderunion/',
        data: {
          status: 2,
          type: 2,
          shopId: this.shopID || '1',
          starttime: (this.cutIndex == 2) ? `${currYear}-01-01 00:00:00` : (isMonth ? cmf : tm),
          endtime : (this.cutIndex == 2) ? `${currYear}-12-31 23:59:59` : (isMonth ? cml : em)
        },
        done: (res) => {
          this.orderTjData = {
            allProfitSum: res.data.allProfitSum || 0,
            allSum: res.data.allSum || 0,
            id: res.data.id || 0,
            orderCount: res.data.orderCount || 0
          };
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
    queryHistorySum(year){
      //获取累计数据
      let currYear = year ? year : (new Date()).getFullYear();
      if(this.cutIndex == 2){
        WARequest({
          url : `/shops/shopaccount/sellShopStatis/${this.shopID}`,
          data : {
            shopId : this.shopID,
            // takeType : 1,
            // isDiscounted : 0,
            time : "'%Y-%m'",
            startTime : `${currYear}-01-01 00:00:00`,
            endTime : `${currYear}-12-31 23:59:59`
          },
          done : (res)=>{
            let historyData = res.data.countOrderUnionCount;
            let monthLable = [];
            let monthData  = [];
            for(let i = 1 ; i <=12 ; i++){
              monthLable.push(`${i}月`);
              monthData.push(0);
            }
            historyData.forEach((item,index)=>{
              if(this.activeText == 'allPaySum'){
                monthData[item.time.split('-')[1]-1] = item.allSum;
              }else if(this.activeText == 'ordercount'){
                monthData[item.time.split('-')[1]-1] = item.orderCount;
              }else if(this.activeText == 'allShopProfitSum'){
                monthData[item.time.split('-')[1]-1] = item.allProfitSum;
              }
            });
            this.chartData = {
              labels: monthLable,
              datasets: [
                {
                  label: '',
                  data: monthData,
                  borderColor: '#ffc700',
                  fill : false,
                  pointRadius:2,
                  lineTension:0,
                  borderWidth: 1.5
                }
              ]
            };
          },
          fail : (err)=>{
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
        });
      }
    },
    changeYear(e){
      this.queryHistorySum(e.target.value);
      this.queryChartDataProfit(e.target.value);
      this.queryShareProfit(this.shopAaccountID,`${e.target.value}-01-01 00:00:00`,`${e.target.value}-12-31 23:59:59`);
      this.selectData(e.target.value);
    },
    getRankList(wf,wl){
      // const wf = this.getFirstDayOfWeek();
      // const wl = this.getLastDayOfWeek();
      WARequest({
        // url : `/shops/shop/driver/rank`,
        url : `/platforms/platform/statistics/shopsell`,
        method : 'GET',
        data : {
          starttime: wf,
          endtime : wl,
          seq:0,
          page : 1,
          pageSize : 10,
          shopId : this.shopID
        },
        done : (res)=>{
          this.rankList.allRank = res.data.result;
        },
        fail : (err)=>{
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
      });
      WARequest({
        url : `/shops/shop/driver/currentrank`,
        method : 'POST',
        data : {
          starttime: wf,
          endtime : wl,
          seq:0,
          shopId : this.shopID
        },
        done : (res)=>{
          this.rankList.driverRank = res.data || {};
        },
        fail : (err)=>{
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
      });
    },
    goMe() {
      this.$router.push({
        name: 'my',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    //时间格式化
    timeFormate(date) {
      if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      var d = date.getDate(); //日

      return y + "-" + m + "-" + d;
    },
    //获取本星期第一天
    getFirstDayOfWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
      console.log('weekday',weekday)
      console.log(date)
      console.log('timeFormate',this.timeFormate(date) + ' 00:00:00')
      return this.timeFormate(date) + ' 00:00:00';
      
    },
    //获取本星期最后一天
    getLastDayOfWeek() {
      var data = new Date(this.getFirstDayOfWeek());
      data.setDate(data.getDate() + 6);
      var year =  data.getFullYear();
      var currentMonth = data.getMonth() + 1;
      var day = data.getDate();
      console.log( `${year}-${currentMonth}-${day} 23:59:59`)
      return `${year}-${currentMonth}-${day} 23:59:59`;
    },
     //获取上星期第一天
    getFirstDayOfLastWeek(date) {
      var date = new Date();
      var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1-7); //往前算（weekday-1）天，年份、月份会自动变化
      console.log('weekday',weekday)
      console.log(date)
      console.log('timeFormate',this.timeFormate(date) + ' 00:00:00')
      return this.timeFormate(date) + ' 00:00:00';
      
    },
    //获取上星期最后一天
    getLastDayOfLastWeek() {
      var data = new Date(this.getFirstDayOfWeek());
      data.setDate(data.getDate() + 6);
      var year =  data.getFullYear();
      var currentMonth = data.getMonth() + 1-7;
      var day = data.getDate();
      return `${year}-${currentMonth}-${day} 23:59:59`;
    },
    //获取本月第一天
    getFirstDayOfMonth(date) {
      var date = new Date();
      date.setDate(1);
      return this.timeFormate(date) + ' 00:00:00';
    },
    //获取本月的第一天
    getCurrentMonthFirst(){
      var date = new Date();
      var year =  date.getFullYear();
      var currentMonth = date.getMonth() + 1;
      var currentDay = date.getDate();
      return `${year}-${currentMonth}-1 00:00:00`;
    },
    //获取当前月的最后一天
    getCurrentMonthLast() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var day = new Date(nextMonthFirstDay - oneDay);
      return this.timeFormate(day) + ' 23:59:59'
    },
    getLatelyYear(){
      let yearArr = [];
      let date = new Date();
      let p1Date = new Date(date.getFullYear(),0,1);
      yearArr.push(p1Date.getFullYear());
      let p2Date = new Date(date.getFullYear()-1,0,1);
      yearArr.push(p2Date.getFullYear());
      let p3Date = new Date(date.getFullYear()-2,0,1);
      yearArr.push(p3Date.getFullYear());
      this.yearList = yearArr;
    },
    formatName(str){
      let strArr = str.split('');
      if(strArr.length >= 3){
        return strArr[0] + ' * ' + strArr.slice(2);
      }else {
        return str.substring(0,1) + ' * ';
      }
    },
     weekSwitch(index){
       //本周掌柜排行榜
      if(index === 1){
        this.isWeek = true;
        const wf = this.getFirstDayOfWeek();
        const wl = this.getLastDayOfWeek();
        this.getRankList(wf,wl)
        // this.getRankList('2018-3-5 00:00:00','2018-3-11 23:59:59')
      }else{
        //上周掌柜排行榜
        this.isWeek = false;
        const wf = this.getFirstDayOfLastWeek();
        const wl = this.getLastDayOfLastWeek();
        this.getRankList(wf,wl)
        //  this.getRankList('2018-2-26 00:00:00','2018-3-4 23:59:59')
      }
    }
  },
  filters: {
    keepTwoNum: function(val) {
      val = Number(val);
      return val.toFixed(2)
    }
  }
 
}
</script>
<style>
.share {
  display: flex;
  justify-content: center;
  align-items: center;
}

.shareImg {
  width: 6em;
  margin: 0 auto;
}

.hot,
.pro {
  display: flex;
  justify-content: center;
  align-items: center;
}
.stati-content .sta-tools-bar{
  display: none;
}
.show-bar .sta-tools-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 44px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: block;
}
.sta-tools-bar .sta-closing-btn {
  background-color: #fec62e;
  width: 100%;
  line-height: 44px;
  text-align: center;
  font-size: 1.1em;
  height: 100%;
}

.sta-tools-bar .sta-closing-btn.disable {
  background-color: #999;
  color: #fff;
}

@media (min-width:768px) {
  .sta-tools-bar {
    background-color: #333;
  }
  .sta-tools-bar .sta-closing-btn {
    width: 75%;
    margin: 0 auto;
  }
}

.sta-top-rt {
  display: flex;
}

.sta-xslr-icon {
  background-image: url('../assets/xslr.png');
}

.sta-xslr.active .sta-xslr-icon {
  background-image: url('../assets/xslr-r.png');
}

.sta-tjfr-icon {
  background-image: url('../assets/tjfr.png');
}

.sta-tjfr.active .sta-tjfr-icon {
  background-image: url('../assets/tjfr-r.png');
}

.sta-xsdd-icon {
  background-image: url('../assets/xsdd.png');
}

.sta-xsdd.active .sta-xsdd-icon {
  background-image: url('../assets/xsdd-r.png');
}

.sta-xsje-icon {
  background-image: url('../assets/xsje.png');
}

.sta-xsje.active .sta-xsje-icon {
  background-image: url('../assets/xsje-r.png');
}

#canvas {
  width: 310px !important;
  height: 268px !important;
}

.sta-select {
  border: 1px solid #ddd;
  border-radius: 0;
  box-shadow: none;
  padding: 0.3em 1em;
  border: 0;
  height: 1.8em;
  border-radius: 0.2em;
  padding: 0 1em;
  background-color: rgba(255, 255, 255, 0.8);
  -webkit-appearance: none;
}

.sta-select:focus {
  outline: none;
}

.sta-select>option {
  border: 0;
  background-color: #fff;
  white-space: normal;
  outline: none;
  padding: 0;
  min-height: 1em;
}

.stati-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.show-bar .roll-box{
  bottom: 46px;
}
.roll-box{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
}

.sta-share {
  color: #fff;
  padding-right: 2em;
  background: url(../assets/share-w.png) no-repeat 87% 50% / 17%;
}

/*购买记录*/

.sta-jl-content {
  width: 90%;
  margin: 0 auto;
}

.sta-jl-list {
  margin-top: 1em;
  border: 1px solid #ffc700;
  border-radius: 0.5em;
  padding: 0.5em 1.3em;
  box-sizing: border-box;
}

.sta-list-title {
  padding: 0.2em 0;
  margin: 0.2em 1em;
  display: flex;
  border-bottom: 1px solid #ffc700;
  text-align: center;
}

.sta-list-title>span {
  flex: 1;
}

.sta-list-title:last-child {
  border-bottom: 0;
}

/*营销趋势*/

.sta-qs {
  width: 100%;
  background-color: #fff;
  padding-bottom: 1em;
}

.sta-qs-content {
  width: 90%;
  margin: 0 auto;
  padding: 1px 0 0.5em 0;
  background-color: #fff;
}

.sta-table-content {
  width: 100%;
  padding: 0 0.8em 1em 0.5em;
  margin: 0 auto;
  box-sizing: border-box;
  & .cut-bar{
    position:relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5em 0 0 0;
  }
  & .back-btn{
    position: absolute;
    top: 50%;
    right: 0;
    width: 2em;
    height: 2em;
    margin: -1em 0 0 0;
    background: url('../assets/back-btn.png') no-repeat 50% 50% / 80%;
    opacity: 0.6;
  }
  & .cut-btn{
    position: relative;
    padding: 0.5em 0.2em;
    margin: 0 1em;
    &::after{
      content : '';
      position: absolute;
      bottom: 0;
      right: 50%;
      width: 0;
      height: 2px;
      background-color: #f0c41d;
      transition:  all 0.3s;
    }
    &::before{
      content : '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: #f0c41d;
      transition:  all 0.3s;
    }
    &.active::after{
      width: 50%;
    }
    &.active::before{
      width: 50%;
    }
  }
}

.sta-table-bot {
  width: 100%;
  text-align: center;
  margin: 1em auto 0 auto;
}

.sta-table-ljbh,
.sta-table-xyyx {
  border: 0;
  width: 7em;
  line-height: 1.8em;
  background-color: #ffc700;
  border-radius: 1.6em;
  color: #fff;
  margin-right: 1.5em;
}

.sta-table-xyyx {
  margin-right: 0;
}

.sta-table-ljbh:focus,
.sta-table-xyyx:focus {
  outline: none;
}

.sta-show-navbar {
  width: 100%;
  display: flex;
  padding: 0.6em 0;
  border-bottom: 2px solid transparent;
}

.sta-show-nav {
  text-align: center;
  padding: 0.5em 0;
  margin-right: 1.4em;
}

.sta-nav-yellow {
  color: #ffc700;
  border-bottom: 2px solid #ffc700;
}

.sta-show-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5em;
}

.sta-show-info,
.sta-show-salesAdd {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sta-show-salesAdd {
  text-align: right;
  line-height: 5em;
  color: #999;
  flex-shrink: 0;
}

.sta-show-photo {
  width: 5em;
  height: 5em;
  background-image: url('../assets/nrg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70%;
  flex-shrink: 0;
}

.sta-show-title {
  font-size: 1.1em;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.sta-text-yellow {
  color: #ffc700;
}

@media (min-width:375px) {
  .sta-show-item>div {
    width:7em;
  }
}

.sta-qs-profit {
  width: 90%;
  margin: 0.8em auto;
  box-sizing: border-box;
  display: flex;
  border: 1px solid #ffc700;
  border-radius: 1em;
}

.sta-show-gray {
  color: #999;
  &.zero{
    color: rgba(255, 0, 0, 0.72);
  }
}

.sta-prfit-bar {
  flex: 1;
  height: 30px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  color: #ffc700;
}

.sta-prfit-bar:first-child {
  border-top-left-radius: 1em;
  border-bottom-left-radius: 1em;
}

.sta-prfit-bar:last-child {
  border-top-right-radius: 1em;
  border-bottom-right-radius: 1em;
}

.sta-on,
.sta-prfit-bar:hover {
  background-color: #ffc700;
  color: #fff;
}

.sta-qs-title {
  width: 90%;
  margin: 0 auto;
}

/*营销统计*/

.statistics {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
}

.sta-tj {
  width: 100%;
  padding: 0 0 1em 0;
  background: #f0c41d;
}

.sta-tj-content {
  width: 90%;
  margin: 0 auto;
  padding-top: 1em;
}

.sta-user {
  width: 100%;
  position: relative;
	display: flex;
  justify-content: space-between;
	align-items: center;
  padding: 0 0.5em 0 0;
  box-sizing: border-box;
  margin: 0 0 1.8em 0;
}

.sta-user-sec {
  position: absolute;
  right: 20px;
  border: 1px solid red;
  padding: 0.1em 0.3em;
  border-radius: 1em;
}

.sta-user-img {
  position: relative;
  width: 3em;
  height: 3em;
  text-align: right;
  float: left;
  border-radius: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &::after{
    content: '店铺管理';
    position: absolute;
    bottom: -1.6em;
    left: 50%;
    width: 5em;
    text-align: center;
    transform: translateX(-50%);
    font-size: 90%;
  }
}

.sta-ljsy {
  font-size: 1.4em;
  font-weight: bold;
}

.sta-tj-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: 0.5em;
}

.sta-chose-week {
  // border-radius:0.8em;
  // border:1px solid #888;
  // width:4em;
  display: inline-block;
  text-align: center;
}

.sta-chose-img {
  width: 24%;
  margin-left: 0.2em;
  display: inline-block;
}

.sta-title-text {
  font-size: 1.1em;
}

.sta-tj-top {
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  border-radius: 0.6em;
}

.sta-tj-top>div {
  width: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 0 0.4em;
  box-sizing: border-box;
}

.sta-tj-top:last-child {
  margin-top: 1em;
}

.sta-rf-img {
  display: inline-block;
  width: 30%;
}

.sta-top-list {
  width: 5em;
  height: 5em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
}

.sta-rf-text {
  float: right;
  line-height: 1.6em;
}

.sta-money {
  font-size: 1.3em;
  text-align: center;
}

.sta-replenishment {
  width: 73px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background-color: rgba(249, 130, 98, 0.8);
  border-top-right-radius: 1.2em;
  border-bottom-right-radius: 1.2em;
  position: fixed;
  left: 0;
  top: 50%;
}

@media (min-width:768px) {
  .stati-content {
    /* width: 75%; */
    margin: 0 auto;
    height: 100%;
    background: #fff;
  }
  .statistics {
    background-color: #333;
  }
  .sta-tj {
    height: 21.5em;
  }
  .sta-qs-content,
  .sta-jl,
  .sta-tj-content {
    width: 80%;
  }
  .sta-replenishment {
    left: 114px;
  }
}

.chart-box{
  overflow: auto;
  & canvas{
    margin: 0 auto;
    border: 0;
  }
}
.redPacket{
  display: flex;
  justify-content: center;
  align-items: center;
  & .redPacket-box{
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  & .redPacket-inner{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 5em 0 0 0;
    box-sizing: border-box;
    text-align: center;
    font-size: 1.5em;
    color: #f0c41d;
    & h3{
      margin: 0.4em 0;
    }
    & strong{
      font-weight: normal;
      font-size: 2.4em;
    }
  }
}
.showRP-enter-active{
  animation: fadeIn  0.3s;
  & .redPacket-box{
    animation: zoomIn 0.3s;
  }
}
.showRP-leave-active{
  animation: fadeIn  0.3s reverse;
  & .redPacket-box{
    animation: zoomIn 0.3s reverse;
  }
}

.statistics .earnings-table-wrapper{
  min-height: 240px;
}
.statistics .history-sum{
  padding: 0 4%;
  & .hs-row{
    display: flex;
    align-items: center;
    margin-top: 0.5em;
  }
  & .hs-col{
    width: 50%;
  }
}
.statistics .no-logs{
  margin: 2em auto;
  text-align: center;
  color: #999;
}
.statistics .earnings-table{
  width: 90%;
  margin: 1em auto;
  border-collapse: collapse;
  & th{
    font-weight: normal;
  }
  & th{
    background-color: #f5f5f5;
  }
  & tr{
    border-top: 1px solid #eee;
  }
  & td, & th{
    padding: 0.5em;
  }
  & th:nth-of-type(1), & td:nth-of-type(1){
    text-align: left;
    width: 50%;
  }
  & th:nth-of-type(2), & td:nth-of-type(2){
    text-align: right;
    width: 50%;
  }
}

.cutYear{
  border: 0;
  padding: 0.2em 1em;
  border-radius: 0.8em;
  background-color: #f0c41d;
  color: #fff;
}


.driver-rank-item{
  display: flex;
  padding:  0.6em 0;
  border-bottom: 1px solid #f6f6f6;
  & .rank-no{
    width: 20%;
    flex-shrink: 0;
    text-align: center;
  }
  & .driver-name{
    flex-grow: 1;
    text-align:center;
  }
  & .driver-sales{
    width: 35%;
    flex-shrink: 0;
    text-align: center;
  }
}
.rank-list-title{
  background-color: #f6f6f6;
  border-bottom: 1px solid #eee;
}

.self-row{
  color: #f0c41d;
  padding: 0.8em 0;
  border-bottom: 2px solid #f0c41d;
}

.no-rank-data{
  margin: 2em 0;
  text-align: center;
}

/* 掌柜排行榜新增周排名 */
.week-bar{
  text-align: center;
}
.week-bar li{
  display: inline-block;
  border: 1px solid #7777;
  padding: .1em 1.2em;
  margin: .2em -.2em 1em;

}
.week-bar .weekBarActive{
    background: #ffc700;
    color: #fff;
    border: 1px solid #ffc700!important;
}
</style>
