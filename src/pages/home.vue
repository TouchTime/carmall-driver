<template>
<div class="page home-page">
  <div class='home-banner-wrap'>
    <swiper v-if="bannerList.length > 0" :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(item,index) in bannerList" :key="index">
        <div class="item-img" :style="`background-image:url(${item.filePath});`"></div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
  <div class="home-box">
    <div class='home-nav-wrap'>
      <ul class='home-nav-list'>
        <li @click="handleNav(item.id)" v-for='(item,index) in allDataList'>
          <span :class='{"navClass":item.id == cateId}' class='nav-list-img'>{{item.cateName}}</span>
        </li>
      </ul>
    </div>
    <div class="goods-list">
      <div class="filter-bar">
        <div class="filter-item">
          <span :class="{'filter-default':true,'priceColor':sortType == 0}" @click="defaultSort">默认排行</span>
        </div>
        <div class="filter-item" @click="saleSort">
          <span :class="{'filtBtn home-filter-xl':true,'priceColor':sortType == 1}">销量
            <a :class="{'xlTop':true,'t-on':sortType == 1 && sortObj.sale}"></a>
            <a :class="{'xlBot':true,'b-on':sortType == 1 && !sortObj.sale}"></a>
          </span>
        </div>
        <div class="filter-item" @click="priceSort">
          <span :class="{'filtBtn home-filter-jg':true,'priceColor':sortType == 2}">价格
            <a :class="{'jgTop':true,'t-on':sortType == 2 && sortObj.price}"></a>
            <a :class="{'jgBot':true,'b-on':sortType == 2 && !sortObj.price}"></a>
          </span>
        </div>
      </div>
      <div class="list-wrapper">
        <ul v-if='navList.length' class="product-list">
          <li v-for="(item,index) in allDataList[cateId]['listdata']" :key="'l'+item.id" :class="'l-'+item.id">
            <div class="product-photo" @click='showDetails(item)' :style='{backgroundImage:"url("+item.productImgUrl+")"}'></div>
            <div class="product-overview">
              <div class="product-overview-inner">
                <h3>{{item.name}}</h3>
                <p><span>进货价格：</span><small class="priceColor">¥ </small><span class="priceColor">{{(item.shopActualPrice || 0 ).toFixed(2)}}</span></p>
                <p><span>利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;润：</span><small class="priceColor">¥ </small><span class="priceColor">{{((item.actualPrice - item.shopActualPrice) < 0 ? 0 : (item.actualPrice - item.shopActualPrice)).toFixed(2)}}</span></p>
                <p><span>本店库存：</span>{{item.stock}}<span></span></p>
              </div>
            </div>
            <div class='home-item-addBtn'>
              <span v-show='item.count > 0' @click="itemOpts(index,'-')" class="home-delete">-</span>
              <span v-show='item.count > 0' class='home-num'>{{item.count}}</span>
              <span @click="itemOpts(index,'+')" class="home-add">+</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="home-tools-bar">
    <div class="cart-info">
      <div class="cart-btn" @click="openCart(cartData)">
        <div class="badge">{{goodsStat.num}}</div>
      </div>
      <div class="total"><span>合计: </span><span>¥</span><span>{{goodsStat.total}}</span></div>
    </div>
    <!-- <div class='home-bh' @click='homeClickBH'>一键补货</div> -->
    <div @click='goSure(cartListData)' :class="{'closing-btn':true,'disable': Number(goodsStat.num) <= 0}">结算</div>
  </div>

  <transition name="showBuyList">
    <div v-if="isShowBuyList" ref="buyList" class="mask buy-list" @click="closeMask">
      <div class="list-box">
        <div class="list-box-title">
          <div class="title-text">已选商品</div>
          <div class="close-btn" @click="closeAmount"></div>
        </div>
        <div class="list-box-body">
          <div v-if="JSON.stringify(cartListData.selectArr) != '[]'">
            <ul class="buy-checklist">
              <li v-for="(item,index) in cartListData.selectArr">
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-price-amount">
                  <div class="goods-price"><small>¥</small><span>{{item.shopActualPrice}}</span></div>
                  <div class="amount-opts">
                    <span class="minus" @click="cartOpt({cateId:cartListData.mopts[index].cateId,index :cartListData.mopts[index].index,opt:'-'})"></span>
                    <span>{{item.count}}</span>
                    <span class="plus" @click="cartOpt({cateId:cartListData.mopts[index].cateId,index :cartListData.mopts[index].index,opt:'+'})"></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <p class="empty-hint" v-if="JSON.stringify(cartListData.selectArr) == '[]'">购物车空空的</p>
        </div>
      </div>
    </div>
  </transition>
  <transition name="showDetails">
    <div v-if="isShowDetails" class="mask details" ref="details" @click="closeDetails">
      <div class="details-box">
        <div class="details-img"><img :src="proDetail.productImgUrl" alt="" /></div>
        <div class="details-desc">
          <p class="product-name"><strong>{{proDetail.name}}</strong></p>
          <p class="product-price"><small>¥ </small><span>{{(proDetail.shopActualPrice || 0 ).toFixed(2)}}</span></p>
          <p class="product-replenish">{{proDetail.productContent}}</p>
        </div>
      </div>
    </div>
  </transition>
  <transition name="showDetails">
    <div v-if="isShowBHModel" class="mask details" ref="homeBh" @click="isShowBHModel = !isShowBHModel">
      <div class="details-box">
        <p class='bhAlert'>购物车已有商品，是否进行一键补货？</p>
        <button class='sureBand-no' @click='cancelBH'>取消</button>
        <button class='sureBand-yes' @click='sureBH'>确定</button>
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
  sessionStorage
} from '../util.js'
import 'swiper/dist/css/swiper.css'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'

import payW from '../assets/payW.png'
import payweixin from '../assets/payweixin.png'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      isShowBHModel: false,
      priceF: false, //价格筛选
      salesF: false, //销量筛选
      chosePay: [{
          choseT: '账户安全支付',
          choseImg: payW,
          choseNum: '0'
        },
        {
          choseT: '微信支付',
          choseImg: payweixin,
          choseNum: '1'
        },
      ],
      totalNum: 0, //商品数量
      proId: [], //商品id
      dataI: '', //支付方式
      payIndex: '', //支付
      navList: [],
      homeOrderList: '', //全部订单
      idx: 0, //导航切换的索引
      firstBtn: false, //第一次点击结算
      cateName: '', //每项的属于
      shoppingCart: '',
      showM: false, //是否显示模态框
      currIndex: '2', //导航点击切换的中间量
      cartData: [], //购物车接收的数据
      currGoods: {},
      isShowBuyList: false, //是否显示购物列表
      isShowDetails: false, //是否显示商品详情
      payStatus: false, //选择支付方式
      proDetail: [],
      homeJsonData: '',
      list: '', //传过去的订单
      swiperOption: {
        loop: true,
        autoplay: true,
        pagination: {
					el: '.swiper-pagination'
        }
      },
      classifyData: [],
      driverBH: [], //一键补货
      sum: 0, //购物车数量

      allDataList : {},
      cateId : '',
      defaultSortData : {},
      sortType:0,
      sortObj :{
        sale : false,
        price : false,
      },
      bannerList : []
    }
  },
  created() {
    // 导航切换
    this.homeNavData();
    window.shopID = Number(storage.get('shopID'));
    this.queryBannerList();
  },
  methods: {
    // 确定补货
    sureBH(e) {
      if (e.target == this.$refs.homeBh) {
        this.isShowBHModel = !this.isShowBHModel;
      }
      let oldDataList = Object.assign({},this.allDataList);
      Object.keys(oldDataList).map((item,index)=>{
        let t = Object.assign({},oldDataList[item]);
        t.listdata = t.listdata ? t.listdata.map((v,i)=>Object.assign({},v,{count:0})) : [];
        oldDataList[item] = t;
      })
      console.log(oldDataList);
      this.allDataList = oldDataList;
      this.BHData();
    },
    // 取消补货
    cancelBH(e) {
      if (e.target == this.$refs.homeBh) {
        this.isShowBHModel = !this.isShowBHModel;
      }
    },
    // 判断一键补货 时  购物车状况
    homeClickBH() {
      if (this.goodsStat.num !== 0) {
        this.isShowBHModel = !this.isShowBHModel;
      }else{
        this.BHData();
      }
    },
    // 一键补货获取数据
    BHData() {
      WARequest({
        url: '/shops/shoptemplate/gettemplate',
        data:{
          type : 1,
          systemList : '0,1',
          shopId : storage.get('shopID')
        },
        done: (res) => {
          console.log(res);
          let temp = res.data.result;
          let oldDataList = Object.assign({}, this.allDataList);
          let oldList = {};
          res.data.result.forEach((item,index)=>{
            oldDataList[item.cmProduct.cateId]['listdata'] = oldDataList[item.cmProduct.cateId]['listdata'].map((v,i)=>{
              if(item.productId == v.id){
                  return Object.assign({},v,{count:item.number});
              }else{
                return v
              }
            })
          });
          this.allDataList = oldDataList;
        },
        fail: (err) => {
          if(err.responseJSON){
            if (err.responseJSON.error_mesg) {
                alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
                alert(err.responseJSON.error);
            }
          }else{
              alert('请求失败，请重试！');
          }
        }
      })
    },
    // 一键补货
    oneKeyBH() {
      var navListItem = this.navList.slice();
      var driverBHItem = this.driverBH.slice();
      var newList = this.cartData.slice();
      var numSum = 0;
      var bhSum = 0;
      navListItem.map((item, index) => {
        driverBHItem.map((val, key) => {
          if ((val.cmProduct.cateId == item.id) && (item.rtList != undefined)) {
            item.rtList.map((v, i) => {
              if (val.productId == v.id) {
                v.count = val.number;
                newList.push(v);
              }
            })
            this.cartData = newList;
          }
        });
        // 购物车小数字头标
        if (item.rtList != undefined) {
          item.rtList.forEach((val, index) => {
            numSum += val.count;
          })
          this.sum = numSum;
        }
      })
      this.navList = navListItem;
    },
    // 点击结算生成订单
    goSureSuc(data) {
      storage.set('homeOrderList', data.data);  ///ljlkjljl
      this.$router.push({
        name: 'sureOrder',
        query: {
          timestamp: (new Date()).getTime(),

        }
      })
    },
    goSure(res) {
      if (this.firstBtn == false) {
        this.isShowBuyList = !this.isShowBuyList;
        this.firstBtn = true;
      } else if (this.firstBtn == true) {
        if (Number(this.goodsStat.num) > 0) {
          let selArr = [];
          let list = [];
          let proIdList = [];
          let wrap = {};

          proIdList =res.selectArr.map((item, index) => {
            return  {
            id: item.id,
            ShopId:window.shopID || '',
            // ShopId: 1,
            num: item.count
            }
          })
          this.list = JSON.stringify(proIdList);
          this.homeOrderPayList = storage.set('homeOrderPayList', this.list)
          const info = loginInfo();
          WARequest({
            method: 'POST',
            data: {
              takeType: 0,
              isShow: 1,
              buyUid:info['user'].id,
              // buyUid: 2000000017,
              shoppingWay: 1,
              orderType: 1,
              choosedShopProductList: this.list
            },
            url:'/orders/order/userbuyproduct/',
            done: this.goSureSuc,
            fail: function(err) {
              if(err.responseJSON){
                if (err.responseJSON.error_mesg) {
                    alert(err.responseJSON.error_mesg);
                } else if (err.responseJSON.error) {
                    alert(err.responseJSON.error);
                }
              }else{
                  alert('请求失败，请重试！');
              }
            }
          })
        }
        this.firstBtn = false;
      }
    },
    //打开购物列表 点击购物车图标
    openCart(cartData) {
      this.isShowBuyList = !this.isShowBuyList;
      this.firstBtn = false;
    },
    // 导航请求
    homeNavData() {
      WARequest({
        method: 'GET',
        data: {
          page: 1,
          size: 7,
          status : 1
        },
        // url: 'http://192.168.31.225:8087/platform/product/cate/',
        url:'/platforms/platform/product/cate/',
        done: (res)=>{
          this.navList = res.data.result;
          //修改128
          this.cateId = res.data.result[0].id; //初始化cateId
          res.data.result.map((item,index)=>{
            this.allDataList[item.id] = item;
          });
          this.homeProData(res.data.result[0].id);
          //128end
        },
        fail: function(err) {
          if(err.responseJSON){
            if (err.responseJSON.error_mesg) {
                alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
                alert(err.responseJSON.error);
            }
          }else{
              alert('请求失败，请重试！');
          }
        }
      })
    },
    // 商品列表请求数据
    homeProData() {
      WARequest({
        method: 'GET',
        data: {status : 1},
        url: '/platforms/platform/product/',
        done: (res)=>{
          //修改128
          let oDataList = res.data.result;
          let oldDataList = Object.assign({},this.allDataList);
          let lastCartList = sessionStorage.get('driverCart');
          //上次恢复购物车状态
          if(lastCartList && lastCartList.length > 0){
            lastCartList.forEach((v,i)=>{
              oDataList.forEach((item,index)=>{
                 if(item.id == v.id){
                   item.count = v.count;
                 }
              })
            });
          }
          oDataList.forEach((item,index)=>{
            !item.count && (item.count = 0);
            if(oldDataList[item.cateId]){
              if(oldDataList[item.cateId].listdata){
                oldDataList[item.cateId].listdata = oldDataList[item.cateId].listdata.concat([item]);
              }else{
                oldDataList[item.cateId].listdata =[item];
              }
            }
          });
          this.allDataList = oldDataList;
          this.defaultSortData = oldDataList;
          this.queryShopStock();
        },
        fail: function(err) {
          if(err.responseJSON){
            if (err.responseJSON.error_mesg) {
                alert(err.responseJSON.error_mesg);
            } else if (err.responseJSON.error) {
                alert(err.responseJSON.error);
            }
          }else{
              alert('请求失败，请重试！');
          }
        }
      })
    },
    // 支付方式
    homeChosePay(index) {
      this.payIndex = index;
    },
    // 显示 消除商品详情
    showDetails(item) {
      this.proDetail = item;
      this.isShowDetails = !this.isShowDetails;
    },
    closeMask(e) {
      if (e.target == this.$refs.buyList) {
        this.isShowBuyList = !this.isShowBuyList;
        this.firstBtn = false;
      }
    },
    closeAmount() {
      this.isShowBuyList = !this.isShowBuyList;
      this.firstBtn = false;
    },
    closeDetails(e) {
      if (e.target == this.$refs.details) {
        this.isShowDetails = !this.isShowDetails;
      }
    },
    settlement() {
      // this.showM = false;
      if (JSON.stringify(this.selectArr) != '{}' && this.showM == false) {
        this.isShowBuyList = !this.isShowBuyList;
        this.showM = true;
      } else if (this.showM == true) {
        this.$router.push({
          name: 'complete',
          query: {
            timestamp: (new Date()).getTime()
          }
        });
        this.showM = false;
      }
    },
    handleNav(cateId){
      //128
      this.cateId = cateId;
    },
    itemOpts(index,opt){
      //128
      let listdata = this.allDataList[this.cateId].listdata.slice();
      let oldDataList = Object.assign({},this.allDataList);
      opt == '+' &&  (listdata[index].count ++);
      opt == '-' &&  (listdata[index].count --);
      oldDataList[this.cateId].listdata = listdata;
      this.allDataList = Object.assign({},this.allDataList,oldDataList);
    },
    cartOpt(obj){
      let {cateId,index,opt} = obj;
      let listdata = this.allDataList[cateId].listdata.slice();
      let oldDataList = Object.assign({},this.allDataList);
      opt == '+' &&  (listdata[index].count ++);
      opt == '-' &&  (listdata[index].count --);
      oldDataList[cateId].listdata = listdata;
      this.allDataList = Object.assign({},this.allDataList,oldDataList);
    },
    saleSort(){
      this.sortType = 1;
      this.sortObj.price = false;
      this.sortObj.sale = !this.sortObj.sale;
      let originalData = Object.assign({},this.defaultSortData);
      Object.keys(originalData).forEach((key,index)=>{
        let newListData = [].concat(originalData[key].listdata).sort((a,b)=>{
          if(a.sellNumber){
            if(this.sortObj.sale){
              return Number(a.sellNumber) - Number(b.sellNumber)
            }else{
              return Number(b.sellNumber) - Number(a.sellNumber)
            }
          }
        });
        originalData[key] = Object.assign({},originalData[key],{listdata:newListData});
      });
      this.allDataList = originalData;
    },
    priceSort(){
      this.sortType = 2;
      this.sortObj.sale = false;
      this.sortObj.price = !this.sortObj.price;
      let originalData = Object.assign({},this.defaultSortData);
      Object.keys(originalData).forEach((key,index)=>{
        let newListData = [].concat(originalData[key].listdata).sort((a,b)=>{
          if(a.shopActualPrice){
            if(this.sortObj.price){
              return Number(a.shopActualPrice) - Number(b.shopActualPrice)
            }else{
              return Number(b.shopActualPrice) - Number(a.shopActualPrice)
            }
          }
        });
        originalData[key] = Object.assign({},originalData[key],{listdata:newListData});
      });
      this.allDataList = originalData;
    },
    defaultSort(){
      this.sortObj.price = false;
      this.sortObj.sale = false;
      this.sortType = 0;
      let originalData = Object.assign({},this.defaultSortData);
      this.allDataList = originalData;
    },
    queryBannerList(){
      WARequest({
				url : `/systems/systemFile/findFile`,
				data : {type:5},
				done : (res)=>{
					this.bannerList = res.data.result;
				},
				fail : (err)=>{
					if(err.responseJSON){
						if (err.responseJSON.error_mesg) {
							alert(err.responseJSON.error_mesg);
						} else if (err.responseJSON.error) {
							alert(err.responseJSON.error);
						}
					}else{
						alert('获取banner图失败！');
					}
				}
			})
    },
    queryShopStock(){
      WARequest({
        url : `/shops/shopproduct/getshopproductpage`,
        data : {shopId : storage.get('shopID')},
        done : (res)=>{
          let stockList = res.data.result;
          let allListCopy = Object.assign({},this.allDataList);
          Object.keys(allListCopy).forEach((cateKey,index)=>{
            if(allListCopy[cateKey].listdata){
              allListCopy[cateKey].listdata.forEach((goods,idx)=>{
                 let currGoodsArr = stockList.filter((sg,sidx)=>(
                  sg.productId == goods.id
              ));
                goods.stock = currGoodsArr[0] ? currGoodsArr[0].productNumber : 0;
              });
            }
          });
          this.allDataList = allListCopy;
        },
        fail : (err)=>{
          if(err.responseJSON){
						if (err.responseJSON.error_mesg) {
							alert(err.responseJSON.error_mesg);
						} else if (err.responseJSON.error) {
							alert(err.responseJSON.error);
						}
					}else{
						alert('获取商品库存失败！');
					}
        }
      })
    }
  },
  mounted() {
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    selectArr: function() {
      let unique = {};
      this.cartData.map((item, index) => {
        let proItemId = this.proId.slice();
        if (unique[item.id]) {
          unique[item.id]['count']++;
        } else {
          unique[item.id] = {
            goods: item,
            count: 1
          };
          proItemId.push(item.id);
        }
        this.proId = proItemId;
        if (this.driverBH.length > 0) {
          this.driverBH = this.driverBH.map((val, key) => {
            if (val.productId == unique[item.id].goods.id) {
              unique[item.id].count = val.number;
            }
            return val;
          })
        }
      });
      return unique;

    },
    total: function() {
      let total = 0;
      let bhTotal = 0;

      this.cartData.map((item, index) => {
        total += Number(item.shopPrice * 100);
      });
      total = (total.toString()).split('.');
      if (total[1]) {
        if (total[1].length < 2 && total[1].length > 0) {
          total[1] = total[1] + '0'
        }
      } else {
        total[1] = '00';
      }
      total = total.join('.');
      return total / 100;

    },
    bhTotal: function() {
      let bhTotal = 0;
    },
    cartListData : function(){
      let selectArr = [];
      let mopts = [];
      Object.keys(this.allDataList).forEach((item,index)=>{
        if(this.allDataList[item].listdata){
          this.allDataList[item].listdata.forEach((ldv,ldi)=>{
            if(ldv.count > 0){
              selectArr.push(ldv);
              mopts.push({
                cateId : item,
                index : ldi
              })
            }
          });
        }
      });
      return {selectArr,mopts}
    },
    goodsStat:function(){
      //128
      let total = 0; //总价格
      let num = 0;    //总数量
      Object.keys(this.allDataList).forEach((item,index)=>{
        if(this.allDataList[item].listdata){
          this.allDataList[item].listdata.forEach((v,i)=>{
            num = num + (v.count || 0);
            total = Number(total) + ((v.count || 0)*(v.shopActualPrice || 0));
          });
          total = Number(total).toFixed(2)
        }
      });
      return {total,num}
    }
  },
  beforeDestroy(){
    sessionStorage.set('driverCart',this.cartListData.selectArr);
  }
}
</script>

<style>
.bhAlert {
  margin-bottom: 1em;
}

.xlTop,
.xlBot,
.jgTop,
.jgBot {
  width: 1em;
  height: 0.8em;
  display: inline-block;
  position: absolute;
  background-repeat: no-repeat;
  right: 1em;
}

.xlTop,
.jgTop {
  background-image: url('../assets/sanjiao.png');
  background-position: 0 0.1em;
  top: 1.3em;
}

.xlBot,
.jgBot {
  background-image: url('../assets/sanjiao.png');
  background-position: 0 -0.3em;
  top: 1.8em;
}

.filtBtn .t-on {
  background-position: -0.65em 0.1em;
}

.filtBtn .b-on {
  background-position: -0.65em -0.3em;
}

@media (min-width:768px) {
  .xlTop,
  .xlBot,
  .jgTop,
  .jgBot {
    right: 2em;
  }
}

.home-banner-wrap{
  height: 5.5em;
  flex-shrink: 0;
  @media screen and (min-width: 359px){
    height: 6em;
  }
  @media screen and (min-width: 410px){
    height: 6.8em;
  }
}
.swiper-container {
  height: 5.5em;
  @media screen and (min-width: 359px){
    height: 6em;
  }
  @media screen and (min-width: 410px){
    height: 6.8em;
  }
}

.item-img {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.home-nav-wrap {
  position: relative;
  width: 75px;
  flex-shrink: 0;
  background-color: #f2f2f2;
  overflow-x: hidden;
  overflow-y: auto;
}

.home-nav-list {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.nav-list-img {
  width: 100%;
  height: 3em;
  line-height: 3em;
  display: block;
  padding: 0.2em 0;
  margin: 0 auto;
  text-align: center;
  background-position: 50% 50%;
  background-size: 25%;
  background-repeat: no-repeat;
  border-left: 2px solid transparent;
}

.nav-list-img:hover,
.navClass {
  background-color: #fff;
  color: #ffc700;
  font-size: 1.1em;
  border-left: 2px solid #ffc700;
}

.eat {
  background-image: url('../assets/eat.png');
}

.drink {
  background-image: url('../assets/drink.png');
}

.ji {
  background-image: url('../assets/ji.png');
}

.try {
  background-image: url('../assets/try.png');
  background-size: 80%;
}

.eat:hover,
.eat-h {
  border-left: 2px solid transparent;
  background-color: #fff;
  border-left: 2px solid #ffc700;
  background-image: url('../assets/eat-h.png');
}

.drink:hover,
.drink-h {
  border-left: 2px solid transparent;
  background-color: #fff;
  border-left: 2px solid #ffc700;
  background-image: url('../assets/drink-h.png');
}

.ji:hover,
.ji-h {
  border-left: 2px solid transparent;
  background-color: #fff;
  border-left: 2px solid #ffc700;
  background-image: url('../assets/ji-h.png');
}

.try:hover,
.try-h {
  border-left: 2px solid transparent;
  background-color: #fff;
  border-left: 2px solid #ffc700;
  background-image: url('../assets/try-h.png');
}

.priceColor {
  color: #ffc700;
}

.home-item-addBtn {
  position: absolute;
  min-height: 1.5em;
  min-width: 4.5em;
  bottom: 0.8em;
  right: 0.6em;
}

.home-delete {
  width: 22px;
  height: 22px;
  display: inline-block;
  border-radius: 100%;
  border: 0.0625em solid #ddd;
  text-align: center;
  line-height: 21px;
  position: absolute;
  bottom: 0;
  right: 3.5em;
  background-color: #f2f2f2;
}

.home-add {
  width: 22px;
  height: 22px;
  display: inline-block;
  border-radius: 100%;
  border: 0.0625em solid #ffc700;
  text-align: center;
  background-color: #ffc700;
  color: #fff;
  line-height: 21px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 0.2em;
}

.home-num {
  width: 1.3em;
  border: 0;
  display: inline-block;
  text-align: center;
  position: absolute;
  bottom: 0;
  top: 2px;
  right: 1.9em;
}

.home-num:focus {
  outline: none;
}

/**模态框 */

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.38);
  z-index: 9;
}

.details {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.details-box {
  width: 72%;
  margin: 0 auto;
  padding: 2.5em 1em;
  border-radius: 0.8em;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.details-box .details-img {
  width: 40%;
  margin: 0 auto 1em auto;
}

.details-box .home-detail-price {
  font-size: 1.2em;
  color: #db4727;
}

/*训选择支付*/

.home-pay-way {
  position: relative;
}

.home-arrow-bot {
  float: right;
  width: 1em;
  height: 1em;
  background: url('../assets/arrows-bot.png') no-repeat 0 0 / 100%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%)
}

.home-pay-way .homeAT {
  background: url('../assets/arrows-top.png') no-repeat 0 0 / 100% !important;
}

.home-pay-way {
  padding: 0.5em 0;
  color: #999;
  border-bottom: 1px solid #f2f2f2;
}

.home-pay-item {
  padding: 0.8em 0;
  overflow: hidden;
  border-bottom: 1px solid #f2f2f2;
}

.home-pay-item:last-child {
  border: 0;
}

.home-pay-text {
  padding-left: 3em;
  height: 1.5em;
  background-repeat: no-repeat;
  background-size: 25%;
  float: left;
}

.wallect {
  background-image: url('../assets/payW.png');
}

.wechar {
  background-image: url('../assets/payweixin.png');
}

.home-select-pay {
  width: 1.5em;
  height: 1.5em;
  float: right;
  background: url('../assets/chosePay.png') no-repeat 0 0 / 90%;
}




.filter-item {
  position: relative;
}

.filtBtn {
  position: relative;
  margin-right: 0.5em;
  display: inline-block;
  text-align: center;
  width: 100%;
}

.filter-item a {
  width: 9px;
  height: 6px;
  display: inline-block;
}


.home-page {
  display: flex;
  flex-direction: column;
}

.home-banner {
  max-height: 200px;
  flex-shrink: 0;
  overflow: hidden;
}

.home-box {
  flex-grow: 1;
  padding-bottom: 52px;
  display: flex;
}

.goods-sidebar {
  position: relative;
  width: 100px;
  background-color: #f2f2f2;
  overflow-x: hidden;
  overflow-y: auto;
}

.nav-list {
  text-align: center;
}

.nav-list a {
  display: block;
  padding: 0.8em 0;
}

.nav-list a.active {
  background-color: #fff;
}

.goods-list {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  position: relative;
  display: flex;
  flex-shrink: 0;
  background-color: #fff;
  z-index: 1;
  height: 50px;
  line-height: 50px;
}

.filter-bar>div {
  width: 33.33%;
  text-align: center;
}

.list-wrapper {
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
}

/* @@media s {

    } */

.list-wrapper .product-list {
  width: 100%;
  margin: 0 auto;
}

.list-wrapper .product-list li {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5em;
  border-bottom: 1px solid #f2f2f2;
  box-sizing: border-box;
  overflow: hidden;
}

.list-wrapper .product-list li:last-child {
  border-bottom: 0;
}

.list-wrapper .product-list li .product-photo {
  width: 5em;
  height: 5em;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  flex-shrink: 0;
}

.list-wrapper .product-list li .product-overview {
  flex-grow: 1;
  box-sizing: border-box;
  overflow: hidden;
}

.list-wrapper .product-list li .product-overview p {
  margin: 0.2em 0;
}

.product-overview-inner{
  padding:0 0.8em;
  width: 100%;
  overflow: hidden;
  & h3{
    margin: 0.2em 0;
    font-size: 96%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.list-wrapper .product-list li .add-btn {
  position: absolute;
  bottom: 0.6em;
  right: 1em;
  width: 1.6em;
  height: 1.6em;
  border-radius: 100%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  background-color: #ffc700;
}

.list-wrapper .product-list li .add-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 50%;
  left: 25%;
  height: 1px;
  background-color: #666;
  transform: translateY(-50%);
}

.list-wrapper .product-list li .add-btn::after {
  content: '';
  position: absolute;
  top: 25%;
  width: 1px;
  left: 50%;
  height: 50%;
  background-color: #666;
  transform: translateX(-50%);
}

.home-tools-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 4%;
  height: 52px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: normal;
  z-index: 10;
}

.home-tools-bar .cart-info {
  display: flex;
  flex: 1;
  align-items: center;
}

.home-tools-bar .cart-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  background-image: url('../assets/shoppingCart.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  background-color: #ffc700;
  flex-shrink: 0;
}

.home-tools-bar .cart-btn .badge {
  position: absolute;
  right: -2px;
  top: -2px;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 8px;
  border-radius: 100%;
  background-color: #333;
}

.home-tools-bar .total {
  margin-left: 1em;
  font-size: 1.1em;
}

.home-tools-bar .total span {
  display: inline-block;
  margin: 0 0.4em 0 0;
}

.home-tools-bar .closing-btn,
.home-bh {
  background-color: #fec62e;
  width: 4.5em;
  line-height: 2.4em;
  border-radius: 0.2em;
  text-align: center;
  font-size: 1.1em;
  margin: 0 0.2em;
  color: #fff;
}

.home-bh {
  width: 5.5em;
  background-color: #fc803b;

}

.home-tools-bar .closing-btn.disable {
  background-color: #999;
  color: #fff;
}

.list-box {
  position: absolute;
  bottom: 52px;
  left: 0;
  width: 100%;
  padding: 0 4%;
  box-sizing: border-box;
  background-color: #fff;
}

.list-box .list-box-title {
  height: 2.8em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  color: #999;
}

.list-box .close-btn {
  position: relative;
  width: 1.4em;
  height: 1.4em;
  transform: rotate(45deg);
}

.list-box .close-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #666;
  transform: translateY(-50%);
}

.list-box .close-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  background-color: #666;
  transform: translateX(-50%);
}

.list-box .list-box-body {
  padding: 0 0 1em 0;
  max-height: 14em;
  overflow: auto;
}

.buy-checklist li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 0.8em 0;
}

.buy-checklist li:last-child {
  border-bottom: 0;
}

.buy-checklist li .goods-price-amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.buy-checklist li .goods-price-amount .goods-price {
  font-size: 1.2em;
  padding-right: 1em;
  color: #db4727;
}

.buy-checklist li .goods-price-amount .amount-opts span {
  display: inline-block;
  vertical-align: middle;
  width: 1.6em;
  text-align: center;
}

.minus,
.plus {
  position: relative;
  width: 24px !important;
  height: 24px !important;
  border-radius: 100%;
  border: 1px solid #999;
  box-sizing: border-box;
}

.minus::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 50%;
  left: 25%;
  height: 1px;
  background-color: #666;
  transform: translateY(-50%);
}

.minus {
  background-color: #f2f2f2;
}

.plus {
  background-color: #ffc700;
}

.plus::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 50%;
  left: 25%;
  height: 1px;
  background-color: #666;
  transform: translateY(-50%);
}

.plus::after {
  content: '';
  position: absolute;
  top: 25%;
  width: 1px;
  left: 50%;
  height: 50%;
  background-color: #666;
  transform: translateX(-50%);
}

.details {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.details-box {
  width: 72%;
  margin: 0 auto;
  padding: 2.5em 1em;
  border-radius: 0.8em;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.details-box .details-img {
  width: 40%;
  margin: 0 auto 1em auto;
}

.details-box .product-price {
  font-size: 1.2em;
  color: #db4727;
}

.me-link {
  position: fixed;
  top: 78%;
  padding: 0 0.6em 0 0.6em;
  line-height: 40px;
  border-radius: 0 20px 20px 0;
  text-align: right;
  background-color: rgba(254, 198, 46, 1);
}

.user-head {
  width: 2.4em;
  height: 2.4em;
  margin: -2px 0 0 0.4em;
  background: url('../assets/user-head.png') no-repeat 50% 50% / 100%;
}

.empty-hint {
  padding: 1em 0;
  text-align: center;
  color: #888;
}

.select-pay {
  display: flex;
  align-items: center;
}

.select-pay .select-pay-label {
  flex-shrink: 0;
}

.select-pay .select-pay-body {
  margin-left: 0.5em;
  flex-grow: 1;
}

.select-pay .select-pay-body select {
  width: 100%;
  height: 2.6em;
  background-color: #fff;
  border: 0;
  outline: none;
}

.showBuyList-enter-active {
  animation: fadeIn 0.3s;
}

.showBuyList-enter-active .list-box {
  animation: fadeInUp 0.3s;
}

.showBuyList-leave-active {
  animation: fadeIn 0.3s reverse;
}

.showBuyList-leave-active .list-box {
  animation: fadeInUp 0.3s reverse;
}

.showDetails-enter-active {
  animation: fadeIn 0.3s;
}

.showDetails-enter-active .details-box {
  animation: zoomIn 0.3s;
}

.showDetails-leave-active {
  animation: fadeIn 0.3s reverse;
}

.showDetails-leave-active .details-box {
  animation: zoomIn 0.3s reverse;
}


@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
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
  .home-banner {
    width: 75%;
    margin: 0 auto;
  }
  .swiper-container {
    height: 10em;
  }
  .item-img {
    width: 75%;
    margin: 0 auto;
    height: 10em;
  }
  .home-box {
    width: 75%;
    margin: 0 auto;
    background: #fff;
  }
  .home-page {
    background: #333;
  }
  .me-link {
    left: 10%;
  }
  .home-tools-bar {
    width: 75%;
    left: 10%;
  }
  .list-box {
    width: 75%;
    left: 10%;
  }
  .list-wrapper .product-list li .product-overview {
    padding-left: 2em;
  }
  .home-item-addBtn {
    margin-right: 4em;
  }
  .home-nav-wrap {
    width: 100px;
  }
  .nav-list-img {
    height: 5em;
  }
}
.swiper-pagination-bullet-active{
  background-color: #fff !important;
}
.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets{
	bottom: 0 !important;
}
.swiper-pagination-bullet{
	width: 6px !important;
	height: 6px !important;
}
</style>
