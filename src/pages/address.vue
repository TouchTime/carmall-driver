<template>
    <div class='address'>
        <div class='address-content'>
            <div class='ad-form'>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>收&nbsp; 货&nbsp; 人</span>
                    <input class='ad-form-input' v-model='adUser' type='text' /></label>
                </div>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>联系电话</span>
                    <input class='ad-form-input' v-model='adTel' type='text' /></label>
                </div>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>所在省份</span>
                    <input class='ad-form-input' v-model='adProvince' /></label>
                </div>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>所在城市</span>
                    <input class='ad-form-input' v-model='adCity' /></label>
                </div>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>所在地区</span>
                    <input class='ad-form-input' v-model='adArea' /></label>
                </div>
                <div class='ad-group'>
                    <label><span class='ad-form-text'>街&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;道</span>
                    <input class='ad-form-input' v-model='adStreet' /></label>
                </div>
                <div class='ad-group'>
                    <textarea class='ad-form-textarea' v-model='asDetail' placeholder='请填写详细地址，不少于5个字'></textarea>
                </div>
            </div>
            <div class='ad-btn'>
                <div class='ad-btn-content'>
                    <p><span class='ad-btn-save' @click='saveBtnClick()'>保存</span></p>
                    <!--<p><span class='ad-btn-cancel' @click='gobackSureOrder'>取消</span></p>-->
                </div>
            </div>
            <transition name='sureAddress'>
                <div class='mask sure-address' v-if='isSave' @click='closeSave'>
                    <div class='sure-box'>
                        <span>保存成功！</span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import {WARequest,loginInfo,storage} from '../util.js'
    export default {
        data (){
            return {
                adUser:'',//收货人
                adTel:'',//联系电话
                adProvince:'',//所在省份
                adCity:'',//所在城市
                adArea:'',//所在地区
                adStreet:'',//街道
                asDetail:'',//详细地址
                isSave:false,
            }
        },
        created (){

        },
        methods:{
            // 数据接口
            addressData (){
                const info = loginInfo();
                WARequest({
                    method:'POST',
                    data:{
                        userId:info['user'].id,
                        customerName:this.adUser,
                        mobile:this.adTel,
                        province:this.adProvince,
                        city:this.adCity,
                        district:this.adArea,
                        street:this.adStreet,
                        address:this.asDetail
                    },
                    url:'/shops/shopadress/addorupdateaddress/',
                    // url:'http://192.168.31.14:8089/shopadress/addorupdateaddress/',
                    done:this.addressSuc,
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
            addressSuc (data){
                this.isSave = !this.isSave;
                // console.log(data)
               storage.set('addressForm',data.data);
            },
            // 关闭弹出框
            closeSave (){
                this.isSave = !this.isSave;
                this.$router.push({
                    name:'sureOrder'
                })
            },
            // click保存   model
            saveBtnClick (){
                if(this.adUser == '' || this.adTel == '' || this.adProvince == '' || this.adCity == '' || this.adArea == '' || this.adStreet == ''){
                    alert('请填写完整信息！')
                }else{
                    this.addressData();
                }

            },
            // 取消保存
            gobackSureOrder (){
                this.$router.push({
                    name:'sureOrder'
                })
            }
        },
        mounted (){
             $('title').html('车猫掌柜-收货地址');
        }
    }
</script>
<style>
    /*父元素*/
    .sure-address{
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:99;
    }
    .sure-box{
        width:72%;
        height:60px;
        margin:0 auto;
        border-radius:0.8em;
        background-color:#fff;
        text-align:center;
        line-height:60px;
        display:block;
        color:#ffc700;
        box-sizing:border-box;
        box-shadow:0 0 4px rgba(0,0,0,0.2)
    }
    /*address页面内容*/
    .address-content{width:100%;height:100%;}
    .address{
        width:100%;
    }
    .ad-form{
        width:100%;
        box-sizing:border-box;
        padding: 1em 1em 0 1em;
        background-color:#fff;
    }

    .ad-group{
        margin:1em 0;
        border-bottom: 1px solid #f2f2f2;
    }
    .ad-group:last-child{
        border:0;
    }
    .ad-group>label{
        display:flex;
    }
    .ad-form-text{
        display:inline-block;
        flex:1;
        line-height: 30px;
        text-indent:0.5em;
    }
    .ad-form-input{
        border:0;
        flex:3;
        height:30px;
        text-indent:0.5em;
    }
    .ad-form-input:focus{
        outline:none;
    }
    .ad-form-textarea{
        width: 100%;
        margin: 0 auto;
        resize: none;
        border: 0;
        height:70px;
        text-indent:0.5em;
        padding:0.3em 0;
    }
    .ad-form-textarea:focus{
        outline:0;
    }
    .ad-btn{
        width:100%;
        box-sizing:border-box;
        padding: 0.5em 1em 0 1em;
    }

    .ad-btn-save,
    .ad-btn-cancel{
        width:95%;
        height:35px;
        border-radius:0.3em;
        text-align:center;
        display:block;
        line-height:35px;
        margin:0 auto;
    }
    .ad-btn-save{
        color:#fff;
        background-color:#ffc700;
        border:1px solid #ffc700;
    }
    .ad-btn-cancel{
        color:#ffc700;
        border:1px solid #ffc700;
        background-color:#f2f2f2;
        margin-top:0.8em;
    }
    .sureAddress-enter-active{
        animation:fadeIn 0.3s;
    }
    .sureAddress-enter-active .sureAddress{
        animation:fadeInUp 0.3s;
    }
    .sureAddress-leave-active{
        animation:fadeIn 0.3s reverse;
    }
    .sureAddress-leave-active .sureAddress{
        animation:fadeInUp 0.3s reverse;
    }
    @keyframes fadeIn {
        0%{
            opacity:0;
        }
        100%{
            opacity:1;
        }
    }
    @keyframes fadeInUp {
        0%{
            opacity:0;
            transform:translate3d(0,100%,0);
        }
        100%{
            opacity:1;
            transform:none;
        }
    }
    @keyframes zoomIn {
        0%{
            opacity:0;
            transform:scale3d(0.3,0.3,1);
        }
        100%{
            opacity:1;
            transform:none;
        }
    }
    @media (min-width:768px){
        .address{background-color:#333;}
        .address-content{
            width: 75%;
            margin: 0 auto;
            background: #f2f2f2;
        }
        .ad-form{
            padding:1em 2em 0 2em;
        }
        .ad-btn{padding: 0.5em 2em 0 2em;}
        .ad-btn-save, .ad-btn-cancel{width:65%;}
    }
</style>
