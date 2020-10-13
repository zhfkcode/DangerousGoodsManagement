<template>
  <div class="login-box">
    <div class="form">
      <h2 class="lg-title">工厂危险化学品安全监测预警系统</h2>
      <div class="item">
        <label class="label">请输入密码：</label>
        <el-input v-model="psd" type="password" placeholder="请输入密码"></el-input>
      </div>
      <div class="submit">
        <el-button @click.native="Login" type="primary" round class="btn" :loading="loading">登录</el-button>
      </div>
    </div>
    <canvas id="canv" width="1920" height="572" class="canvas"></canvas>
  </div>
</template>
<script>
let _ = require('lodash')
import canDraw from '../utils/canvas'
import {accountLogin} from '../request/device'
export default {
  data() {
    return {
      psd: '',
      loading: false
    }
  },
  created(){

  },
  mounted(){
    this.$nextTick(()=>canDraw())
    //  window.onresize = _.debounce(() => {
    //   }, 400)
  },
  methods:{
    Login() {
      if(!this.psd){
        this.$message.error('请填写密码')
        return false
      }
      if(this.loading){return false}
      this.loading = true;
      accountLogin({password:this.psd}).then(res=>{
        sessionStorage.setItem('hasLogin','hasLogin')
        this.$router.push('/')
      }).catch(err=>{
        this.loading = false
      })
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: -webkit-radial-gradient(ellipse farthest-corner at center center, #1b44e4 0%, #020f3a 100%);
  background-image: radial-gradient(ellipse farthest-corner at center center, #1b44e4 0%, #020f3a 100%);
  .form {
    width: 500px;
    min-height: 350px;
    color: #fff;
    position: relative;
    z-index: 5;
    .lg-title {
      font-size: 20px;
      margin-bottom: 50px;
      text-align: center;
    }
    .label {
      display: inline-block;
      margin-right: 15px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .submit {
      margin-top:30px;
      font-size: 16px;
      text-align: center;
    }
    .btn{
      width: 100%;
    }
  }
  .canvas{position: absolute; width:100%; left: 0; top: 0; height: 99%; z-index: 1;}
}
</style>