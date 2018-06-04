<template>
<div class="apply-page">
	<div v-if="!isAudit" class="apply-inner">
		<div class="form-header">
			<h3>店铺申请</h3>
			<p>我们将严格保密您的信息</p>
		</div>
		<form @submit.prevent="handleSubmit">
			<div class="form-group border">
				<label for="realname">真实名字</label>
				<input type="text" id="realname" v-model.trim="formData.realname" name="realname" autocomplete="off" placeholder="">
			</div>
			<div class="form-group border">
				<label for="idCard">身份证号</label>
				<input type="text" id="idCard" v-model.trim="formData.idCard" name="idCard" autocomplete="off" placeholder="">
			</div>
			<div class="form-group border">
				<label for="driverNo">车牌号</label>
				<input type="text" id="driverNo" v-model.trim="formData.driverNo" name="driverNo" autocomplete="off" placeholder="">
			</div>
			<div class="form-group border">
				<label for="carGenre">网约车类型</label>
				<select @change="carType" name="carType">
					<option v-for="(item,index) in carTypeList" :key="item.id" :value="item.id">{{item.name}}</option>
				</select>
			</div>
			<div class="form-group">
				<label>网约车证明</label>
				<div class="idcard-photos">
					<div class="idp-col">
						<up-load pht="+网约车证明" @complete="updateUrl" field="onlineCarUrl" />
					</div>
					<div class="idp-col och" @click="showPhoto">示例照片</div>
				</div>
			</div>
			<div class="form-submit-bar"><input type="submit" name="submit" value="提交认证" /></div>
		</form>
	</div>
	<div v-else class="apply-hint">
		<p>您已经提交了申请，正在审核中...</p>
		<p>请耐心等待！</p>
	</div>
</div>
</template>

<script>
const idCardReg = /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/;
import UpLoad from '../components/UploadImg.vue';
import OCH from '../assets/och.png';

import { WARequest,loginInfo ,previewImage,sessionStorage} from '../util.js';

export default {
	components: { UpLoad },
	data() {
		return {
			isAudit: false,
			carTypeList : [],
			formData: {
				realname: '',
				idCard: '',
				driverNo: '',
				onlineCarType:'',
				onlineCarTypeDesc:'',
				onlineCarUrl: '',
				inviteUid:''
			}
		}
	},
	created() {
		let info = loginInfo();
		let referrerID = sessionStorage.get('referrerID');
		this.formData.inviteUid = referrerID || '';
		if(info){
			WARequest({
				url: `/shops/shop/selectapplysellerpage`,
				method: 'POST',
				data: {
					userId: info.user.id,
					status: 0,
					page: 1,
					pageSize: 10
				},
				done: (res) => {
					this.isAudit = res.data.length > 0 ? true : false;
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
			});
		}else{
			//alert('用户信息不正确！');
		}
		this.getCarType();
	},
	mounted (){

	},
	methods: {
		updateUrl(obj) {
			this.formData[obj.name] = obj.url;
		},
		handleSubmit() {
			let {
				realname,
				idCard,
				driverNo,
				onlineCarUrl
			} = this.formData;
			let info = loginInfo();
			if (!realname) {
				alert('请输入您的真实姓名！');
			} else if (!idCardReg.test(idCard)) {
				alert('请输入您正确的身份证号码！');
			} else if (!driverNo) {
				alert('请输入车牌号码！')
			} else if (!onlineCarUrl) {
				alert('请上传网约车证明！')
			} else {
				if(loginInfo){
					WARequest({
						url: `/shops/shop/applybecomeseller`,
						method: 'POST',
						data: Object.assign({}, this.formData, {
							userId: info.user.id
						}),
						done: (res) => {
							this.$router.push({
								name: 'offerMoney',
								query:{
										timestamp:(new Date()).getTime()
								}
							});
						},
						fail: (err) => {
							if(err.responseJSON){
								if (err.responseJSON.error_mesg) {
									alert(err.responseJSON.error_mesg);
								} else if (err.responseJSON.message) {
									//修复了提示错误
									alert(err.responseJSON.message);
								}else if(err.responseJSON.error){
									alert(err.responseJSON.error);
								}
							}else{
								alert('申请失败，请重试！');
							}
						}
					});
				}
			}
		},
		showPhoto(){
			let och = window.location.origin + OCH;
			previewImage({
				current : och,
				urls    : [och]
			})
		},
		getCarType(){
			WARequest({
				url : `/systems/systemCarCompany/find`,
				data: {status : 1},
				done:(res)=>{
					this.carTypeList = res.list;
					this.formData.onlineCarType = res.list[0].id;
					this.formData.onlineCarTypeDesc = res.list[0].name;
				},
				fail:(err)=>{
					console.warn(err);
					if(err.responseJSON){
						if (err.responseJSON.error_mesg) {
							alert(err.responseJSON.error_mesg);
						} else if (err.responseJSON.error) {
							alert(err.responseJSON.error);
						}
					}else{
						alert('获取网约车类型失败！');
					}
				}
			})
		},
		carType(e){
			let currVal = e.target.value;
			this.carTypeList.forEach((item,index)=>{
				if(item.id == currVal){
					this.formData.onlineCarType = item.id;
					this.formData.onlineCarTypeDesc = item.name;
				}
			});
		}
	}
}
</script>

<style>
.apply-page {
	background-color: #fff;
	font-size: 15px;
	overflow-x: hidden;
	overflow-y: auto;
}

.apply-page .apply-inner {
	width: 90%;
	margin: 0 auto;
}

.apply-page .form-header {
	margin: 0 0 1em 0;
}

.apply-page .form-header h3 {
	margin: 1em 0 0 0;
	font-weight: normal;
}

.apply-page .form-group {
	margin: 0.2em 0 1em 0;
}

.apply-page .form-group.border {
	border-bottom: 1px solid #f5f5f5;
}

.apply-page .form-group label {
	display: block;
	color: #999;
}

.apply-page .form-group input {
	width: 100%;
	display: block;
	height: 1.8em;
	outline: none;
	border: 0;
}

.apply-page .form-group select{
	width: 100%;
	display: block;
	height: 1.8em;
	outline: none;
	border: 0;
	background-color: #fff;
	-webkit-appearance:none;
}

.apply-page .form-group .idcard-photos {
	display: flex;
	margin: 0.5em auto;
}

.apply-page .form-group .idcard-photos .idp-col {
	width: 30%;
	height: 4.5em;
	display: flex;
	flex-shrink: 0;
	margin: 0 3% 0 0;
	justify-content: center;
	align-items: center;
	border: 1px solid #f4f4f4;
	color: #ffc700;
	font-size: 85%;
}

.och{
	color: #666 !important;
	font-weight: bold;
	background: url('../assets/och.png') no-repeat 50% 50% / cover;
}

.apply-page .form-submit-bar {
	text-align: center;
	margin: 2em 0 3em 0;
}

.apply-page .form-submit-bar input {
	background-color: #ffc700;
	height: 2.6em;
	border-radius: 1.3em;
	width: 100%;
	outline: none;
	border: 0;
	text-align: center;
}


.apply-page .apply-hint {
	border-top: 4px solid #ffc700;
	padding: 2em 0;
	margin: 2em auto;
	text-align: center;
	background-color: #f0f0f0;
	line-height: 2em;
	font-weight: 400;
}
</style>
