<template>
    <div class='my-address'>
      <div class='my-address-con'>
        <div class='my-addr'>
          <ul class='my-addr-wrap' v-if='addrList.length > 0' >
            <li class='my-addr-list' v-for='(item,index) in addrList' @click='changeAddr(index)'>
              <p class='my-addr-info'>
                <span class='my-addr-name'>收货人：{{item.customerName}}</span>
                <span class='my-addr-tel'>{{item.mobile}}</span>
              </p>
              <p class='my-addr-addr'>
                <span>地址:{{item.province}}{{item.city}}{{item.district}}{{item.street}}{{item.address}}</span>
              </p>
            </li>
          </ul>
          <p v-if='addrList.length == 0' class='my-addr-noMsg'>
            <span class='noMsg'>暂无收货地址！</span>
          </p>
        </div>
        <div class="mad-tools-bar" @click='goWriteA'>
          <div class="mad-cart-info">新增收货地址</div>
        </div>
      </div>
    </div>
</template>
<script>
    import {WARequest,loginInfo,storage} from '../util.js'
    export default {
        data (){
            return {
               addrList:[],
            }
        },
        created (){
            this.addrData();
        },
        methods:{
          // 填写收货地址
          goWriteA (){
            this.$router.replace({
              name:'WriteAddress',
              query:{timestamp:(new Date()).getTime()}
            })
          },
          // 更改地址
          changeAddr (index){
            // console.log(this.addrList[index]);
           storage.set('chooseAddr',this.addrList[index]);
            this.$router.push({
                name:'sureOrder'
            })
          },
          // 查询地址列表
          addrDataSuc (data){
            // console.log(data);
            this.addrList = data.data.result.map((item,index)=>{
              return item;
            });
            // console.log(this.addrList)
            storage.set('addrList',this.addrList);
          },
          addrData (){
            const info = loginInfo();
            WARequest({
              method:'GET',
              data:{uid:info['user'].id},
              // data:{uid:1},
              // url:'http://192.168.31.14:8086/shopadress/getadresspage/',
              url:'/shops/shopadress/getadresspage/',
              done:this.addrDataSuc,
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
        },
        mounted (){
            $('title').html('车猫掌柜-我的地址');
        }
    }
</script>
<style>
  .my-address-con{
    display: flex;
    flex-direction: column;
    padding-bottom:52px;
  }
  .mad-tools-bar{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 52px;
    background-color: #efc31c;
    box-sizing: border-box;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    z-index: 10;
  }
  .mad-tools-bar .mad-cart-info{
    text-align:center;
    line-height:52px;
    height:100%;
    margin: 0 auto;
  }
  @media (min-width:768px){
    .mad-tools-bar{
      background-color:#333;
    }
    .mad-tools-bar .mad-cart-info{
      width:75%;
      background-color:#ffc700;
    }
  }
    
  .my-addr-write{
    width:90%;
    margin:0 auto;
    text-align: right;
  }
  .my-addr-add{
    width:8em;
    border:0;
    padding:0.5em 1em;
    background-color:#efc31c;
    border-radius:0.5em;
    margin-top:1em;
    color:#fff;
  }
  .my-addr-noMsg{
    position:absolute;
    top:50%;
    left:50%;
    text-align:center;
    transform:translate(-50%,-50%);
  }
  .noMsg{
    width:100%;
    display:inline-block;
    text-align:center;
    height:100%;
    color:#999;
    font-size:1.1em;
  }
  .text-yellow{
    color:#efc31c;
    border:0;
    background:#f2f2f2;
  }
  .text-yellow:focus{
    outline:none;
  }
   .my-address{
     width:100%;
     overflow-y: auto;
     overflow-x:hidden;
     
   }
   .my-addr{
     width:100%;
     background-color:#f2f2f2;
   }
   .my-addr-wrap{
     width:90%;
     margin:0 auto;
     padding-top:1em;
   }
   .my-addr-list{
     padding:1em 2em;
     margin:0 0 1em 0;
     background-color:#fff;
     border-radius:0.5em;
   }
   
   .my-addr-info{
     display:flex;
   }
   .my-addr-name,
   .my-addr-tel{
     flex:1;
   }
   .my-addr-tel{
     text-align:right;
   }
   .my-addr-addr{
     margin-top:0.5em;
   }
   @media (min-width:768px){
     .my-address{
      background-color:#333;
     }
     .my-addr{
       width:75%;
       margin:0 auto;
     }
     .my-addr-wrap{
       width:65%;
     }
   }
    
</style>