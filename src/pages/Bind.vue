<template>
<div class='index-page'>
	<div class='index-content'>
		<h4 class='index-title'>绑定手机号，方便追踪订单</h4>
		<div class='index-form'>
			<div class='index-form-group'>
				<label class='index-form-label'>
            <div class='index-form-icon'><img class='index-form-phone' src='../assets/phone.png' /></div>
            <div class='index-form-rt'>
                <input class='index-form-input' v-model='formdata.phone' type='text' placeholder='填写手机号' />
                <span :class="{'index-form-yz':true,'disable':codeBtnText != '获取验证码'}" @click="getCode">{{codeBtnText}}</span>
            </div>
          </label>
			</div>
			<div class='index-form-group'>
				<label class='index-form-label'>
            <div class='index-form-icon'><img class='index-form-code' src='../assets/code.png' /></div>
            <div class='index-form-rt'>
              <input class='index-form-input' v-model='formdata.smsCode' type='text' placeholder='验证码' />
            </div>
          </label>
			</div>
			<div class='index-form-group'>
				<span class='index-sure-btn' @click="goStatistics">确定</span>
			</div>
		</div>
	</div>
</div>
</template>
<script>
const mobileReg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])[0-9]{8}$/;
import {WARequest,loginInfo,storage} from '../util.js';
export default {
	data() {
		return {
			formdata: {
				phone: '',
				smsCode: '',
				sid: ''
			},
			codeBtnText: '获取验证码'
		}
	},
	methods: {
		getCode() {
			let {phone} = this.formdata;
			if (this.codeBtnText === '获取验证码') {
				if (!mobileReg.test(phone)) {
					alert('请输入正确的手机号码！');
				} else {
					this.countdown();
					WARequest({
						url : '/code/hash',
						data : {
							phone,
							type : 1
						},
						done : (res)=>{
							WARequest({
								url : '/code/sms',
								method : 'POST',
								data : {
									phone,
									type : 1,
									hashCode: res.hashCode
								},
								done : (res)=>{
									this.formdata.sid = res.sid;
								},
								fail : (err)=>{
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
						fail : (err)=>{
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
			}
		},
		goStatistics() {
			let {phone,smsCode,sid} = this.formdata;
			let Info = loginInfo();
			if (!mobileReg.test(phone)) {
				alert('请输入正确的手机号码！');
			} else if (!smsCode) {
				alert('请输入验证码！');
			} else {
				WARequest({
					url: '/users/user/bind/phone',
					method: 'POST',
					data: {
						phone,
						smsCode,
						type : Info.user.type,
						id : Info.user.id,
						sid
					},
					done : (res)=>{
						let oldInfo = storage.get('loginInfo');
						oldInfo.user = res.data;
						storage.set('loginInfo',oldInfo);
						this.$router.replace({
							name: 'apply',
							query: {
								timestamp: (new Date()).getTime()
							}
						})
					},
					fail : (err)=>{
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
				});
			}
		},
		goHome() {
			this.$router.push({
				name: 'statistics',
				query: {
					timestamp: (new Date()).getTime()
				}
			})
		},
		countdown() {
			let sec = 60;
			this.timer = setInterval(() => {
				if (sec >= 1) {
					sec--;
					this.codeBtnText = `${sec}s后重发`;
				} else {
					clearInterval(this.timer);
					this.codeBtnText = '获取验证码';
				}
			}, 1000);
		}
	},
	mounted() {
		$('title').text('车猫小店');
	},
	destroyed() {
		clearInterval(this.timer);
	}
}
</script>
<style >
.index-page {
	width: 100%;
}

.index-content {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 1em;
	background-color: #fff;
}

.index-title {
	text-align: center;
	margin-bottom: 1em;
}

.index-form {
	width: 90%;
	margin: 0 auto;
}

.index-form-group {
	border-bottom: 1px solid #f2f2f2;

}

.index-form-label {
	display: flex;
	box-sizing: border-box;
}

.index-form-group:last-child {
	border: 0;
}

.index-form-icon {
	flex: 1;
	text-align: center;
}

.index-form-icon:after {
	display: inline-block;
	width: 0;
	height: 100%;
	vertical-align: middle;
	content: 'center';
	overflow: hidden;
}

.index-form-phone {
	width: 37%;
	display: inline-block;
	vertical-align: middle;
}

.index-form-code {
	width: 50%;
	display: inline-block;
	vertical-align: middle;
}

.index-form-yz {
	color: #ffc700;
	float: right;
	line-height: 2.6em;
}

.index-form-yz.disable {
	color: #999;
}

.index-form-rt {
	flex: 5;
	overflow: hidden;
}

.index-form-input {
	border: 0;
	height: 35px;
	width: 57%;
}

.index-form-input:focus {
	outline: none;
}

.index-sure-btn {
	display: block;
	padding: 0 0.5em;
	height: 35px;
	line-height: 35px;
	border-radius: 2em;
	text-align: center;
	margin-top: 2em;
	background-color: #ffc700;
}

@media (min-width:768px) {
	.index-page {
		background-color: #333;
	}
	.index-content {
		width: 75%;
		margin: 0 auto;
	}
	.index-form {
		width: 75%;
	}
	.index-form-phone {
		width: 30%;
	}
	.index-form-code {
		width: 40%;
	}
}
</style>
