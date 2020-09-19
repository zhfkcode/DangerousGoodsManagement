<template>
  <div class="main-app">
    <p-header></p-header>
     <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </div>
</template>
<script>
import PHeader from '../components/public/header'
export default {
  name: 'AppMain',
  components: {PHeader},
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss" scoped>
.main-app {
  /*50 = navbar  */
  height: 100%;
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #000d4a url(../assets/images/bg.jpg) center top;
  background-size: cover;
  color: #666;
  font-size: 14px;
}
.fixed-header + .app-main {
  padding-top: 152px;
}
</style>