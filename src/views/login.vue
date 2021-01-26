<template>
  <div class="login-box">
    <img src="../assets/hq-logo.png" alt="logo" class="logo-img">
    <div class="form">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
      <h2 class="lg-title">工业生产安全监测预警系统</h2>
        <el-form-item prop="account">
          <el-input
            :class="loginForm.account ? 'fillword' : ''"
            prefix-icon="el-icon-user"
            v-model="loginForm.account"
            placeholder="请输入用户名"
          />
        </el-form-item>
      <el-form-item prop="password">
        <el-input
          :class="loginForm.account ? 'fillword' : ''"
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          :class="loginForm.code ? 'fillword' : ''"
          prefix-icon="el-icon-key"
          v-model="loginForm.code"
          placeholder="请输入验证码"
          class="code-btn"
        />
        <img :src="codeImg"  class="code-put" @click="changCode">
      </el-form-item>
      <div class="more-op">
        <el-checkbox v-model="remmberPwd">记住密码</el-checkbox>
        <router-link to='/forgetPwd' class="forget">忘记密码</router-link>
      </div>
      <div class="submit">
        <el-button @click="Login" type="primary" class="btn" :loading="loading">登录</el-button>
        <router-link to='/register'>
          <el-button type="success" class="btn">注册</el-button>
        </router-link>
      </div>
      </el-form>
    </div>
    <canvas id="canv" width="1920" height="572" class="canvas"></canvas>
  </div>
</template>
<script>
let _ = require('lodash')
import canDraw from '../utils/canvas'
import {publicLogin} from '../request/device'
import { randomCode } from '../utils/randomCode'
import { log } from 'util'
export default {
  data() {
    const codeReg = (rule,value,callback) => {
        if(value!==this.codeData){
          callback(new Error('验证码错误'))
        }else {
          callback()
        }
    }
    return {
      loginForm: {
      account: '',
      password: '',
      code: ''
      },
      loginRules: {
         account: [{required: true,message: '请输入用户名', trigger: "blur"}],
         password: [{required: true,message: '请输入密码', trigger: "blur"}],
         code: [{required: true,message: '请输入验证码', trigger: "blur"},{validator:codeReg, trigger: 'blur'}],
      },
      loading: false,
      codeImg: '',
      codeData: '',
      remmberPwd: false
    }
  },
  created(){

  },
  mounted(){
    this.$nextTick(()=>canDraw())
    this.getcode()
    const saveData = localStorage.getItem('remeberPwd')
    const isRember = saveData ? JSON.parse(saveData) : {}
    if(isRember) {
      this.loginForm.account = isRember.account
      this.loginForm.password = isRember.password
      this.remmberPwd = true
    }

    //  window.onresize = _.debounce(() => {
    //   }, 400)
  },
  methods:{
    Login() {
      this.$refs.loginForm.validate(valid => {
        if(!valid) {return false}
        if(this.loading){return false}
        this.loading = true;
        const params = {
          grant_type: 'password',
          username: this.loginForm.account,
          password: this.loginForm.password,
        }
        publicLogin(params, {
          Authorization: 'Basic aGVxaW5nQXBpOmhlcWluZzk5OQ=='
        }).then(res=>{
          console.log(res);
          this.remeberChange(this.remmberPwd)
          const {tokenType, value} =res.data
          localStorage.setItem('token',tokenType+' '+ value)
          localStorage.setItem('account',this.loginForm.account)
          this.$router.push({path:'index'})
           this.loading = false
        }).catch(err=>{
          console.log(err);
          this.loading = false
        })
      })
    },
    getcode() {
      const { code, dataURL} = randomCode()
      this.codeImg = dataURL
      this.codeData = code
    },
    changCode() {
      this.getcode()
    },
    remeberChange(val) {
      console.log(val);
      const saveData = JSON.stringify({account: this.loginForm.account,password: this.loginForm.password})
      val ? localStorage.setItem('remeberPwd',saveData) : localStorage.removeItem('remeberPwd')
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: -webkit-radial-gradient(ellipse farthest-corner at center center, #1b44e4 0%, #020f3a 100%);
  background-image: radial-gradient(ellipse farthest-corner at center center, #1b44e4 0%, #020f3a 100%);
  .logo-img {
    position: absolute;
     width: 150px;
    top: 30px;
    left: 50px;
  }
  .form {
    width: 550px;
    min-height: 350px;
    color: #fff;
    position: relative;
    z-index: 5;
    .lg-title {
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 70px;
      margin-bottom: 70px;
    }
   .forget {
     float: right;
     margin: -10px 20px 40px;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
  }
    .submit {
      margin-top:30px;
      font-size: 16px;
      text-align: center;
    }
    .btn{
      width: 100%;
      margin-bottom: 20px;
      font-size: 18px;
    }
    .code-btn {
      width: 70%;
    }
    .code-put {
      width: 110px;
      height: 50px;
      float: right;
    }
  }
  .canvas{position: absolute; width:100%; left: 0; top: 0; height: 99%; z-index: 1;}
}
</style>
