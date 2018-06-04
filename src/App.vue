<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class='child-view'></router-view>

    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  watch:{
    $route(to,from){
      var inTime = to.query.timestamp || 0;
      var outTime = from.query.timestamp || 0;
      this.transitionName = Number(inTime) < Number(outTime) ? 'slide-right' : 'slide-left';
    }
  }
}
</script>

<style>
  @import './assets/css/base.css';
  #app{
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes zoomIn {
    0%{
      opacity: 0;
      transform: scale3d(0.3,0.3,1);
    }
    100%{
      opacity: 1;
      transform: none;
    }
  }
  @keyframes buycalculator {
    0% {
      transform: translate3d(0, 100%, 0);
    }
    100% {
      transform: none;
    }
  }

  @keyframes stretch {
    0% {
      width: 0;
    }
    100% {
      width: 50%;
    }
  }
</style>
