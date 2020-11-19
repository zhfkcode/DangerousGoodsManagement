<template>
  <div class="login-box">
    <img src="../assets/hq-logo.png" alt="logo" class="logo-img">
    <div class="form">
      <el-form
        ref="forgetForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
      <h2 class="lg-title">重置密码</h2>
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
          :class="loginForm.password ? 'fillword' : ''"
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
        <el-button class="code-put" type="primary" :disabled='countdown' @click="countClick">
          <span v-if="!countdown">获取验证码</span>
          <span v-else>{{countNum}}</span>
        </el-button>
      </el-form-item>
      <div class="submit">
        <el-button @click="Login" type="primary" round class="btn" :loading="loading">重置</el-button>
        <router-link to='/register'>
          <el-button type="success" class="btn">返回</el-button>
        </router-link>
      </div>
      </el-form>
    </div>
    <canvas id="canv" width="1920" height="572" class="canvas"></canvas>
  </div>
</template>
<script>
import canDraw from '../utils/canvas'
import {forgetWord, sendEmail} from '../request/device'
export default {
  data() {
    return {
      loginForm: {
        account: '',
        password: '',
        code: ""
      },
      loginRules: {
        account: [{required: true,message: '请输入用户名', trigger: "blur"}],
        password: [{required: true,message: '请输入密码', trigger: "blur"}],
        code: [{required: true,message: '请输入验证码', trigger: "blur"}],
      },
      loading: false,
      countdown: false,
      countNum: 60,
      timer: null
    }
  },
  mounted(){
    this.$nextTick(()=>canDraw())
  },
  methods:{
    Login() {
        this.$refs.forgetForm.validate(valid => {
        if(!valid) {return false}
        if(this.loading){return false}
        this.loading = true;
        const params = {
          code: this.loginForm.code,
          username: this.loginForm.account,
          pwd: this.loginForm.password,
        }
        forgetWord(params).then(res=>{
          if(res.code === 200){
             this.$router.push({path:'/login'})
          }
           this.loading = false
        }).catch(err=>{
          this.loading = false
        })
      })
    },
    //倒计时
    countClick() {
      if(!this.loginForm.account) {
        this.$message.error('请输入用户名')
        return false
      }
      if(this.countdown) {
        return false
      }
      this.countdown = true
      this.timer = setInterval(() => {
        if(this.countNum > 0){
          this.countNum--
        }else {
          this.countdown = false
          this.countNum = 60
          clearInterval(this.timer)
          this.timer = null
        }
      },1000)
      sendEmail({username: this.loginForm.account}).then(res=> {
        if(res.code === 200 ) {
          this.$message.success('获取成功')
        }
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
      float: right;
    }
  }
  .canvas{position: absolute; width:100%; left: 0; top: 0; height: 99%; z-index: 1;}
}
</style>