<template>
<div class='pwd'>
  <div class='pwd-content'>
    <div class='pwd-form'>
      <div class='pwd-form-group'>
        <p class='pwd-form-icon pw-sj'></p>
        <p><input required class='pwd-form-input' type='text' placeholder='填写手机号' /></p>
        <p class='pwd-code-par'><a class='pwd-get-code'>获取验证码</a></p>
      </div>
      <div class='pwd-form-group'>
        <p class='pwd-form-icon pw-yzm'></p>
        <p><input required class='pwd-form-input' type='text' placeholder='6位验证码' /></p>
      </div>
      <div class='pwd-form-group'>
        <p class='pwd-form-icon pw-password'></p>
        <p><input required class='pwd-form-input' type='password' placeholder='输入密码' /></p>
      </div>
      <div class='pwd-form-group'>
        <p class='pwd-form-icon pw-mm'></p>
        <p><input required class='pwd-form-input' type='password' placeholder='输入密码' /></p>
      </div>
      <div class='pwd-form-group'>
        <p class='pwd-form-icon pw-dui'></p>
        <p><small style='line-height:2.5em;color:#999'>已阅读并同意用户协议</small></p>
      </div>
    </div>
    <div class='pwd-sure-btn'>
      <a class='pwd-click' @click='isShowSuccessModel = !isShowSuccessModel'>确定</a>
    </div>
  </div>
  <transition name='amendPwd'>
    <div v-if='isShowSuccessModel' @click='goMe' class='mask amend'>
      <div class='amend-box'>
        <p>设置成功！</p>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
export default {
  data() {
    return {
      isShowSuccessModel: false
    }
  },
  methods: {
    goMe() {
      this.$router.push({
        name: 'my',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    }
  },
  mounted() {
    $('title').html('车猫掌柜-修改密码');
  }
}
</script>
<style>
.pwd-form-group .pw-yzm {
  background-image: url('../assets/code.png');
  background-size: 73%;
}

.pw-password {
  background-image: url('../assets/password.png');
}

.pw-mm {
  background-image: url('../assets/password.png');
}

.pw-dui {
  background-image: url('../assets/agree.png');
}

.amend {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}

.amend-box {
  width: 72%;
  padding: 2em 1em;
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
  border-radius: 0.8em;
  font-size: 1.2em;
  color: #ffc700;
}

.pwd-content {
  width: 100%;
  background-color: #fff;
  height: 100%;
}

.pwd-form {
  width: 90%;
  margin: 0 auto;
  padding-top: 2em;
}

.pwd-form-group {
  // display:flex;
  padding: 0.2em 0;
  margin: 0 1em;
  overflow: hidden;
  border-bottom: 1px solid #f2f2f2;
}

.pwd-form-group>p {
  // flex:1;
  float: left
}

.pwd-form-group .pwd-code-par {
  float: right;
}

.pwd-form-icon {
  width: 2em;
  height: 2em;
  background-size: 66%;
  background-position: center;
  background-repeat: no-repeat;
}

.pwd-form-input {
  border: 0;
  height: 2em;
  margin-left: 0.5em;
}

.pwd-form-input:focus {
  outline: none;
}

.pwd-get-code {
  color: #ffc700;
  line-height: 2em;
  text-align: right;
}

.pwd-sure-btn {
  width: 100%;
  margin-top: 1em;
}

.pwd-click {
  width: 80%;
  border: 1px solid #ffc700;
  border-radius: 1.2em;
  color: #ffc700;
  text-align: center;
  height: 30px;
  line-height: 30px;
  display: block;
  margin: 0 auto;
}

.pwd-form-group .pw-sj {
  background-image: url('../assets/phone.png');
  background-size: 58%;
}

.amendPwd-enter-active {
  animation: fadeIn 0.3s;
}

.amendPwd-enter-active .amend-box {
  animation: fadeInUp 0.3s;
}

.amendPwd-leave-active {
  animation: fadeIn 0.3s reverse;
}

.amendPwd-leave-active .amend-box {
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
    transform: translate3d(0, 100, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@media (min-width:768px) {
  .pwd {
    background-color: #333;
  }
  .pwd-content {
    width: 75%;
    margin: 0 auto;
  }
  .pwd-click {
    width: 50%;
  }
}
</style>
