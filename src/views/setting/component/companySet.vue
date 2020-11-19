<template>
   <div class="company-info box-border">
      <h2 class="com-title">公司信息设置</h2>
      <ul class="com-set">
        <li class="com-item">
          <label class="label">公司名称</label>
          <div class="input-box">
            <input v-model="comInfo.companyName" type="text" class="inpt" placeholder="输入公司名称">
          </div>
        </li>
        <li class="com-item">
          <label class="label">监测种类</label>
          <div class="input-box">
            <input type="text" v-model="comInfo.monitorType" class="inpt" placeholder="输入监测种类">
          </div>
        </li>
        <li class="com-item">
          <label class="label">安全员</label>
          <div class="input-box">
            <input type="text" v-model="comInfo.safetyOfficer" class="inpt" placeholder="输入安全员">
          </div>
        </li>
        <li class="com-item">
          <label class="label">登录密码</label>
          <div class="input-box">
            <input type="password" v-model="comInfo.pwd" class="inpt" placeholder="输入新的登录密码">
          </div>
        </li>
        <li class="com-item">
          <label class="label">设置密码</label>
          <div class="input-box">
            <input type="password" v-model="comInfo.superPwd" class="inpt" placeholder="输入新的设置密码">
          </div>
        </li>
        <li class="com-item">
          <el-button type="primary" style="width: 50%; margin: 0 auto;" @click="updataComInfo">保  存</el-button>
        </li>
      </ul>
      <div class="boxfoot"></div>
    </div>
</template>
<script>
import {getLocalItem} from '@/utils/commonFuns'
import { getAllMainNum, getCorrespondSn,getCompanyInfo,updataCompany,updataLocation,setLogin,updataName,deleteSn,deleteSensor }  from '@/request/device'
export default {
  data() {
    return {
      comInfo: {
        companyName: '',
        monitorType: '',
        safetyOfficer: '',
        pwd: '',
        superPwd: '',
      },
    }
  },
  created() {
     this.getCompany()
  },
  methods: {
    //获取公司信息
    getCompany() {
      const acc = getLocalItem('account')
      getCompanyInfo({username: acc}).then(res=>{
        this.comInfo = {...this.comInfo,...res.data}
      })
    },
    //更新公司信息
    updataComInfo() {
      let params = {
        company_name: this.comInfo.companyName,
        monitor_type : this.comInfo.monitorType,
        password : this.comInfo.pwd,
        safety_officer : this.comInfo.safetyOfficer,
        super_password : this.comInfo.superPwd,
        username: getLocalItem('account')
      }
      updataCompany(params).then(res=>{
        res.code ==200 ? this.$message.success('公司信息更新成功') : this.$message.error('公司信息更新失败')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.com-set {
    width: 50%;
    margin: 0 auto;
    .com-item {
      position: relative;
      padding: 5px 10px;
      margin-bottom: 20px;
      display: flex;
    }
    .label {
      width: 80px;
      font-size: 16px;
      color: #DCF6FF;
      line-height: 40px;
      margin-right: 20px;
      &.auto {
        width: auto;
      }
    }
    .input-box {
      flex: 1;
      position: relative;
      margin-right: 20px;
      .inpt {
        width: 100%;
        height: 40px;
        border: 1px solid rgba(26, 150, 236, 0.5);
        outline: none;
        border-radius: 3px;
        background: transparent;
        color: #fff;
        padding: 0 15px;
        box-sizing: border-box;
      }
      &::before,&::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 26px;
        top: 7px;
        background:rgba(26, 150, 236, 0.5);
      }
      &::before {
        left: -2px;
      }
      &::after {
        right: -2px;
      }
    }
  }
</style>