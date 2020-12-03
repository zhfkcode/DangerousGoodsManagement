<template>
   <div class="det-set box-border">
      <h2 class="com-title">参数设置</h2>
      <div class="content">
        <ul class="com-set location">
          <li class="com-item">
             <label class="label">设置探头位置</label>
             <el-cascader v-model="params.houstNum" :props="props" :options="cascaderOpt" class="mar-20" placeholder="请输入探头位置信息"></el-cascader>
            <div class="input-box">
              <input type="text" v-model="params.name" class="inpt" placeholder="请输入位置名称">
            </div>
            <el-button type="primary"  @click="updataLocation">保  存</el-button>
          </li>
          <li class="com-item">
            <label class="label">删除探头信息</label>
            <el-cascader v-model="params.deletsn" :props="props" :options="cascaderOpt" class="mar-20" placeholder="请选择探头"></el-cascader>
            <el-button type="primary"  @click="deleteName">删  除</el-button>
          </li>
        </ul>
      </div>
      <div class="boxfoot"></div>
    </div>
</template>
<script>
import {  corresponed, corresFuns,getLocalItem} from '@/utils/commonFuns'
import { getAllMainNum, getCorrespondSn,getCompanyInfo,updataCompany,updataLocation,setLogin,updataName,deleteSn,deleteSensor }  from '@/request/device'
export default {
  data() {
    return {
      params: {
        houstNum: [],
        deletsn: [],
        labelName: '',
        name: '',
        mainId: '',
        // delSn: '',
        // delSm: ''
      },
      deleteNum: [],
      // hostList: [],
      //及联参数：
      cascaderOpt: [],
      cascaderOpt1: [],
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      password: '',
      setFormDialog: true,
      corrList: [],
      // deletSnList: {},
      // deletSenList: [],
      username: ''
    }
  },
  created(){
    this.username = getLocalItem('account')
     corresponed((res)=>{
      this.corrList = res ? res : []
      this.getAllMainId()
    })
  },
  methods: {
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
      getAllMainNum({username: this.username}).then(res=>{
        // this.hostList = res.data
        let mapList = res.data.map(item=>{
         let name = corresFuns(this.corrList,item)
          return {
            value: item,
            label: name ? name : item
          }
        })
        // this.hostList = mapList
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
    //删除主机探头
    deleteName() {
      if(!this.params.deletsn.length) {
        this.$message.warning('请选择要删除的主机/探头')
        return false
      }
      const text = '确定删除探头？'
      this.$confirm(text,'删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(( )=> {
          deleteSensor({ sn: this.params.deletsn[0], sensor_num: this.params.deletsn[1]}).then(res => {
            this.$message.success('删除成功')
            this.getAllMainId()
          })
      }).catch(() => {

      })
    },
  }
}
</script>
<style lang="scss" scoped>
.det-set{
  height: 100%;
}
  .com-set {
    // width: 50%;
    // margin: 0 auto;
    padding-left: 50px;
    .com-item {
      position: relative;
      padding: 5px 10px;
      margin-bottom: 20px;
      display: flex;
    }
    .label {
      width: 200px;
      font-size: 16px;
      color: #DCF6FF;
      line-height: 40px;
      margin-right: 20px;
      &.auto {
        width: auto;
      }
    }
    .input-box {
      width: 200px;
      // flex: 1;
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
</style>
