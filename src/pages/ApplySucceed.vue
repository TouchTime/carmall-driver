<template>
<div class='pay-success'>
	<div class='pay-s-content'>
		<p class='pay-s-icon'></p>
		<p class="apply-text">您已申请成功，请勿重复申请!</p>
		<div class="back-home" @click="goHome">返回</div>
	</div>
</div>
</template>
<script>

export default {
	data() {
		return {
		}
	},
	methods: {
		goHome() {
			this.$router.replace({
				name: 'statistics',
				query:{
						timestamp:(new Date()).getTime()
				}
			});
		}
	}
}
</script>
<style>
.apply-text{
	font-size: 1.1em;
	margin: 1.4em 0;
}
.back-home{
	margin: 3em 0 0 0;
	background-color: #ffc700;
  line-height: 2.6em;
  border-radius: 1.3em;
  width: 100%;
  outline: none;
  border: 0;
  text-align: center;
}
</style>
