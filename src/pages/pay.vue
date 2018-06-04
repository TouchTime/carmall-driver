<template>
<div class='pay-success'>
  <div class='pay-s-content'>
    <p class='pay-s-icon'></p>
    <p class='pay-s-text'>
      <h3>支付成功！</h3>
    </p>
    <p><span class='pay-s-again' @click="goHome">再来一单</span></p>
    <p><span class='pay-s-fx' @click='isShare = true'>分享好友</span></p>
  </div>
  <transition name="showDetails">
    <div v-if="isShare" class="mask share" @click="isShare = false">
      <div class="details-box">
        <img class='shareImg' :src='shareArrows' />
        <p class='sta-text-yellow'>点击右上角图标进行推荐</p>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
import {
  storage
} from '../util.js'
import shareArrows from '../assets/share-arrows.png'
export default {
  data() {
    return {
      shareArrows,
      isShare: false,
    }
  },
  created() {
    storage.delete('driverBH');
  },
  methods: {
    // 再来一单
    goHome() {
      this.$router.push({
        name: 'statistics',
        query: {
          timestamp: (new Date()).getTime()
        }
      })
    }
  },
  mounted() {
    $('title').html('车猫掌柜-支付');
  }
}
</script>
<style>
.pay-success {
  width: 100%;
  background-color: #fff;
}

.pay-s-content {
  width: 90%;
  padding-top: 3em;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}

.pay-s-icon {
  width: 5em;
  height: 5em;
  margin: 0 auto;
  background: url('../assets/success.png') no-repeat 50% 50% / 100%;
}

.pay-s-again {
  width: 12em;
  text-align: center;
  padding: 0.3em 0;
  border-radius: 1em;
  color: #fff;
  display: inline-block;
  background: #ffc700;
}

.pay-s-fx {
  width: 12em;
  padding: 0.2em 0;
  margin-top: 0.5em;
  color: #ffc700;
  display: inline-block;
  background-color: #fff;
  border-radius: 1em;
  border: 0.0625em solid #ffc700;
}

@media (min-width:768px) {
  .pay-success {
    background-color: #333;
  }
  .pay-s-content {
    width: 75%;
    background-color: #fff;
  }
  .pay-s-icon {
    width: 6em;
    height: 6em;
  }
  .pay-s-again,
  .pay-s-fx {
    width: 15em;
    padding: 0.4em 0;
  }
}
</style>
