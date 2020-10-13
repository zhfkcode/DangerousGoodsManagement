<template>
  <div class="detection">
    <!-- 图表区域 -->
    <div class="echarts-warp box-border" ref="echartsWrap">
      <h2 class="com-title">历史曲线</h2>
      <div class="filter-box">
         <h2 class="echart-tit">{{dateSet.value}}</h2>
        <el-cascader v-model="echFilter.casValue" @change="cascaderChange" :props="props" :options="cascaderOpt" class="mar-20" size='small' placeholder="请选择主机/探头"></el-cascader>
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
    <!-- 表格区域 -->
    <div class="table-warp box-border">
      <h2 class="com-title">历史数据</h2>
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
          <el-button class="wid-120" type="primary" @click="serchClick()" >搜索</el-button>
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
          prop="currentValue"
          label="监测值"
          align="center"
        />
      </el-table>
      <div class="pages-box">
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
import { lineOption2 } from '../utils/eOptions'
import { format , corresponed, corresFuns} from '../utils/commonFuns'
import { getAllMainNum, getCorrespondSn,getAllHistory,getHistoryFilter,getHistEchart }  from '../request/device'
let _ = require('lodash')
export default {
  data() {
    return {
      option: lineOption2,
      echFilter: {
        dateValue: '',
        casValue: []
      },
      //及联参数：
      cascaderOpt: [],
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad
      },
        //主机编号
      dateSet: {
        value: '',
        select: 'month',
        type: 'month',
        format: 'yyyy-MM',
        placeholder: '选择月份'
      },
      serchInfo: {
        dateRange:[],
        mainId: []
      },
      pages: {
        pageNum: 1,
        pageSize: 50,
        total: 0
      },
      tableData: [],
      tableHeight: null,
      echartsInstance: null,
      searchModal: false,
      corrList: []
    }
  },
  created(){
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
      // this.getAlarTable()
    this.echartsbuild()
    this.getTableHeight()
    // this.getAllMainId()
  },
  computed:{
    chartsName(){
      return this.dateSet.type == "month" ? '月份' : this.dateSet.type == "year" ? '年份' : '天'
    }
  },
  methods:{
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
      this.tableHeight = this.$refs.echartsWrap.clientHeight -140 + 'px'
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
    //换页
    curChange(page) {
      this.pages.pageNum = page
      this.searchModal ? this.getSearch() : this.getAlarTable()
    },
    //页数change
    sizeChange(size) {
      this.pages.pageNum = 1
      this.pages.pageSize = size
      this.searchModal ? this.getSearch() : this.getAlarTable()
    },
    //获取echarts数据
    getEchartsData() {
      if(!this.dateSet.value  || !this.echFilter.casValue.length) {
        return 
      }
      //取消重复请求
       if (typeof this.cancelAjax === 'function') {
          this.cancelAjax()
        }
      let params={
        sn: this.echFilter.casValue[0],
        sensor_num: this.echFilter.casValue[1],
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
    //获取表格数据
    getAlarTable(download) {
       if(download){
          this.exportFun(this.tableData)
          return false
        }
      let pageNum = this.pages.pageNum-1
      let pagesize = this.pages.pageSize
      getAllHistory({page: pageNum, size: pagesize}).then(res=>{
        // console.log(res);
        this.tableData = res.data.content.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
        // this.tableData = res.data.content
        this.pages.total = res.data.totalElements
        this.$refs.table.bodyWrapper.scrollTop =0;
      })
    },
    //点击搜索按钮
    serchClick() {
      if(!this.serchInfo.mainId.length ||  !this.serchInfo.dateRange.length){
        this.$message.error('请填写完整查询条件')
        return false
      }
      this.pages.pageNum = 1
      this.getSearch()
    },
    //搜索数据
    getSearch(download) {
       if(download){
          this.exportFun(this.tableData)
          return false
        }
      this.searchModal = true
      let parms={
        sensor_num: this.serchInfo.mainId[1],
        sn: this.serchInfo.mainId[0],
        start_time: this.serchInfo.dateRange[0],
        end_time: this.serchInfo.dateRange[1],
        page: this.pages.pageNum - 1,
        size: this.pages.pageSize
      }
      getHistoryFilter(parms).then(res=>{
        //  if(download){
        //   this.exportFun(res.data.content)
        //   return false
        // }
         this.tableData = res.data.content.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
        // this.tableData = res.data.content
        this.pages.total = res.data.totalElements
        this.$refs.table.bodyWrapper.scrollTop =0;
      })
    },
    //导出数据获取
    exportData() {
     this.searchModal ? this.getSearch('download') : this.getAlarTable('download')
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
    //及联变化
    cascaderChange() {
      this.getEchartsData()
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
          prop: 'currentValue'
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
    background: transparent;
    color: #fff;
    width: 140px;
  }
  .echarts-warp, .table-warp {
    padding:0 10px 10px;
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