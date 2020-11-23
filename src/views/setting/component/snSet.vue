<template>
  <div class="sn-box">
    <div class="opeart-box">
      <el-button type="primary" class="top-button" @click="addShow()">添加</el-button>
    </div>
    <el-table :data="tableData">
        <el-table-column prop="sn" label="主机" align="center"></el-table-column>
        <el-table-column label="主机名称" align="center">
          <template slot-scope="scope">
          {{scope.row.snName ? scope.row.snName : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="是否绑定" align="center" >
          <template slot-scope="scope">
            {{scope.row.bind ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="绑定时间"  align="center" ></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="addShow(scope.row)">修改主机名称</el-button>
            <el-button type="primary" size="small" @click="offBind(scope.row)">解除绑定</el-button>
            <el-button type='danger' size="small" @click="deleteSn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTit" :visible="show" width="40%" top="2vh" custom-class="setdialog">
          <el-form v-model="snForm" ref="ruleHousehold" :rules="rules">
          <section>
              <el-form-item label="主机编号" prop="sn" v-if="addModel">
                <el-input v-model="snForm.sn" placeholder="请输入主机编号"></el-input>
              </el-form-item>
              <el-form-item label="主机名称" prop="sn_name">
                <el-input v-model="snForm.sn_name" placeholder="请输入主机名称"></el-input>
              </el-form-item>
          </section>
        </el-form>
        <span slot="footer" class="dialog-footer popup-footer" top="2vh">
            <el-button class="cancelButton" @click="show = false">取消</el-button>
            <el-button class="saveButton" type="primary" @click="saveAdd">保存</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import {  corresponed, corresFuns,getLocalItem} from '@/utils/commonFuns'
import { updataName,deleteSn ,addHoust,offHoust}  from '@/request/device'
export default {
  data() {
    return {
      tableData: [],
      username:'',
      show: false,
      snForm: {
        sn: '',
        sn_name: ''
      } ,
      rules: {
      },
      // corrList:[],
      dialogTit: '',
      addModel: true, //添加还是编辑
    }
  },
  created() {
    this.username = getLocalItem('account')
    this.getALlSn()
    // corresponed((res)=>{
    //   this.corrList = res ? res : [] 
    //   this.tableData = this.corrList 
    //   this.getAllMainId()
    // })
  },
  methods: {
     //更新别名信息
    modifyName() {
      let params = {
        sn: this.snForm.sn,
        sn_name : this.snForm.sn_name,
      }
      updataName(params).then(res=>{
        this.show = false
         res.code ==200 ? this.$message.success('别名信息更新成功') : this.$message.error('别名信息更新失败')
         this.getALlSn()
      })
    },
    //获取所有主机信息
    getALlSn() {
       corresponed((res)=>{
        // this.corrList = res ? res : [] 
        this.tableData = res ? res : [] 
        // this.getAllMainId()
      })
    },
    //删除主机探头
    deleteSn(item) {
      const text = '删除主机将删除主机下所有探头，确定删除？'
      this.$confirm(text,'删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(( )=> {
          deleteSn({sn: item.sn}).then(res=>{
            this.$message.success('删除成功')
             this.getALlSn()
          })
      }).catch(() => {

      })
    },
    //解除绑定
    offBind(item) {
      this.$confirm('确认解绑？','解绑提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(( )=> {
        offHoust({sn: item.sn}).then(res =>{
          this.$message.success('解绑成功')
          item.bind = false
        })
      }).catch(() => {

      })
    },
    addShow(type){
      this.snForm.sn = type ? type.sn : ""
      this.snForm.sn_name = type ? type.snName : ""
      this.show = true
      this.dialogTit = type ? '修改主机名称' : '添加主机'
      this.addModel = type? false : true
    },
    saveAdd() {
      if(!this.addModel){
        this.modifyName()
        return 
      }
      if(!this.snForm.sn){
        this.$message.error('请输入主机编号')
        return false
      }
      const para = {
        sn: this.snForm.sn,
        sn_name: this.snForm.sn_name,
        username: this.username
      }
      addHoust(para).then(res => {
        if(res.code ==200 ){
          this.$message.success('创建成功')
          this.show = false
          this.getALlSn()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sn-box {
  height: 100%;
  .top-button {
    width: 120px;
    margin-bottom: 20px;
  }
}
</style>