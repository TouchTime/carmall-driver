<template>
<div class='waddress'>
  <div class='waddress-content'>
    <div class='wad-form'>
      <div class='wad-group'>
        <label><span class='wad-form-text'>收&nbsp; 货&nbsp; 人</span>
                    <input class='wad-form-input' v-model='adUser' type='text' /></label>
      </div>
      <div class='wad-group'>
        <label><span class='wad-form-text'>联系电话</span>
                    <input class='wad-form-input' v-model='adTel' type='text' /></label>
      </div>
      <!-- <div class='wad-group'>
                    <label><span class='wad-form-text'>所在省份</span>
                    <input class='wad-form-input' v-model='adProvince' /></label>
                </div>
                <div class='wad-group'>
                    <label><span class='wad-form-text'>所在城市</span>
                    <input class='wad-form-input' v-model='adCity' /></label>
                </div>
                <div class='wad-group'>
                    <label><span class='wad-form-text'>所在地区</span>
                    <input class='wad-form-input' v-model='adArea' /></label>
                </div>
                 -->
      <div class="wad-group">
        <label><span class="wad-form-text">所在地区</span>
          <input class='wad-form-input' type="text" @click.stop="show1 = true" v-model="model1" readonly placeholder="请选择">
          <yd-cityselect v-model="show1" :callback="result1" :items="district"></yd-cityselect>
        </label>
      </div>
      <div class='wad-group'>
          <label><span class='wad-form-text'>街&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;道</span>
          <input class='wad-form-input' v-model='adStreet' /></label>
      </div>
      <div class='wad-group'>
        <textarea class='wad-form-textarea' v-model='asDetail' placeholder='请填写详细地址，不少于5个字'></textarea>
      </div>

    </div>
    <div class='wad-btn'>
      <div class='wad-btn-content'>
        <p><span class='wad-btn-save' @click='saveAddress()'>保存</span></p>
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
import District from 'ydui-district/dist/jd_province_city_area_id';
import {
  WARequest,
  loginInfo,
  storage
} from '../util.js'
export default {
  data() {
    return {
      adUser: '', //收货人
      adTel: '', //联系电话
      adProvince: '', //所在省份
      adCity: '', //所在城市
      adArea: '', //所在地区
      adStreet: '', //街道
      asDetail: '', //详细地址
      isSave: false,
      show1: false,
      model1: '',
      district: District

    }
  },
  created() {

  },
  methods: {
    // 保存地址
    saveAddress() {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (this.adUser == '' || this.adTel == '' || this.adProvince == '' || this.adCity == '' || this.adArea == '' || this.adStreet == '' || this.asDetail == '') {
        alert('请填写完整信息！')
      } else if (!myreg.test(this.adTel)) {
        alert('请输入正确的手机号！')
      } else {
        this.addressData();
      }
    },
    // 数据接口
    addressData() {
      const info = loginInfo();
      WARequest({
        method: 'POST',
        data: {
          userId: info['user'].id,
          customerName: this.adUser,
          mobile: this.adTel,
          province: this.adProvince,
          city: this.adCity,
          district: this.adArea,
          street: this.adStreet,
          address: this.asDetail
        },
        url: '/shops/shopadress/addorupdateaddress/',
        done: this.addressSuc,
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
    addressSuc(data) {
      this.isSave = !this.isSave;
      storage.set('addressForm', data.data);
    },
    // 关闭弹出框
    closeSave() {
      this.isSave = !this.isSave;
      this.$router.replace({
        name: 'myAddress'
      })
    },

    // 取消保存
    gobackSureOrder() {
      this.$router.push({
        name: 'sureOrder'
      })
    },
    result1(ret) {
      console.log(ret);
      this.adProvince = ret.itemName1;
      this.adCity = ret.itemName2;
      this.adArea = ret.itemName3;
      this.model1 = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    }
  },
  mounted() {
    $('title').html('车猫掌柜-收货地址');
  }
}
</script>
<style>
/*父元素*/

.sure-address {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.sure-box {
  width: 72%;
  height: 60px;
  margin: 0 auto;
  border-radius: 0.8em;
  background-color: #fff;
  text-align: center;
  line-height: 60px;
  display: block;
  color: #ffc700;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2)
}

/*address页面内容*/

.waddress-content {
  width: 100%;
  height: 100%;
}

.waddress {
  width: 100%;
}

.wad-form {
  width: 100%;
  box-sizing: border-box;
  padding: 1em 1em 0 1em;
  background-color: #fff;
}

.wad-group {
  margin: 1em 0;
  border-bottom: 1px solid #f2f2f2;
}

.wad-group:last-child {
  border: 0;
}

.wad-group>label {
  display: flex;
}

.wad-form-text {
  display: inline-block;
  flex: 1;
  line-height: 30px;
  text-indent: 0.5em;
}

.wad-form-input {
  border: 0;
  flex: 3;
  height: 30px;
  text-indent: 0.5em;
}

.wad-form-input:focus {
  outline: none;
}

.wad-form-textarea {
  width: 100%;
  margin: 0 auto;
  resize: none;
  border: 0;
  height: 70px;
  text-indent: 0.5em;
  padding: 0.3em 0;
}

.wad-form-textarea:focus {
  outline: 0;
}

.wad-btn {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em 1em 0 1em;
}

.wad-btn-save,
.wad-btn-cancel {
  width: 95%;
  height: 35px;
  border-radius: 0.3em;
  text-align: center;
  display: block;
  line-height: 35px;
  margin: 0 auto;
}

.wad-btn-save {
  color: #fff;
  background-color: #ffc700;
  border: 1px solid #ffc700;
}

.wad-btn-cancel {
  color: #ffc700;
  border: 1px solid #ffc700;
  background-color: #f2f2f2;
  margin-top: 0.8em;
}

.sureAddress-enter-active {
  animation: fadeIn 0.3s;
}

.sureAddress-enter-active .sureAddress {
  animation: fadeInUp 0.3s;
}

.sureAddress-leave-active {
  animation: fadeIn 0.3s reverse;
}

.sureAddress-leave-active .sureAddress {
  animation: fadeInUp 0.3s reverse;
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
  .waddress {
    background-color: #333;
  }
  .waddress-content {
    width: 75%;
    margin: 0 auto;
    background: #f2f2f2;
  }
  .wad-form {
    padding: 1em 2em 0 2em;
  }
  .wad-btn {
    padding: 0.5em 2em 0 2em;
  }
  .wad-btn-save,
  .wad-btn-cancel {
    width: 65%;
  }
}
</style>
