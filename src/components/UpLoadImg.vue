<template>
  <div class="upload-item" :style="'background-image:url('+photoUrl+')'">
		<span v-if="!photoUrl">{{ isLoading ? '上传中' : pht}}</span>
  	<input @click="clearInput" @change="UpLoad" type="file" name="file" value="" accept="image/*">
  </div>
</template>

<script>
import {loginInfo,WARequest} from '../util.js';
export default {
	props: ['pht','field'],
	data(){
		return {
			photoUrl : '',
			isLoading : false
		}
	},
	methods:{
    clearInput(e){
      e.target.value = '';
      this.isLoading = false;
    },
		UpLoad(e){
      const Info = loginInfo();
			const file = e.target.files[0];
      if (!/image\/\w+/.test(file.type)) {
           alert("只能选择图片");
           return false;
      }
      this.isLoading = true;
      WARequest({
        url : `/systems/systemFile/getossinfo`,
        done :(res)=>{
          let ossClient = new OSS.Wrapper({
            region: 'oss-cn-hangzhou',
            accessKeyId: res.ossKey,
            accessKeySecret: res.ossSecret,
            bucket: res.ossBucketName
          });
          ossClient.multipartUpload(`cartmall/img/${(new Date()).getTime()+file.name}`,file).then((data)=>{
            this.photoUrl = data.res.requestUrls[0].split('?')[0];
            this.$emit('complete',{
              url  : data.res.requestUrls[0].split('?')[0],
              name : this.field
            });
            this.isLoading = false;
          }).catch((err)=>{
            this.isLoading = false;
            this.photoUrl = 'https://cartmall.oss-cn-hangzhou.aliyuncs.com/img/need2record.jpg'
            this.$emit('complete',{
              url  : 'https://cartmall.oss-cn-hangzhou.aliyuncs.com/img/need2record.jpg',
              name : this.field
            });
            // alert('上传图片失败！');
          })
        },
        fail : (err)=>{
          alert('oss信息获取失败！');
        }
      });
		}
	}
}
</script>

<style>
.upload-item{
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}
.upload-item input{
	position: absolute;
	top: 0;
	left: 0;
	width: 100% !important;
	height: 100% !important;
	opacity: 0;
	z-index: 2;
}
</style>
