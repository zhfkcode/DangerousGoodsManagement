<template>
  <div class="alarm-record">
    <!-- 地图区域 -->
    <div class="map-warp box-border" ref="mapWrap">
      <img class="bk-img" ref="backImg" :src="backImg" alt="">
      <div class="map-box" >
        <img class="bk-img" ref="backImg" :src="backImg" alt="">
        <drag-item v-if="selectPoint.id" class="pop-item" :options="selectPoint" @chageaxis="resetaxis">
           <div class="item-tips">
            <svgicon class="danger-icon" :icon-name="selectPoint.type | dangerType"></svgicon>
            <p class="danger-text">{{selectPoint.currentValue+selectPoint.unit}}</p>
         </div>
        </drag-item>
      </div>
      <div class="boxfoot"></div>
    </div>
    <!-- 右边区域 -->
    <div class="right-warp box-border">
      <!-- 上传 -->
      <el-upload
        class="upload-box"
        ref="upload"
        action=""
        :show-file-list="false"
        :on-success="handleSuccess"
        :http-request="picUpload"
        :before-upload="beforeUpload"
        >
        <el-button size="small" type="primary">点击上传</el-button>
        <span class="file-name">上传文件：{{fileName}}</span>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
      <div class="set-loc">
        <el-cascader v-model="houstNum" :props="props" :options="cascaderOpt" @change="cascaChange" class="mar-20" size='small' placeholder="请选择主机/探头"></el-cascader>
        <div class="loc-item">
          <span class="label">x轴位置：</span>
          <el-input v-model="loc.x" placeholder="请输入x轴坐标" @change="inputChange('x')" class="wid-120 mar-20"></el-input>
          <span class="label">y轴位置：</span>
           <el-input v-model="loc.y" placeholder="请输入y轴坐标" @change="inputChange('y')" class="wid-120"></el-input>
        </div>
        <div class="loc-item">
          <el-button type="primary" class="wid-120" @click="modifLoc">保存</el-button>
        </div>
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
import axios from 'axios'
import {  getImgNaturalDimensions, corresponed, corresFuns } from '../utils/commonFuns'
import { setLogin, getControlCount, getAllMainNum, getCorrespondSn,getPicture,modifyLoc,picLoad } from '../request/device'
import DragItem from '../components/public/drag'
import { log } from 'util'
export default {
  data() {
    return {
      detetionList: [],
      setFormDialog: true,
      password: '',
      backImg: "",
      fileName: '',
        //及联参数：
      cascaderOpt: [],
      houstNum: '',
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      selected: 0,
      selectPoint: {},
      loc: {
        x: 0,
        y: 0
      },
      originPic:{
        rateX: 0,
        rateY: 0
      },
      corrList: []
    }
  },
  created(){
    corresponed((res)=>{
      this.corrList = res ? res : [] 
      this.getList()
    })
  },
  mounted(){
    this. getList()
  },
  components: {
    DragItem
  },
  methods:{
    getList(){
     getControlCount().then(res=>{
        this.detetionList = res.data
      })
      //获取最近报警信息
      //获取图片
      getPicture().then(res=>{
        this.backImg = res.data
       this.$nextTick(()=>{
          this.setCurLocation()
       })
      })
      this.getAllMainId()
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
    // 地图点点击
    deteClick(index){
      console.log('index',index);
    },
    //上传相关
    handleSuccess(res, file) {
      console.log('srcc');
      this.backImg = URL.createObjectURL(file.raw);
      this.fileName = file.name
    },
    beforeUpload(file) {
      let types = 'jpg,jpeg,image/jpg,png,image/png,image/jpeg'
      console.log(file.type,types.indexOf(file.type));
       if(types.indexOf(file.type)==-1){
         this.$message.warning('只能上传图片')
         return false
       }
    },
    //获取所有主机编号
    getAllMainId() {
      getAllMainNum().then(res=>{
       this.cascaderOpt = res.data.map(item=>{
         let name = corresFuns(this.corrList,item)
          return {
            value: item,
            label: name ? name : item
          }
        })
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
     setCurLocation(items){
      let dom = this.$refs.backImg
      let w =dom.clientWidth 
      let h =dom.clientHeight 
      getImgNaturalDimensions(dom,(res)=>{
        let rateX = w/res.w
        let rateY = h/res.h
        this.originPic = {
          rateX,
          rateY
        }
        // this.detetionList.map(item=>{
        //   item.xAxis = item.xAxis * rateX
        //   item.yAxis = item.yAxis * rateY
        //   item.isShow = false
        //   return item
        // })
        // this.detetionList = items
      })
    },
    //设置位置
    setPointLoc(item,type){
      if(type) {
        let x = (this.loc.x / this.originPic.rateX).toFixed(2)
        let y = (this.loc.y / this.originPic.rateY).toFixed(2)
        return {
          x,y
        }
      }
      let obj = {...item}
       if(item.xAxis)obj.xAxis = item.xAxis * this.originPic.rateX
       if(item.yAxis)obj.yAxis = item.yAxis * this.originPic.rateY
       this.loc.x = obj.xAxis
       this.loc.y = obj.yAxis
       return obj
    },
    //显示图拍呢坐标
    resetaxis (val) {
      // console.log('send',val);
      this.loc.x = val.x
      this.loc.y = val.y
    },
    //手动修改位置值
    inputChange(val) {
      console.log(val);
      if(!this.selectPoint.id) {
        this.$message.warning('请先选择主机探头')
        return false
      }
      if(val == 'x') {
        let x = parseFloat(this.loc.x)
        this.$set(this.selectPoint,'xAxis',x)
      }else if(val == 'y') {
        this.selectPoint.yAxis = parseFloat(this.loc.y)
      }
    },
    //探头选择
    cascaChange (index){
      let sele = this.detetionList.filter((item,index)=>{
          if(this.houstNum[0]==item.sn&&this.houstNum[1]==item.sensorNum) {
            this.selected = index;
            return item
          }
        })
        
      this.selectPoint = this.setPointLoc(sele[0])
      // console.log(this.selectPoint);
    },
    modifLoc() {
      if(!this.selectPoint.id){
        this.$message.warning('请先修改')
        return false
      }
      let locc = this.setPointLoc('',true)
      let param = {
        sn: this.selectPoint.sn,
        sensor_num: this.selectPoint.sensorNum,
        x_axis: locc.x,
        y_axis: locc.y
      }
      modifyLoc(param,{'Content-Type': 'multipart/form-data'}).then(res=>{

        if(res.code == 200) {
          this.$message.success('修改成功') 
          this.detetionList[this.selected].xAxis = locc.x
          this.detetionList[this.selected].yAxis = locc.y
        } else{ 
          this.$message.error('修改失败')
        }
      })
    },
    picUpload(params) {
      console.log(params);
      var reader = new FileReader()
      reader.readAsArrayBuffer(params.file)
      let _that = this
       reader.onload = (e) => {
         let blob = ''
         if(typeof e.target.result === 'object'){
            blob = new Blob([e.target.result])
          }else{
            blob = e.target.result
          }
     let formData = new FormData();
        formData.append('file', blob);
      picLoad(formData,{'Content-Type': 'multipart/form-data'}).then(res=> {
        if(res.code == 200) {
          _that.$message.success('上传成功')
          _that.backImg = URL.createObjectURL(params.file);
          _that.fileName = params.file.name
        }else{
          _that.$message.error('上传失败')
        }
      })
      }
    }
  },
  filters:{
    dangerType(val){
      return val == 45 ? 'iconwenshiduchuanganqi' : val == 44 ? 'iconyalichuanganqi' : val == 43 ? 'iconwenduchuanganqi' :'iconqingqichuanganqi'
    },
    locStyle(val){
      let x = val.xAxis ? val.xAxis : 0
      let y = val.yAxis ? val.yAxis : 0
      return `top: ${y}px;left:${x}px;`
    }
  }
}
</script>
<style lang="scss" scoped>
.alarm-record {
  padding: 10px;
  display: flex;
  height: calc(100% - 105px);
  .map-warp {
    // padding: 10px;
    flex: 2;
    margin-right: 20px;
    position: relative;
    overflow: hidden;
    .picture {
      width: 20px;
      height: 20px;
    }
    .bk-img {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .pop-item {
      position: absolute;
      // left: 50%;
      // top: 50%;
    }
    .point-item {
      display: flex;
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  .right-warp {
    // flex: 1;
    width: 25%;
    display: flex;
    flex-direction: column;
  }
 .upload-box {
   margin: 10px;
 }
 .el-upload__tip {
   color: #fff;
 }
 .file-name {
   margin-left: 10px;
   color: #fff;
   font-size: 14px;
 }
 .set-loc {
   margin: 10px;
 }
 .loc-item {
    color: #fff;
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
    margin-top: 20px;
    .label {
      white-space: nowrap;
      line-height: 40px;
    }
  }
  .item-tips {
      color: #3CF0FF;
      background:#1F3561;
      text-align: center;
      padding: 5px;
      border-radius: 50%;
    }
    .danger-icon{
      font-size: 20px;
    }
    .danger-text{
      font-size: 12px;
    }
}
</style>