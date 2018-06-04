<template>
<div class='bankS'>
  <div class='bankS-content' v-if="!bankInfo || bankInfo.length == 0">
    <div class='bankS-head'>
      请绑定持卡人本人的银行卡
    </div>
    <div class='bankS-msg'>
      <div class='bankS-user-name'>
        <p>持卡人</p>
        <input required class='bankS-user-input' v-model='formData.cardUser' type='text' placeholder='持卡人本人姓名' />
      </div>
      <div class='bankS-number'>
        <p>卡&nbsp;&nbsp;&nbsp;号</p>
        <input required class='bankS-user-input' v-model='formData.cardId' type='text' placeholder='无需网银/免手续费' />
      </div>
      <div class='bankS-number'>
        <p>手机号</p>
        <input required class='bankS-user-input' v-model='formData.cardPhone' type='text' placeholder='银行预留手机号' />
        <!--<p class='bankF-code-btn' @click='getCode'>获取验证码</p>-->
      </div>
      <!-- <div class='bankS-number'>
                    <p>验证码</p>
                    <input required class='bankS-user-input' v-model='formData.cardCode' type='text' placeholder='短信验证码'/>

                </div>-->
    </div>
    <div class='bankS-next-btn'>
      <a class='bankS-to-fin bankS-yellow' @click='sureBand'>完成</a>
    </div>
  </div>
  <div class='bankS-else' v-if="bankInfo && bankInfo.length > 0">
    <p class='bankS-else-wrap'>
      <span>您有已绑定的银行卡！</span><span class='text-color' @click='goMyBank'>查看</span>
    </p>
  </div>
  <transition name='isSureBand'>
    <diV v-if='isSureBandM' class='mask sureBand' ref='sureBand' @click='closeSureBand'>
      <div class='sureBand-box'>
        <p class='sureBand-sure'>确定绑定吗？</p>
        <p class='sureBand-chose'>
          <span class='sureBand-no' @click='cancelBand'>取消</span>
          <span class='sureBand-yes' @click='bankFirst'>确定</span>
        </p>
      </div>
    </diV>
  </transition>
  <transition name='isSureBand'>
    <diV v-if='goBankSuc' class='mask' ref='sureBand' @click='goBank'>
      <div class='sureBand-box'>
        <p class='sureBand-sure'>绑定成功！</p>
        <!-- <p class='sureBand-go'>
                        <a class='sureBand-yes' href='javascript:' @click='goBank'>确定</a>
                    </p>-->
      </div>
    </diV>
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
export default {
  data() {
    return {
      isSureBandM: false,
      goBankSuc: false,
      formData: {
        cardUser: '',
        cardId: '',
        cardPhone: '',
        cardCode: ''
      },
      bankInfo: [],
    }
  },
  created() {
    this.bankInfo = storage.get('bankInfo');
    //window.shopID = Number(sessionStorage.get('shopID'));
  },
  mounted() {
    $('title').html('车猫掌柜-我的银行卡');
  },
  methods: {
    // 去往我的银行卡
    goMyBank() {
      this.$router.replace({
        name: 'bank',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    // 确认绑定
    sureBand() {
      var formData = this.formData; // || formData.cardCode == ""
      if (formData.cardUser == "" || formData.cardId == "" || formData.cardPhone == "") {
        alert('请输入完整信息！')
      } else {
        this.isSureBandM = true;
      }
    },
    // 短信验证 获取sid
    getSidSuc(data) {
      // console.log(data);
      this.invokeSettime('.bankF-code-btn');
    },
    getSid() {
      WARequest({
        method: 'POST',
        data: {
          phone: this.formData.cardPhone,
          type: 1,
          hashCode: this.hashCode
        },
        // url:'http://192.168.31.14:8089/code/sms',
        url: '/codes/code/sms',
        done: this.getSidSuc,
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
    // 短信验证 获取hashCode
    getCodeSuc(data) {
      this.hashCode = data.hashCode;
      this.getSid();
    },
    getCode() {
      var formData = this.formData;
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (formData.cardPhone == '') {
        alert('请输入手机号！')
      } else if (!myreg.test(formData.cardPhone)) {
        alert('请输入正确的手机号！');
      } else {
        WARequest({
          method: 'GET',
          data: {
            phone: formData.cardPhone,
            type: 1
          },
          url: '/codes/code/hash',
          done: this.getCodeSuc,
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

    },
    // 绑定完成
    goBank() {
      this.$router.push({
        name: 'bank',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    },
    // 开始绑定银行卡
    bankFirst() {
      var formData = this.formData;
      const info = loginInfo();
      WARequest({
        method: 'POST',
        data: {
          userId: info['user'].id,
          shopId: window.shopID || '',
          bankCard: formData.cardId,
          bankPhone: formData.cardPhone,
          bankUsername: formData.cardUser,
          phone: formData.cardPhone
        },
        // url:'http://192.168.31.14:8089/shopaccount/addcard/',
        url: '/shops/shopaccount/addcard/',
        done: (data) => {
          this.goBankSuc = !this.goBankSuc;
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
    closeSureBand() {
      this.isSureBandM = false
    },
    cancelBand(e) {
      if (e.target == this.$refs.sureBand) {
        this.isSureBandM = false
      }

    },
    // 验证时间
    invokeSettime(obj) {   
      var countdown = 60;   
      settime(obj);   
      function settime(obj) {       
        if (countdown == 0) {           
          $(obj).attr("disabled", false);           
          $(obj).text("获取验证码");           
          countdown = 60;           
          return;       
        } else {           
          $(obj).attr("disabled", true);           
          $(obj).text("(" + countdown + ") s重新发送");           
          countdown--;       
        }       
        setTimeout(function() {                   
          settime(obj)
        }               , 1000)   
      }
    },
  },

}
</script>
<style>
.bankS-else {
  width: 100%;
  height: 100%;
  background-color: #fff;

  text-align: center;
  color: #999;
}

.bankS-else-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media (min-width:768px) {
  .bankS-else {
    width: 75%;
    margin: 0 auto;
  }
}

.text-color {
  color: #ffc700;
}

.sureBand {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sureBand-box {
  width: 72%;
  padding: 2em 1em;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 0.8em;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sureBand-sure {
  text-align: center;
  padding-bottom: 1em;
  font-size: 1.2em;
}

.sureBand-chose {
  width: 75%;
  margin: 0 auto;
}

.sureBand-go {
  text-align: center;
}

.sureBand-yes,
.sureBand-no {
  width: 60px;
  height: 30px;
  border-radius: 0.3em;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  color: #fff;
  margin-left: 0.5em;
  border: 0;
}

.sureBand-yes {
  background-color: #ffc700;
}

.sureBand-no {
  background-color: #ddd;
}

.isSureBand-enter-active {
  animation: fadeIn 0.3s;
}

.isSureBand-enter-active .sureBand {
  animation: fadeInUp 0.3s;
}

.isSureBand-leave-active {
  animation: fadeIn 0.3s reverse;
}

.isSureBand-leave-active .sureBand {
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

.bankF-code-btn {
  color: #ffc700;
  text-align: right;
}

.bankS {
  width: 100%;
}

.bankS-content {
  width: 100%;
  padding: 1em 0;
  box-sizing: border-box;
}

.bankS-head {
  text-align: center;
  color: #999;
  margin-bottom: 1em;
}

.bankS-msg {
  width: 100%;
  background: #fff;
  padding: 0 1em;
  box-sizing: border-box;
}

.bankS-user-name {
  border-bottom: 1px solid #f2f2f2;
  height: 2.4em;
  padding: 0.5em 0;
  display: flex;
  align-items: center;
}

.bankS-number {
  padding: 0.5em 0;
  display: flex;
}

.bankS-user-input {
  border: 0;
  margin-left: 1em;
  width: 198px;
}

.bankS-user-input:focus {
  outline: none;
}

.bankS-next-btn {
  margin-top: 2em;
  width: 100%;
  text-align: center;
}

.bankS-to-fin {
  display: block;
  width: 80%;
  line-height: 2.8em;
  color: #fff;
  background-color: #999;
  border-radius: 1.4em;
  margin: 0 auto
}

.bankS-next-btn .bankS-yellow {
  color: #fff;
  background-color: #ffc700;
}

@media (min-width:768px) {
  .bankS {
    background-color: #333;
  }
  .bankS-content {
    width: 75%;
    height: 100%;
    margin: 0 auto;
    background-color: #f2f2f2;
  }
  .bankS-user-name,
  .bankS-number {
    padding: 1em 0;
  }

}
</style>
