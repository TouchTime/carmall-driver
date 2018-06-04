<template>
    <div class="page home-page">
        <div class='home-banner-wrap'>
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide><div class='item-img'></div></swiper-slide>
                <swiper-slide><div class='item-img'></div></swiper-slide>
                <swiper-slide><div class='item-img'></div></swiper-slide>
                <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
        </div>
        <div class="home-box">
            <div class='home-nav-wrap'>
                <ul class='home-nav-list'>
                    <li @click='navClick(item,index)' v-for='(item,index) in navList'>
                        <span :class='{"navClass":item.id == currIndex}' class='nav-list-img'>{{item.cateName}}</span>
                    </li>
                    
                </ul>
                </div>
                <div class="goods-list">
                    <div class="filter-bar">
                    <div class="filter-item">
                        <span class='filter-default priceColor'>默认排行</span>
                    </div>
                    <div class="filter-item">
                        <span class='filtBtn home-filter-xl'>
                            销量
                            <a class='xlTop'></a>
                            <a class='xlBot'></a>
                        </span>
                    </div>
                    <div class="filter-item">
                        <span class='filtBtn home-filter-jg'>
                            价格
                            <a class='jgTop'></a>
                            <a class='jgBot'></a>
                        </span>
                        
                    </div>
                </div>
                <div class="list-wrapper">
                    <ul v-if='navList.length > 0' class="product-list">
                        <li v-for="(item,index) in navList[idx].rtList">
                        <div class="product-photo" @click='showDetails(item)' :style='{backgroundImage:"url("+item.productImgUrl+")"}'></div>
                        <div class="product-overview">
                            <p><strong>{{item.name}}</strong></p>
                            <p><span>进货价：</span><small class="priceColor">¥ </small><span class="priceColor">{{item.shopPrice}}</span></p>
                            <p><span>销售价：</span><small class="priceColor">¥ </small><span class="priceColor">{{item.sellPrice}}</span></p>
                            <p><span>利&nbsp;&nbsp;&nbsp;&nbsp;润：</span><small class="priceColor">¥ </small><span class="priceColor">{{item.sellPrice - item.shopPrice}}</span></p>
                        </div>
                        <div class='home-item-addBtn'>
                            <span  v-show='item.count > 0' @click='homeDeletePro(item)' class="home-delete">-</span>
                            <span v-show='item.count > 0' class='home-num'>{{item.count}}</span>
                            <span @click='homeAddPro(item,index);' class="home-add">+</span>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="home-tools-bar">
            <div class="cart-info">
                <div class="cart-btn" @click="openCart(cartData)">
                    <div class="badge" v-if='driverBH.length == 0'>{{cartData.length}}</div>
                    <div class="badge" v-if='driverBH.length > 0'>{{sum}}</div>
                </div>
                <div class="total"><span>合计：</span><span>¥</span><span>{{total}}</span></div>
            </div>
            <div class='home-bh' @click='homeClickBH'>一键</div>
            <div  @click='goSure(selectArr,proId)' :class="{'closing-btn':true,'disable': Number(total) <= 0}">结算</div>
        </div>
        
        <transition name="showBuyList">
            <div v-if="isShowBuyList" ref="buyList" class="mask buy-list" @click="closeMask">
                <div class="list-box">
                    <div class="list-box-title">
                        <div class="title-text">已选商品</div>
                        <div class="close-btn" @click="closeAmount"></div>
                    </div>
                    <div class="list-box-body">
                        <div v-if="JSON.stringify(selectArr) != '{}'">
                            <ul class="buy-checklist">
                                <li v-for="(item,index) in selectArr">
                                <div class="goods-name">{{item.goods.name}}</div>
                                <div class="goods-price-amount">
                                    <div class="goods-price"><small>¥</small><span>{{item.goods.shopPrice}}</span></div>
                                    <div class="amount-opts">
                                    <span class="minus" @click="homeDeletePro(item.goods)"></span>
                                    <span>{{item.count}}</span>
                                    <span class="plus" @click="addCart(item.goods)"></span>
                                    </div>
                                </div>
                                </li>
                            </ul>
                        </div>
                        <p class="empty-hint" v-if="JSON.stringify(selectArr) == '{}'">购物车空空的</p>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="showDetails">
            <div v-if="isShowDetails" class="mask details" ref="details" @click="closeDetails">
                <div class="details-box">
                <div class="details-img"><img :src="proDetail.productImgUrl" alt=""/></div>
                <div class="details-desc">
                    <p class="product-name"><strong>{{proDetail.name}}</strong></p>
                    <p class="product-price"><small>¥ </small><span>{{proDetail.price}}</span></p>
                    <p class="product-replenish">{{proDetail.productContent}}</p>
                </div>
                </div>
            </div>
        </transition>
        <transition name="showDetails">
            <div v-if="isShowBHModel" class="mask details" ref="details" @click="isShowBHModel = !isShowBHModel">
                <div class="details-box">
                    您的购物车已有商品，是否清空！
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import {WARequest,loginInfo,storage} from '../util.js'
    import 'swiper/dist/css/swiper.css'
    import {swiper,swiperSlide} from 'vue-awesome-swiper'
        
    import payW from '../assets/payW.png'
    import payweixin from '../assets/payweixin.png'

  export default {
    components:{
        swiper,
        swiperSlide
    },
    data(){
     return{
        isShowBHModel:false,
        priceF:false,//价格筛选
        salesF:false,//销量筛选
        chosePay:[
            {choseT:'账户安全支付',choseImg:payW,choseNum:'0'},
            {choseT:'微信支付',choseImg:payweixin,choseNum:'1'},
        ],
        totalNum:0,//商品数量
        proId:[],//商品id
        dataI:'',//支付方式
        payIndex:'',//支付
        navList:[],
        homeOrderList:'',//全部订单
        idx:0,//导航切换的索引
        firstBtn:false,//第一次点击结算
        cateName:'',//每项的属于
        shoppingCart:'',
        showM:false,//是否显示模态框
        currIndex : '2',//导航点击切换的中间量
        cartData:[],//购物车接收的数据
        currGoods:{},
        isShowBuyList:false,//是否显示购物列表
        isShowDetails:false,//是否显示商品详情
        payStatus:false,//选择支付方式
        proDetail:[],
        homeJsonData:'',
        list:'',//传过去的订单
        swiperOption: {
            loop:true,
            autoplay:true,
            pagination:'.swiper-pagination',
        },
        classifyData:[
            {
                classifyTitle:'eat-h',
                listData:[
                    {
                        pid : '001',
                        photo:'',
                        name:'牛肉干',
                        proNum:1,
                        purchasing:'17.00',
                        sales:'22.00',
                        profit:'5.00'
                    }
                ]
            }
        ],
        driverBH:[],//一键补货
        sum:0,//购物车数量
      }
    },
    created (){
        window.shopID = storage.get('shopID');
        var that = this;
        // 导航切换
        this.homeNavData();
        // 获取数据列表
        // this.homeProData();  
        //一键补货
        // this.BHData();
    },
    methods:{  
        // 判断一键补货 时  购物车状况
        homeClickBH (){
            if(JSON.stringify(this.selectArr) !== '{}'){
                this.isShowBHModel = !this.isShowBHModel;
            }
        },
        // 一键补货获取数据    
        BHData (){
            WARequest({
                url:'/shops/shoptemplate/gettemplate',
                done:(data)=>{
                    console.log(data);
                    this.driverBH = data.data.result;
                },
                fail:(err)=>{
                    if(err){alert(err)}
                }
            })
        },  
        // 一键补货
        oneKeyBH (){
            var navListItem = this.navList.slice();
            var driverBHItem = this.driverBH.slice();
            var newList = this.cartData.slice();
            var numSum = 0;
            var bhSum = 0;
            navListItem.map((item,index)=>{
                driverBHItem.map((val,key)=>{
                    if((val.cmProduct.cateId == item.id) && (item.rtList != undefined)){
                        item.rtList.map((v,i)=>{
                            if(val.productId == v.id){
                                v.count = val.number;
                                newList.push(v);
                            }
                        })
                        this.cartData = newList;
                    }
                });
                // 购物车小数字头标
                if(item.rtList != undefined){
                    item.rtList.forEach((val,index)=>{
                        numSum += val.count;
                    })
                    this.sum = numSum;
                }
            })
            this.navList = navListItem;
            // console.log(this.navList)
        },
        // 点击结算生成订单
        goSureSuc (data){
            storage.set('homeOrderList',data.data);
            this.$router.push({
                name:'sureOrder',
                query:{
                    timestamp:(new Date()).getTime(),
                   
                }
            })
        },
        goSure (selectArr,proId){
            if(this.firstBtn == false){
                this.isShowBuyList = !this.isShowBuyList;
                this.firstBtn = true;
            }else if(this.firstBtn == true){
                if(Number(this.total) > 0){
                    let selArr = [];
                    let list = [];
                    let proIdList = [];
                    let wrap = {};
                    proIdList.push(proId);
                    selArr.push(selectArr);
                    selArr.map((item,index)=>{
                        proIdList[0].map((pItem,i)=>{
                            var selected = {
                                id:item[pItem].goods.id,
                                // ShopId:window.shopID,
                                ShopId:1,
                                num:item[pItem].count
                            }
                            list.push(selected);
                            
                        })
                       
                    })
                    this.list = JSON.stringify(list);
                    this.homeOrderPayList = storage.set('homeOrderPayList',this.list)
                    const info = loginInfo();
                    WARequest({
                        method:'POST',
                        data:{
                            takeType:0,
                            isShow:1,
                            buyUid:info['user'].id,
                            // buyUid:2000000017,
                            shoppingWay:1,
                            orderType:1,
                            choosedShopProductList:this.list
                        },
                        // url:'http://192.168.31.14:8085/order/userbuyproduct/',
                        url:'/orders/order/userbuyproduct/',
                        done:this.goSureSuc,
                        fail: function(err) {
                            if(err){
                                alert(err)
                            }
                        }
                    })
                   
                }
                this.firstBtn = false;
            } 
        },
        //打开购物列表 点击购物车图标
        openCart (cartData){
            this.isShowBuyList = !this.isShowBuyList;
            this.firstBtn = false;
        },
        // 点击导航切换列表
        navClick (item,index){
            this.currIndex = item.id;
            this.idx = index;
            if(!this.navList[index].rtList){
                this.homeProData();
            }
        },
        // 导航请求
        homeNavData(){
            WARequest({
                method:'GET',
                data:{page:1,size:7},
                // url:'http://192.168.31.14:8087/platform/product/cate/',
                url:'/platforms/platform/product/cate/',
                done:this.homeNavSuc,
                fail: function(err) {
                    if(err){
                        alert(err)
                    }
                }
            })
        },
        homeNavSuc(data){
            // console.log(data)
            this.navList = data.data.result;
            this.homeProData(); 
        },
        // 商品列表请求数据
        homeProData(){
            WARequest({
                method:'GET',
                data:{page:1,size:100,cateId:this.currIndex,sortSell:'',sortPrice:''},
                // url:'http://192.168.31.14:8087/platform/product/',
                url:'/platforms/platform/product/',
                done:this.homeProSuc,
                fail: function(err) {
                    if(err){
                       alert(err)
                    }
                }
            })
        },
        homeProSuc(data){
            this.classifyData = data.data.result.map((item,index)=>{
                 item.count = 0;
                 this.cateName = item.cateName;
                return item;
            });
            let navData = this.navList.slice();
            navData.map((item,index)=>{
                if(item.cateName == this.cateName){
                    item.rtList = this.classifyData;
                }
                return item;
            })
            this.navList = navData;
            this.oneKeyBH();
            // console.log(this.navList[this.idx].rtList)
        },
        // 支付方式
        homeChosePay (index){
            this.payIndex = index;
        },
        // 显示 消除商品详情
        showDetails (item){
            this.proDetail = item;
            this.isShowDetails = !this.isShowDetails;
        },
        // 点击添加删除 商品{}
        homeAddPro (item,index){
            let newList = this.cartData.slice();
            var homeProList = this.navList[this.idx].rtList;
            newList.push(homeProList[index]);
            if(homeProList[index].count < 20){
                homeProList[index].count++;
            }
            this.cartData = newList;
            var numSum = 0;
            // 购物车小数字头标
            if(homeProList != undefined){
                homeProList.forEach((val,index)=>{
                    numSum += val.count;
                })
                this.sum = numSum;
            }
            
        },
        homeDeletePro (item){
            let newList = this.cartData.slice();
            let index = -1;
            newList.forEach((val,idx)=>{
                if(item.count == val.count){
                    index = idx;
                }
            })
            if(index >= 0){
                newList.splice(index,1);
            }
            if(item.count > 0){
               item.count --;
            }
            this.cartData = newList;
            var homeProList = this.navList[this.idx].rtList;
            var numSum = 0;
            // 购物车小数字头标
            if(homeProList != undefined){
                homeProList.forEach((val,index)=>{
                    numSum += val.count;
                })
                this.sum = numSum;
            }
        },
        addCart(item){
            let newList = this.cartData.slice();
            newList.push(item);
            this.cartData = newList;
            if(item.count < 20){
               item.count ++;
            }
            var homeProList = this.navList[this.idx].rtList;
            var numSum = 0;
            // 购物车小数字头标
            if(homeProList != undefined){
                homeProList.forEach((val,index)=>{
                    numSum += val.count;
                })
                this.sum = numSum;
            }
        },
       
        closeMask(e){
            if(e.target == this.$refs.buyList){
                this.isShowBuyList = !this.isShowBuyList;
                this.firstBtn = false;
            }
        },
        closeAmount (){
            this.isShowBuyList = !this.isShowBuyList;
            this.firstBtn = false;
        },
        closeDetails(e){
            if(e.target == this.$refs.details){
                this.isShowDetails = !this.isShowDetails;
            }
        },
        settlement(){
            // this.showM = false;
            if(JSON.stringify(this.selectArr) != '{}' &&  this.showM == false){
                this.isShowBuyList = !this.isShowBuyList;
                this.showM = true;
            }else if( this.showM == true){
                this.$router.push({
                name:'complete',
                query: {
                    timestamp: (new Date()).getTime()
                }});
                this.showM = false;
            }
        }
    },
    mounted (){
        $('title').html('车猫掌柜');
        var this_ = this;
        var jsonData = {page:1,size:100,cateId:this.currIndex,sortSell:'',sortPrice:''};
       
        function otherGetData (){
            WARequest({
                data:jsonData,
                // url:'http://192.168.31.225:8087/platform/product/',
                url:'/platforms/platform/product/',
                done:(data)=>{
                    // console.log(data)
                },
                fail: function(err) {
                    if(err){
                        alert(err)
                    }
                }
            })
        }
        // 默认排行
        $('.filter-default').on('click',function(){
            jsonData = {page:1,size:100,cateId:this.currIndex,sortSell:'',sortPrice:''};
            otherGetData();
            $(this).addClass('priceColor')
                   .parent().parent('.filter-bar')
                   .find('.xlTop').removeClass('t-on')
                   .siblings('.xlBot').removeClass('b-on')
                   .parent().parent().parent('.filter-bar')
                   .find('.jgTop').removeClass('t-on')
                   .siblings('.jgBot').removeClass('b-on');
                  
        })
        // 销量筛选
        $('.home-filter-xl').on('click',function(){
            $('.filter-default').removeClass('priceColor');
            if(this_.salesF == false){
                jsonData = {page:1,size:100,cateId:this_.currIndex,sortSell:1,sortPrice:''};
                otherGetData();
                $(this).children('.xlTop').addClass('t-on').siblings('.xlBot').removeClass('b-on')
                       .parent('.filtBtn').parent('.filter-item').siblings('.filter-item').children('.filtBtn')
                       .children('.jgTop').removeClass('t-on').siblings('.jgBot').removeClass('b-on');
                this_.salesF = true;
            }else if(this_.salesF == true){
                jsonData = {page:1,size:100,cateId:this_.currIndex,sortSell:2,sortPrice:''};
                otherGetData();
                $(this).children('.xlBot').addClass('b-on').siblings('.xlTop').removeClass('t-on')
                       .parent('.filtBtn').parent('.filter-item').siblings('.filter-item').children('.filtBtn')
                       .children('.jgTop').removeClass('t-on').siblings('.jgBot').removeClass('b-on');
                this_.salesF = false;
            }
        })
        // 价格筛选
        $('.home-filter-jg').on('click',function(){
            $('.filter-default').removeClass('priceColor');
            if(this_.priceF == false){
                jsonData = {page:1,size:100,cateId:this_.currIndex,sortSell:'',sortPrice:1};
                otherGetData();
                $(this).children('.jgTop').addClass('t-on').siblings('.jgBot').removeClass('b-on')
                       .parent('.filtBtn').parent('.filter-item').siblings('.filter-item').children('.filtBtn')
                       .find('.xlTop').removeClass('t-on').siblings('.xlBot').removeClass('b-on');
                this_.priceF = true;
            }else if(this_.priceF == true){
                jsonData = {page:1,size:100,cateId:this_.currIndex,sortSell:'',sortPrice:2};
                otherGetData();
                $(this).children('.jgBot').addClass('b-on').siblings('.jgTop').removeClass('t-on')
                       .parent('.filtBtn').parent('.filter-item').siblings('.filter-item').children('.filtBtn')
                       .children('.xlTop').removeClass('t-on').siblings('.xlBot').removeClass('b-on');
                this_.priceF = false;
            }
        });
    },
    computed:{
      selectArr:function(){
        let unique = {};
        this.cartData.map((item,index)=>{
            let proItemId = this.proId.slice();
            if(unique[item.id]){
                unique[item.id]['count']++;
            }else{
                unique[item.id] = {goods : item,count : 1};
                proItemId.push(item.id);
            }
            this.proId = proItemId;  
            if(this.driverBH.length > 0){
                this.driverBH = this.driverBH.map((val,key)=>{
                    if(val.productId == unique[item.id].goods.id){
                        unique[item.id].count = val.number;
                    }
                    return val;
                })
            }
        });
        return unique;
        
      },
      total:function() {
        let total = 0;
        let bhTotal = 0;
        
        this.cartData.map((item,index)=>{
            total += Number(item.shopPrice*100);
        });
        total = (total.toString()).split('.');
        if(total[1]){
            if(total[1].length < 2 && total[1].length>0){
                total[1] = total[1]+'0'
            }
        }else{
            total[1] = '00';
        }
        total = total.join('.');
        return total/100;
          
      },
    }
  }
</script>

<style>

    .xlTop,.xlBot,.jgTop,.jgBot{
        width:1em;
        height:0.8em;
        display:inline-block;
        position:absolute;
        background-repeat:no-repeat;
        right: 1em;
    }
    .xlTop,
    .jgTop{
        background-image:url('../assets/sanjiao.png');
        background-position:0 0.1em;
        top: 1.3em;
    }
    .xlBot,
    .jgBot{
        background-image:url('../assets/sanjiao.png');
        background-position:0 -0.3em;
        top: 1.8em;
    }
    .filtBtn .t-on{
        background-position:-0.65em 0.1em;
    }
    .filtBtn .b-on{
        background-position:-0.65em -0.3em;
    }
    @media (min-width:768px){
        .xlTop,.xlBot,.jgTop,.jgBot{right:2em;}
    }

    
    .swiper-container{
        height:8em;
    }
    .item-img{
        width:100%;
        height:8em;
        background-image:url('../assets/Christmas.png');
        background-repeat:no-repeat;
        background-size:100%;
        background-position:center;
    }
    .home-nav-wrap{
        position:relative;
        width:75px;
        background-color:#f2f2f2;
        overflow-x:hidden;
        overflow-y:auto;
    }
    .home-nav-list{
        position:relative;
        flex-grow:1;
        display:flex;
        flex-direction:column;
    }

    .nav-list-img{
        width:100%;
        height:3em;
        line-height:3em;
        display:block;
        padding:0.2em 0;
        margin:0 auto;
        text-align:center;
        background-position:50% 50%;
        background-size:25%;
        background-repeat:no-repeat;
        border-left:2px solid transparent;
    }
    .nav-list-img:hover,
    .navClass{
        background-color:#fff;
        color:#ffc700;
        font-size: 1.1em;
        border-left:2px solid #ffc700;
    }
    .eat{
        background-image:url('../assets/eat.png');
    }
    .drink{
        background-image:url('../assets/drink.png');
    }
    .ji{
        background-image:url('../assets/ji.png');
    }
    .try{
        background-image:url('../assets/try.png');
        background-size:80%;
    }

    .eat:hover,
    .eat-h{
        border-left:2px solid transparent;
        background-color:#fff;
        border-left:2px solid #ffc700;
        background-image:url('../assets/eat-h.png');
    }
    .drink:hover,
    .drink-h{
        border-left:2px solid transparent;
        background-color:#fff;
        border-left:2px solid #ffc700;
        background-image:url('../assets/drink-h.png');
    }
    .ji:hover,
    .ji-h{
        border-left:2px solid transparent;
        background-color:#fff;
        border-left:2px solid #ffc700;
        background-image:url('../assets/ji-h.png');
    }
    .try:hover,
    .try-h{
        border-left:2px solid transparent;
        background-color:#fff;
        border-left:2px solid #ffc700;
        background-image:url('../assets/try-h.png');
    } 
    .priceColor{
        color:#ffc700;
    }
    .home-item-addBtn{
        position:relative;
        height:6em;
        margin-right:0;
    }
    .home-delete{
        width: 1.5em;
        height: 1.5em;
        display: inline-block;
        border-radius: 100%;
        border: 0.0625em solid #ddd;
        text-align: center;
        line-height: 1.5em;
        position: absolute;
        bottom: 0;
        right: 3.5em;
        background-color: #f2f2f2;
    }

    .home-add{
        width: 1.5em;
        height: 1.5em;
        display: inline-block;
        border-radius: 100%;
        border: 0.0625em solid #ffc700;
        text-align: center;
        background-color:#ffc700;
        color:#fff;
        line-height: 1.5em;
        position: absolute;
        bottom: 0;
        right: 0;
        margin-right: 0.2em;
    }
    .home-num{
        width:1.3em;
        border:0;
        display:inline-block;
        text-align:center;
        position: absolute;
        bottom: 0;
        right: 2em;
    }
    .home-num:focus{
        outline:none;
    }
    /**模态框 */
    .mask{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(10,10,10,0.38);
        z-index:9;
    }
    .details{
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:100;
    }
    .details-box{
        width:72%;
        margin:0 auto;
        padding:2.5em 1em;
        border-radius:0.8em;
        background-color:#fff;
        text-align:center;
        box-sizing:border-box;
        box-shadow:0 0 4px rgba(0,0,0,0.2);
    }
    .details-box .details-img{
        width:40%;
        margin:0 auto 1em auto;
    }
    .details-box .home-detail-price{
        font-size:1.2em;
        color:#db4727;
    }
    /*训选择支付*/
  
    .home-pay-way{
        position:relative;
    }
    .home-arrow-bot{
        float:right;
        width:1em;
        height:1em;
        background:url('../assets/arrows-bot.png') no-repeat 0 0 / 100%;
        position:absolute;
        right:0;
        top:50%;
        transform:translate(-50%,-50%)
    }
    .home-pay-way .homeAT{
        background:url('../assets/arrows-top.png') no-repeat 0 0 / 100% !important;
    }
    .home-pay-way{
        padding:0.5em 0;
        color:#999;
        border-bottom:1px solid #f2f2f2;
    } 
    .home-pay-item{
        padding:0.8em 0;
        overflow:hidden;
        border-bottom:1px solid #f2f2f2;
    }
    .home-pay-item:last-child{
        border:0;
    }
    .home-pay-text{
        padding-left:3em;
        height:1.5em;
        background-repeat:no-repeat;
        background-size:25%;
        float:left;
    }
    .wallect{
        background-image:url('../assets/payW.png');
    }
    .wechar{
        background-image:url('../assets/payweixin.png');
    }
    .home-select-pay{
        width:1.5em;
        height:1.5em;
        float:right;
        background:url('../assets/chosePay.png') no-repeat 0 0 / 90%;
    }




    .filter-item{
    position:relative;
    }
    .filtBtn{
        position:relative;
    margin-right:0.5em;
    display:inline-block;
    text-align:center;
    width:100%;
    }
    .filter-item a{
    width:9px;
    height:6px;
    display:inline-block;
    }


    .home-page{
    display: flex;
    flex-direction: column;
    }
    .home-banner{
    max-height: 200px;
    flex-shrink: 0;
    overflow: hidden;
    }
    .home-box{
    flex-grow: 1;
    padding-bottom: 52px;
    display: flex;
    }
    .goods-sidebar{
    position: relative;
    width: 100px;
    background-color: #f2f2f2;
    overflow-x: hidden;
    overflow-y: auto;
    }
    .nav-list{
    text-align: center;
    }
    .nav-list a{
    display: block;
    padding: 0.8em 0;
    }
    .nav-list a.active{
    background-color: #fff;
    }
    .goods-list{
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    }
    .filter-bar{
    position: relative;
    display: flex;
    flex-shrink: 0;
    background-color: #fff;
    z-index: 1;
    height: 50px;
    line-height: 50px;
    }
    .filter-bar>div{
    width: 33.33%;
    text-align: center;
    }
    .list-wrapper{
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    background-color:#fff;
    }
    /* @@media s {

    } */
    .list-wrapper .product-list{
    width: 95%;
    margin: 0 auto;
    }
    .list-wrapper .product-list li{
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5em 0;
    border-bottom: 1px solid #f2f2f2;
    }
    .list-wrapper .product-list li:last-child{
    border-bottom: 0;
    }
    .list-wrapper .product-list li .product-photo{
    width: 5em;
    height: 5em;
    background-size:60%;
    background-position:center;
    background-repeat:no-repeat;
    text-align:center;
    }
    .list-wrapper .product-list li .product-overview{
    flex-grow: 1;
    padding-left: 1.6em;
    }
    .list-wrapper .product-list li .product-overview p{
    margin: 0.2em 0;
    }
    .list-wrapper .product-list li .add-btn{
    position: absolute;
    bottom: 0.6em;
    right: 1em;
    width: 1.6em;
    height: 1.6em;
    border-radius: 100%;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    background-color: #ffc700;
    }
    .list-wrapper .product-list li .add-btn::before{
    content: '';
    position: absolute;
    top: 50%;
    width: 50%;
    left: 25%;
    height: 1px;
    background-color: #666;
    transform: translateY(-50%);
    }
    .list-wrapper .product-list li .add-btn::after{
    content: '';
    position: absolute;
    top: 25%;
    width: 1px;
    left: 50%;
    height: 50%;
    background-color: #666;
    transform: translateX(-50%);
    }
    .home-tools-bar{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 4%;
    height: 52px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: normal;
    z-index: 10;
    }
    .home-tools-bar .cart-info{
    display: flex;
    align-items: center;
    }
    .home-tools-bar .cart-btn{
    position: relative;
    width: 44px;
    height:44px;
    border-radius: 100%;
    background-image: url('../assets/shoppingCart.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size:70%;
    background-color: #ffc700;
    }
    .home-tools-bar .cart-btn .badge{
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
    .home-tools-bar .total{
    margin-left: 1em;
    font-size: 1.1em;
    }
    .home-tools-bar .total span{
    display: inline-block;
    margin: 0 0.4em 0 0;
    }
    .home-tools-bar .closing-btn,
    .home-bh{
        background-color: #fec62e;
        width: 4.5em;
        line-height: 2.4em;
        border-radius: 0.2em;
        text-align: center;
        font-size: 1.1em;
        margin:0 0.2em;
    }
    .home-bh{
        background-color: #fc803b;
        color:#fff;
    }
    .home-tools-bar .closing-btn.disable{
    background-color: #999;
    color: #fff;
    }
    .list-box{
    position: absolute;
    bottom: 52px;
    left: 0;
    width: 100%;
    padding: 0 4%;
    box-sizing: border-box;
    background-color: #fff;
    }
    .list-box .list-box-title{
    height: 2.8em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    color: #999;
    }
    .list-box .close-btn{
    position:relative;
    width: 1.4em;
    height: 1.4em;
    transform: rotate(45deg);
    }
    .list-box .close-btn::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #666;
    transform: translateY(-50%);
    }
    .list-box .close-btn::after{
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: #666;
    transform: translateX(-50%);
    }
    .list-box .list-box-body{
    padding: 0 0 1em 0;
    }
    .buy-checklist li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding: 0.8em 0;
    }
    .buy-checklist li:last-child{
    border-bottom: 0;
    }
    .buy-checklist li .goods-price-amount{
    display: flex;
    align-items: center;
    justify-content: space-between;
    }
    .buy-checklist li .goods-price-amount .goods-price{
    font-size: 1.2em;
    padding-right: 1em;
    color: #db4727;
    }
    .buy-checklist li .goods-price-amount .amount-opts span{
    display: inline-block;
    vertical-align: middle;
    width: 1.6em;
    text-align: center;
    }
    .minus,.plus{
    position: relative;
    width: 24px !important;
    height: 24px !important;
    border-radius: 100%;
    border: 1px solid #999;
    box-sizing: border-box;
    }
    .minus::after{
    content: '';
    position: absolute;
    top: 50%;
    width: 50%;
    left: 25%;
    height: 1px;
    background-color: #666;
    transform: translateY(-50%);
    }
    .minus{
    background-color: #f2f2f2;
    }
    .plus{
    background-color: #ffc700;
    }
    .plus::before{
    content: '';
    position: absolute;
    top: 50%;
    width: 50%;
    left: 25%;
    height: 1px;
    background-color: #666;
    transform: translateY(-50%);
    }
    .plus::after{
    content: '';
    position: absolute;
    top: 25%;
    width: 1px;
    left: 50%;
    height: 50%;
    background-color: #666;
    transform: translateX(-50%);
    }
    .details{
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
    }
    .details-box{
    width: 72%;
    margin: 0 auto;
    padding: 2.5em 1em;
    border-radius: 0.8em;
    background-color: #fff;
    text-align: center;
    box-sizing: border-box;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    }
    .details-box .details-img{
    width: 40%;
    margin: 0 auto 1em auto;
    }
    .details-box .product-price{
    font-size: 1.2em;
    color: #db4727;
    }
    .me-link{
    position: fixed;
    top: 78%;
    padding: 0 0.6em 0 0.6em;
    line-height: 40px;
    border-radius: 0 20px 20px 0;
    text-align: right;
    background-color: rgba(254,198,46,1);
    }
    .user-head{
    width: 2.4em;
    height: 2.4em;
    margin: -2px 0 0 0.4em;
    background: url('../assets/user-head.png') no-repeat 50% 50% / 100%;
    }
    .empty-hint{
    padding: 1em 0;
    text-align: center;
    color: #888;
    }
    .select-pay{
    display: flex;
    align-items: center;
    }
    .select-pay .select-pay-label{
    flex-shrink: 0;
    }
    .select-pay .select-pay-body{
    margin-left: 0.5em;
    flex-grow: 1;
    }
    .select-pay .select-pay-body select{
    width: 100%;
    height: 2.6em;
    background-color: #fff;
    border: 0;
    outline: none;
    }

    .showBuyList-enter-active{
    animation: fadeIn 0.3s;
    }
    .showBuyList-enter-active .list-box{
    animation: fadeInUp 0.3s;
    }
    .showBuyList-leave-active{
    animation: fadeIn 0.3s reverse;
    }
    .showBuyList-leave-active .list-box{
    animation: fadeInUp 0.3s reverse;
    }
    .showDetails-enter-active{
    animation: fadeIn 0.3s;
    }
    .showDetails-enter-active .details-box{
    animation: zoomIn 0.3s;
    }
    .showDetails-leave-active{
    animation: fadeIn 0.3s reverse;
    }
    .showDetails-leave-active .details-box{
    animation: zoomIn 0.3s reverse;
    }


    @keyframes fadeIn {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
    }

    @keyframes fadeInUp {
    0%{
        opacity: 0;
        transform: translate3d(0,100%,0);
    }
    100%{
        opacity: 1;
        transform: none;
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
    @media (min-width:300px){
    .list-wrapper .product-list li .product-overview{
        padding-left:1em;
    }
    .list-wrapper .product-list li .add-btn{
        right:0.4em;
    }
    }
    @media (min-width:768px){
        .home-banner{
            width:75%;
            margin:0 auto;
        }
        .swiper-container{
            height:10em;
        }
        .item-img{
            width:75%;
            margin:0 auto;
            height:10em;
        }
        .home-box{
            width:75%;
            margin:0 auto;
            background:#fff;
        }
        .home-page{
            background:#333;
        }
        .me-link{
            left:10%;
        }
        .home-tools-bar{
            width:75%;
            left:10%;
        }
        .list-box{
            width:75%;
            left:10%;
        }
        .list-wrapper .product-list li .product-overview {
            padding-left: 2em;
        }
        .home-item-addBtn{
            margin-right:4em;
        }
        .home-nav-wrap{width:100px;}
        .nav-list-img{height:5em;}
    }
</style>
