<template>
  <div class="probe-detail">
    <!-- 详细信息 -->
    <div class="infos box-border">
      <h2 class="com-title">详细信息</h2>
       <ul class="point-info">
        <li class="point-item">
          <p class="point-label">主机名称：</p>
          <p>{{info.labelName || info.sn}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">探头编号：</p>
          <p>{{itemInfo.sensorNum}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">监测种类：</p>
          <p>{{itemInfo.typeName}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">监测值：</p>
          <p>{{itemInfo.currentValue}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">Ⅰ级/上警值：</p>
          <p>{{itemInfo.levelOneLimited}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">Ⅱ级值/下警值：</p>
          <p>{{itemInfo.levelTwoLimited}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">量程：</p>
          <p>{{itemInfo.ranges}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">单位：</p>
          <p>{{itemInfo.unit}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">状态：</p>
          <p>{{itemInfo.status}}</p>
        </li>
        <li class="point-item">
          <p class="point-label">位置：</p>
          <p>{{itemInfo.location}}</p>
        </li>
      </ul>
      <div class="boxfoot"></div>
    </div>
    <!-- 表格数据 -->
    <div class="table-box box-border" ref="echartsWrap">
      <h2 class="com-title">报警数据</h2>
      <div class="operat-box">
        <div class="serach">
           <el-date-picker
           size='small'
           style="margin-right:20px;width: 250px;"
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button class="wid-120" type="primary" @click="getSearch">搜索</el-button>
        </div>
        <el-button class="export wid-120" type="primary" @click="exportData">导出</el-button>
      </div>
      <el-table
        ref="table"
        :data="tableData"
        :height='tableHeight'
        style="width: 100%">
        <el-table-column
          prop="sn"
          label="主机名称"
          align="center"
          >
           <template slot-scope="scope">
            {{scope.row.labName || scope.row.sn}}
          </template>
          </el-table-column>
        <el-table-column
          prop="sensorNum"
          label="探头编号"
          align="center"
          />
        <el-table-column
          prop="createTime"
          label="时间"
          align="center"
        />
        <el-table-column
          prop="typeName"
          label="监测类型"
          align="center"
        />
        <el-table-column
          prop="alarmValue"
          label="监测值"
          align="center"
        />
        <el-table-column
          prop="alarmInfo"
          label="报警类型"
          align="center"
        />
      </el-table>
      <div class="boxfoot"></div>
    </div>
    <!-- 数据图标 -->
    <div class="echarts-box box-border" ref="echartsWrap">
      <h2 class="com-title">历史曲线</h2>
      <div class="filter-box">
         <h2 class="echart-tit">{{dateSet.value}}</h2>
         <el-select v-model='dateSet.select' @change="selectChange" size='small' style="width: 85px;" class="mar-20">
          <el-option value='year' label="年份"></el-option>
          <el-option value='month' label="月份"></el-option>
          <el-option value='date' label="天"></el-option>
        </el-select>
         <el-date-picker
          size='small'
          class="datepick"
          @change="datepickChange"
          v-model="dateSet.value"
           :type="dateSet.type"
          :value-format="dateSet.format"
          :placeholder="dateSet.placeholder"
          >
        </el-date-picker>
      </div>
      <div id="echart" class="echarts"></div>
      <div class="boxfoot"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { lineOption2 } from '../utils/eOptions'
import { format,corresFuns } from '../utils/commonFuns'
import { getAlarmFilter, probeInfos,getHistEchart } from "../request/device";
// let _ = require('lodash')
export default {
  data() {
    return {
      info: {
        sn: '',
        snNum: '',
        labelName: ''
      },
      itemInfo: {},
      dateRange: [],
      tableData: [],
      tableHeight: 0,
       //主机编号
      dateSet: {
        value: '',
        select: 'month',
        type: 'month',
        format: 'yyyy-MM',
        placeholder: '选择月份'
      },
      corrList: [],
      timer: null
    }
  },
  created () {
    this.info.sn = this.$route.query.sn
    this.info.snNum = this.$route.query.snNum
    this.info.labelName = this.$route.query.labelName
    if(!this.info.sn || !this.info.snNum){
      this.$router.push('/')
    }
    this.getProedInfo()
    this.timer = setInterval(() => {
      this.getProedInfo()
    }, 2000);
  },
   mounted(){
    // window.onresize = _.debounce(() => {
    //     this.echartsbuild(true)
    //     this.getTableHeight()
    //   }, 400)
    this.$nextTick(()=>{
      this.echartsbuild()
    this.getTableHeight()
    })
  },
  methods: {
    getProedInfo(){
      probeInfos({sensor_num: this.info.snNum, sn: this.info.sn}).then(res=>{
        this.itemInfo = res.data
      })
    },
     echartsbuild(res) {
      let dom = document.getElementById('echart');
      let height = this.$refs.echartsWrap.clientHeight -90 + 'px'
      let width = this.$refs.echartsWrap.clientWidth - 20 + 'px'
      dom.style.height = height
      dom.style.width = width
      if(res){
        this.echartsInstance.resize(width,height)
        return 
      }
      this.echartsInstance = echarts.init(dom);
      this.selectChange ('month')
      // this.echartsInstance.setOption(this.option)
    },
     getTableHeight(){
      this.tableHeight = this.$refs.echartsWrap.clientHeight -150 + 'px'
    },
    getSearch() {
      if(!this.dateRange.length){
        this.$message.error('请选择日期')
        return false
      }
      this.searchModal = true
      let parms={
        sensor_num: this.info.snNum,
        sn: this.info.sn,
        start_time: this.dateRange[0],
        end_time: this.dateRange[1]
      }
      getAlarmFilter(parms).then(res=>{
        this.tableData = res.data.map((item)=>{
          item.labName = this.info.labelName
          return item
        })
        this.$refs.table.bodyWrapper.scrollTop =0;
      })
    },
     //获取echarts数据
    getEchartsData() {
      if(!this.dateSet.value) {
        return 
      }
      //取消重复请求
       if (typeof this.cancelAjax === 'function') {
          this.cancelAjax()
        }
      let params={
        sn: this.info.sn,
        sensor_num: this.info.snNum,
        date: this.dateSet.value,
        type: this.dateSet.type == 'date' ? 'day' : this.dateSet.type
      }
      // this.requstCount++
      this.echartsInstance.showLoading(
        {
          text: '数据加载中...',
          color: '#409eff',
          textColor: '#409eff',
          maskColor: 'rgba(0, 0, 0, 0.3)',
              }      )
       getHistEchart(params,this).then(res=>{
        let eData = res.data
        let xData = []
        let yData = []
        let count = 1
        eData.map(item=>{
          xData.push(item.timestamp)
          yData.push(item.value)
        })
        lineOption2.xAxis[0].data = xData
        lineOption2.series[0].name = this.chartsName
        lineOption2.series[0].data = yData
        lineOption2.yAxis[0].name = res.msg
        lineOption2.tooltip.formatter = `{b0} : {c0}${res.msg}`
        // this.requstCount--
        // if(this.requstCount){
        //   return false
        // }
        this.echartsInstance.hideLoading()
        this.echartsInstance.clear()
        this.echartsInstance.setOption(lineOption2)
      })
    },
    //导出数据获取
    exportData() {
     this.exportFun(this.tableData)
    },
     //导出功能
    exportFun(exportData) {
      let finalData = exportData.map(item=>{
        item.sn = this.info.labelName ? this.info.labelName :item.sn
        return item
      })
      let columns = [
        {
          label: '主机名称',
          prop: 'sn'
        },
        {
          label: '探头编号',
          prop: 'sensorNum'
        },
        {
          label: '时间',
          prop: 'createTime'
        },
        {
          label: '监测类型',
          prop: 'typeName'
        },
        {
          label: '监测值',
          prop: 'alarmValue'
        },
        {
          label: '报警类型',
          prop: 'alarmInfo'
        }
       ]
       let lname = this.info.labelName ? this.info.labelName : this.info.sn
      let exprotName = `${lname}-${this.info.snNum}-${this.dateRange[0]}-${this.dateRange[1]}`
      this.$export.excel({
        columns,
        data: finalData,
        title: exprotName
      }).then(() => {
        this.$message.success('导出表格成功')
      })
    },
    //切换年月
    selectChange (val) {
      if(val == 'month'){
        this.dateSet.type = val
        this.dateSet.format = 'yyyy-MM'
        this.dateSet.placeholder = '请选择月份'
        this.dateSet.value = format('yyyy-MM',new Date())
      }else if(val == 'date'){
        this.dateSet.type = val
        this.dateSet.format = 'yyyy-MM-dd'
        this.dateSet.placeholder = '请选择天'
        this.dateSet.value = format('yyyy-MM-dd',new Date())
      }else {
        this.dateSet.type = val
        this.dateSet.format = 'yyyy'
        this.dateSet.placeholder = '请选择年份'
        this.dateSet.value = format('yyyy',new Date())
      }
      this.getEchartsData()
    },
     //选择日期
    datepickChange(val) {
      this.getEchartsData()
    },
  },
  beforeDestroy(){
    clearInterval(this.timer)
    // window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
.probe-detail {
  display: flex;
  flex-direction: column;
  height: calc(100% - 105px);
  padding:0 10px;
  .infos{
    margin-bottom: 10px;
  }
  .table-box, .echarts-box {
    flex:1;
    padding: 10px;
    margin-bottom: 10px;
  }
  .point-info {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    color: #fff;
    margin-bottom: 10px;
    .point-item {
      display: flex;
      flex: 0 0 25%;
      padding-left: 30px;
      margin-bottom: 20px;
      box-sizing: border-box;
    }
  }
  .echarts-warp, .table-warp {
      padding: 10px;
      position: relative;
      // flex: 1;
      height: 50%;
      margin-bottom: 10px;
    }
    .operat-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .filter-box {
      text-align: right;
      padding-right: 30px;
      margin: 10px 0;
    }
    .echart-tit {
      text-align: center;
      margin-bottom: -30px;
      color: #fff;
    }
}
</style>