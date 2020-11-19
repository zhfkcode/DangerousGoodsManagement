<template>
  <div class="login-box">
    <img src="../assets/hq-logo.png" alt="logo" class="logo-img">
    <div class="form">
      <el-form
        ref="registerForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
      <h2 class="lg-title">后台注册</h2>
        <el-form-item prop="company">
          <el-input
            :class="loginForm.company ? 'fillword' : ''"
            prefix-icon="el-icon-school"
            v-model="loginForm.company"
            placeholder="请输入公司名称"
          />
        </el-form-item>
      <el-form-item prop="password">
        <el-input
          :class="loginForm.password ? 'fillword' : ''"
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          type="password"
          placeholder="请输入登录密码"
        />
      </el-form-item>
      <el-form-item prop="checkPwd">
        <el-input
          :class="loginForm.checkPwd ? 'fillword' : ''"
          prefix-icon="el-icon-lock"
          v-model="loginForm.checkPwd"
          type="password"
          placeholder="请再输入一次"
        />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          :class="loginForm.phone ? 'fillword' : ''"
          prefix-icon="el-icon-mobile-phone"
          v-model="loginForm.phone"
          placeholder="请输入联络人电话"
        />
      </el-form-item>
      <el-form-item prop="pagePwd">
        <el-input
          :class="loginForm.pagePwd ? 'fillword' : ''"
          prefix-icon="el-icon-lock"
          v-model="loginForm.pagePwd"
          type="password"
          placeholder="请输入设置页面密码"
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          :class="loginForm.email ? 'fillword' : ''"
          prefix-icon="el-icon-lock"
          v-model="loginForm.email"
          placeholder="请输入邮箱地址"
        />
      </el-form-item>
      <div class="submit">
        <el-button @click="Login" type="primary" round class="btn" :loading="loading">注册</el-button>
        <router-link to='/login'>
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
import {register} from '../request/device'
export default {
  data() {
    const surePwd = (rule, value, callback) => {
      if(!value) {
        callback('请再次输入密码')
      }else if(this.loginForm.password !== value) {
        callback('两次输入密码不一致')
      }else {
        callback()
      }
    }
    return {
      loginForm: {
        company: '',
        password: '',
        checkPwd: '',
        phone: '',
        pagePwd: '',
        email: ""
      },
      loginRules: {
        company: [{required: true,message: '请输入公司名称', trigger: "blur"}],
        password: [{required: true,message: '请输入密码', trigger: "blur"}],
        checkPwd: [{validator: surePwd, trigger: "blur"}],
        phone: [
          {required: true,message: '请输入手机号', trigger: "blur"},
          { pattern:/^1[3456789]\d{9}$/,message: '请输入正确手机号',trigger: 'blur'}
        ],
        pagePwd: [{required: true,message: '请输入页面配置密码', trigger: "blur"}],
        email: [
          {required: true,message: '请输入邮箱', trigger: "blur"},
          {type: 'email',message: '请输入正确邮箱', trigger: "blur"}
          ],
      },
      loading: false
    }
  },
  mounted(){
    this.$nextTick(()=>canDraw())
  },
  methods:{
    Login() {
      this.$refs.registerForm.validate(valid => {
        if(!valid){return false}
        const params = { 
          company_name: this.loginForm.company,
          password: this.loginForm.password,
          phone: this.loginForm.company,
          super_password: this.loginForm.pagePwd,
          username: this.loginForm.email,
        }
        this.loading = true
        register(params).then(res => {
          if(res.code == 200){
            this.$message.success('注册成功')
            this.$router.push('/login')
          }else {
            this.$message.console.error('注册失败');
          }
          this.loading = false
        }).catch(()=>{
        this.loading = false
      })
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
  }
  .canvas{position: absolute; width:100%; left: 0; top: 0; height: 99%; z-index: 1;}
}
</style>