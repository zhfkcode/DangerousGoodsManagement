<template>
  <div class="detection">
    <!-- 图表区域 -->
    <div class="echarts-warp box-border" ref="echartsWrap">
      <h2 class="com-title">报警曲线</h2>
      <div class="filter-box">
        <h2 class="echart-tit">{{dateSet.value}}</h2>
        <el-select v-model='dateSet.mainType' @change="typeSelectChange" size='small' style="width: 85px;" class="mar-20">
          <el-option value='all' label="全部"></el-option>
          <el-option value='single' label="单个"></el-option>
        </el-select>
         <el-cascader :disabled="dateSet.mainType == 'all'" v-model="dateSet.mainId" :props="props" :options="cascaderOpt" @change="elcaspChange" class="mar-20" size='small' placeholder="请选择主机/探头"></el-cascader>
        <el-select v-model='dateSet.select' @change="selectChange" size='small' style="width: 85px;">
          <el-option value='year' label="年份"></el-option>
          <el-option value='month' label="月份"></el-option>
        </el-select>
        <el-date-picker
          class="datepick"
          @change="datepickChange"
          v-model="dateSet.value"
          size='small'
          :type="dateSet.type"
          :value-format="dateSet.format"
          :placeholder="dateSet.placeholder">
        </el-date-picker>
      </div>
      <div id="echart" class="echarts"></div>
      <div class="boxfoot"></div>
    </div>
    <!-- 表格区域 -->
    <div class="table-warp box-border">
      <h2 class="com-title">报警数据</h2>
      <div class="operat-box">
        <div class="serach">
         <el-cascader v-model="serchInfo.mainId" :props="props" :options="cascaderOpt" class="mar-20" size='small' placeholder="请选择主机/探头"></el-cascader>
           <el-date-picker
           size='small'
           style="margin-right:20px;width: 250px;"
            v-model="serchInfo.dateRange"
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
      <div class="pages-box" v-if="!searchModal">
          <el-pagination
          :current-page="pages.pageNum"
          :total="pages.total"
          @current-change="curChange"
          @size-change="sizeChange"
          :page-sizes="[50,100, 200, 300, 400,500]"
          :page-size="50"
          layout="sizes, prev, pager, next"
          >
        </el-pagination>
      </div>
      <div class="boxfoot"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { lineOption } from '../utils/eOptions'
import { format, corresponed,corresFuns,getLocalItem } from '../utils/commonFuns'
import { getAlarmEcharts, getAlarmTable, getAlarmFilter, getAllMainNum, getCorrespondSn } from "../request/device";
let _ = require('lodash')
export default {
  data() {
    return {
      option: lineOption,
      dateSet: {
        mainType: 'all',
        mainId: [],
        value: '',
        select: 'month',
        type: 'month',
        format: 'yyyy-MM',
        placeholder: '选择月份'
      },
      serchInfo: {
        dateRange:[],
        mainId: ''
      },
      pages: {
        pageNum: 1,
        pageSize: 50,
        total: 0
      },
      tableData: [],
      tableHeight: null,
      echartsInstance: null,
      searchModal: false, //是否是搜索
      cascaderOpt: [],  //及联数据
       props: {       //及联设置
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      corrList: [],
      username: ''
    }
  },
  created(){
    this.username = getLocalItem('account')
     corresponed((res)=>{
      this.corrList = res ? res : [] 
      this.getAlarTable()
      this.getAllMainId()
    })
  },
  mounted(){
    window.onresize = _.debounce(() => {
        this.echartsbuild(true)
        this.getTableHeight()
      }, 400)
    this.echartsbuild()
    this.getTableHeight()
  },
  methods:{
    echartsbuild(res) {
      let dom = document.getElementById('echart');
      let height = this.$refs.echartsWrap.clientHeight -100 + 'px'
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
    //切换年月
    selectChange (val) {
      if(val == 'year'){
        this.dateSet.type = val
        this.dateSet.format = 'yyyy'
        this.dateSet.placeholder = '请选择年份'
        this.dateSet.value = format('yyyy',new Date())
      }else {
        this.dateSet.type = val
        this.dateSet.format = 'yyyy-MM'
        this.dateSet.placeholder = '请选择月份'
        this.dateSet.value = format('yyyy-MM',new Date())
      }
      this.getEchartsData()
    },
    //选择日期
    datepickChange(val) {
      this.getEchartsData()
    },
    //换页
    curChange(page) {
      this.pages.pageNum = page
      this.getAlarTable()
    },
    //页数change
    sizeChange(size) {
      this.pages.pageNum = 1
      this.pages.pageSize = size
      this.getAlarTable()
    },
    //获取echarts数据
    getEchartsData() {
      let mainHead = this.dateSet.mainId
      let params = {
        date:this.dateSet.value,
        type:this.dateSet.type,
        sensor_num: mainHead[1] ? mainHead[1] : '',
        sn: mainHead[0] ? mainHead[0]: '',
        status: this.dateSet.mainType
      }
       getAlarmEcharts(params).then(res=>{
        let eData = res.data
        let xData = []
        let yData = []
        // let count = 1
        if(this.dateSet.type=='year'){
          yData = [eData.jan,eData.feb,eData.mar,eData.apr,eData.may,eData.jun,eData.jul,eData.aug,eData.sept,eData.oct,eData.nov,eData.dec]
          xData = yData.map((item,index)=>{return index+1})
        }else {
          for (let i = 1;i < eData.dayNum+1 ;i++) {
            if (eData.hasOwnProperty('d'+i)) {
              const element = eData['d'+i];
              xData.push(i)
              yData.push(element)
            }
          }
        }
        lineOption.xAxis[0].data = xData
        // lineOption.xAxis.name = this.dateSet.type
        // lineOption.series[0].name = this.dateSet.type=='month' ? '日' : '月份'
        let forName = this.dateSet.type=='month' ? '日' : '月'
        lineOption.tooltip.formatter = `{b0}${forName} : {c0}`
        lineOption.series[0].data = yData
        lineOption.series[1].data = yData
        // lineOption.yAxis[0].name = '浓度'
        this.echartsInstance.clear()
        this.echartsInstance.setOption(lineOption)
      })
    },
    //获取表格数据
    getAlarTable(download) {
      let pageNum = download ?  0 : this.pages.pageNum-1
      let pagesize = download ?  this.pages.total : this.pages.pageSize
      getAlarmTable({page: pageNum, size: pagesize,username: this.username}).then(res=>{
        // console.log(res);
        if(download){
          let exportData = res.data.content.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
          this.exportFun(exportData)
          return false
        }
        this.tableData = res.data.content.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
        this.pages.total = res.data.totalElements
        this.$refs.table.bodyWrapper.scrollTop =0;
      })
    },
    getSearch() {
      if(!this.serchInfo.mainId.length || !this.serchInfo.dateRange.length){
        this.$message.error('请填写完整查询条件')
        return false
      }
      this.searchModal = true
      let parms={
        sensor_num: this.serchInfo.mainId[1],
        sn: this.serchInfo.mainId[0],
        start_time: this.serchInfo.dateRange[0],
        end_time: this.serchInfo.dateRange[1]
      }
      getAlarmFilter(parms).then(res=>{
        // console.log(res);
        this.tableData = res.data.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
        this.$refs.table.bodyWrapper.scrollTop =0;
      })
    },
    //导出数据获取
    exportData() {
     this.searchModal ? this.exportFun(this.tableData) : this.getAlarTable('download')
    },
     //导出功能
    exportFun(exportData) {
      let finalData = exportData.map(item=>{
        item.sn = item.labName ? item.labName :item.sn
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
        let exprotName = ''
       if(this.searchModal){
         let lName = corresFuns(this.corrList,this.serchInfo.mainId[0])
         lName = lName ? lName : this.serchInfo.mainId[0]
          exprotName = `${lName}-${this.serchInfo.mainId[1]}-${this.serchInfo.dateRange[0]}-${this.serchInfo.dateRange[1]}-${this.pages.pageNum}`
       }else{
          exprotName =`${exportData[0].createTime}-${exportData[exportData.length-1].createTime}-${this.pages.pageNum}` 
       }
       this.$export.excel({
        columns,
        data: finalData,
        title: exprotName
      }).then(() => {
        this.$message.success('导出表格成功')
      })
    },
     //获取所有主机编号
    getAllMainId() {
      getAllMainNum({username: this.username}).then(res=>{
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
    //及联方法
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
    //折线类型徐阿泽
    typeSelectChange (){
      if(this.dateSet.mainType == 'single'){
        return false
      }
      this.dateSet.mainId = []
      this.getEchartsData()
    },
    //折线探头选择
    elcaspChange (){
      this.getEchartsData()
    }
  },
  beforeDestroy(){
    window.onresize = null
  }
}
</script>
<style lang="scss" scoped>
.detection {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 105px);
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
  .datepick {
    margin-left: 20px;
    background: transparent;
    color: #fff;
    width: 120px;
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
  .pages-box {
    margin-top: 10px;
  }
}
</style>