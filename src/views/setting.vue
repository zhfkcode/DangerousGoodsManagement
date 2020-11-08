<template>
  <div class="setting">
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
    <div class="det-set box-border">
      <h2 class="com-title">参数设置</h2>
      <div class="content">
        <ul class="com-set location">
          <li class="com-item">
             <el-cascader v-model="params.houstNum" :props="props" :options="cascaderOpt" class="mar-20" placeholder="请选择主机/探头"></el-cascader>
            <label class="label">位置名称</label>
            <div class="input-box">
              <input type="text" v-model="params.name" class="inpt" placeholder="请输入位置名称">
            </div>
            <el-button type="primary"  @click="updataLocation">保  存</el-button>
          </li>
          <li class="com-item">
             <el-select v-model='params.mainId'  style="width: 195px;" class="mar-20" placeholder="请选择主机">
              <el-option v-for="item in hostList" :value='item.value' :label="item.label" :key="item.value"></el-option>
            </el-select>
            <label class="label">别名</label>
            <div class="input-box">
              <input type="text" v-model="params.labelName" class="inpt" placeholder="请输入别名">
            </div>
            <el-button type="primary"  @click="updataName">保  存</el-button>
          </li>
          <li class="com-item">
            <label class="label auto">请选择要删除的主机或者探头</label>
            <el-select v-model='params.delSn'  style="flex: 1;" class="mar-20" placeholder="请选择主机" @change="deleChange">
              <el-option v-for="item in hostList" :value='item.value' :label="item.label" :key="item.value"></el-option>
            </el-select>
            <el-select v-model='params.delSm'  style="flex: 1;" class="mar-20" placeholder="请选择探头" :disabled="!params.delSn">
              <el-option v-for="item in deletSenList" :value='item.value' :label="item.label" :key="item.value"></el-option>
            </el-select>
            <el-button type="primary"  @click="deleteName">删  除</el-button>
            <div class="tips">温馨提醒: 如果删除主机，该主机下的所有探头也会被删除</div>
          </li>
          <!-- <li class="com-item">
            <el-button type="primary" style="width: 50%; margin: 0 auto;" @click="updataLocation">保  存</el-button>
          </li> -->
        </ul>
      </div>
      <div class="boxfoot"></div>
    </div>
    <el-dialog
      title="提示"
      custom-class="setdialog"
      :visible.sync="setFormDialog"
      width="30%"
      :show-close="false"
      :append-to-body='true'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center>
      <div class="set-form">
        <label class="label">请输入密码：</label>
        <el-input v-model="password" type="password" placeholder="请输入密码"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$router.go(-1)" class="mar-20">取 消</el-button>
        <el-button type="primary" @click="ensureClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {  corresponed, corresFuns} from '../utils/commonFuns'
import { getAllMainNum, getCorrespondSn,getCompanyInfo,updataCompany,updataLocation,setLogin,updataName,deleteSn,deleteSensor }  from '../request/device'
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
      params: {
        houstNum: [],
        labelName: '',
        name: '',
        mainId: '',
        delSn: '',
        delSm: ''
      },
      deleteNum: [],
      hostList: [],
      //及联参数：
      cascaderOpt: [],
      cascaderOpt1: [],
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      props1: {
        checkStrictly: true,
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      password: '',
      setFormDialog: true,
      corrList: [],
      deletSnList: {},
      deletSenList: [],
    }
  },
  created(){
    // this.getAllMainId()
    this.getCompany()
     corresponed((res)=>{
      this.corrList = res ? res : [] 
      this.getAllMainId()
    })
  },
  methods: {
    //获取公司信息
    getCompany() {
      getCompanyInfo().then(res=>{
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
        super_password : this.comInfo.superPwd
      }
      updataCompany(params).then(res=>{
        res.code ==200 ? this.$message.success('公司信息更新成功') : this.$message.error('公司信息更新失败')
      })
    },
    //更新位置信息
    updataLocation() {
      if(!this.params.houstNum.length || !this.params.name){
        this.$message.warning('请完善需要填写信息')
        return false
      }
      let params = {
        sn: this.params.houstNum[0] ,
        sensor_num: this.params.houstNum[1],
        location : this.params.name,
      }
      updataLocation(params).then(res=>{
         res.code ==200 ? this.$message.success('探头位置信息更新成功') : this.$message.error('探头位置信息更新失败')
      })
    },
    //更新别名信息
    updataName() {
      if(!this.params.mainId || !this.params.labelName){
        this.$message.warning('请完善需要填写信息')
        return false
      }
      let params = {
        sn: this.params.mainId,
        sn_name : this.params.labelName,
      }
      updataName(params).then(res=>{
         res.code ==200 ? this.$message.success('别名信息更新成功') : this.$message.error('别名信息更新失败')
      })
    },
   //获取所有主机编号
    getAllMainId() {
      getAllMainNum().then(res=>{
        // this.hostList = res.data
        let mapList = res.data.map(item=>{
         let name = corresFuns(this.corrList,item)
          return {
            value: item,
            label: name ? name : item
          }
        })
        this.hostList = mapList
        this.cascaderOpt = mapList
        this.cascaderOpt1 = mapList
        this.showCase = true
        // this.echFilter.mainIdList = res.data
      })
    },
    //及联方法获取对应的探头编号
    lazyLoad (node, resolve) {
      const { level,value } = node;
      if(level){
        getCorrespondSn({sn: value}).then(res=>{
         let data = res.data.map(item=>{
            return {
              value: item,
              label: item,
              leaf: true
            }
          })
          resolve(data)
        })
      }
    },
    //设置密码
    ensureClick() {
      if(!this.password) {
        this.$message.warning('请输入设置密码')
        return false
      }
      setLogin({super_password: this.password}).then(res=>{
        this.setFormDialog = false;
      })
    },
    //删除主机探头
    deleteName() {
      const snstat = this.params.delSn
      const senstat = this.params.delSm
      if(!snstat && !senstat) {
        this.$message.warning('请选择要删除的主机/探头')
        return false
      }
      const text = !senstat ? '删除主机将删除主机下所有探头，确定删除？' : '确定删除探头？'
      this.$confirm(text,'删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(( )=> {
        if(!senstat){
          deleteSn({sn: this.params.delSn}).then(res=>{
            this.$message.success('删除成功')
            this.params.delSn= ''
            this.params.delSm= ''
            this.getAllMainId()
          })
        }else {
          deleteSensor({ sn: this.params.delSn, sensor_num: this.params.delSm}).then(res => {
            this.$message.success('删除成功')
            this.params.delSn= ''
            this.params.delSm= ''
            this.getAllMainId()
          })
        }
      }).catch(() => {

      })
    },
    deleChange() {
      const sn = this.params.delSn
      if(!sn){
        return []
      }
      if(this.deletSnList[sn]){
        this.deletSenList = this.deletSnList[sn]
      }else {
         getCorrespondSn({sn}).then(res=>{
         let data = res.data.map(item=>{
            return {
              value: item,
              label: item,
            }
          })
          this.deletSenList = data
          this.deletSnList[sn] =  data
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.setting {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 105px);
  .det-set {
    flex: 1;
    margin-bottom: 10px;
    overflow: auto;
    .content {
      text-align: center;
      height: calc(100% - 40px);
      overflow: auto;
    }
    .location {
      margin-top: 20px;
    }
  }
  .company-info{
    flex: 1;
    margin-bottom: 10px;
  }
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
  .set-form{
    color: #DCF6FF;
    .label {
      font-size: 18px;
    }
  }
  .tips {
    position: absolute;
    bottom: -20px;
    left: 20px;
    font-size: 12px;
    color: #ccc;
  }
  //placehoder设置
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #ccc;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:  #ccc;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:  #ccc;
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color:  #ccc;
  }
}
</style>