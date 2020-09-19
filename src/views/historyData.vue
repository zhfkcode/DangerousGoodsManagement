<template>
  <div class="detection">
    <!-- 图表区域 -->
    <div class="echarts-warp box-border" ref="echartsWrap">
      <h2 class="com-title">图表区域</h2>
      <div class="filter-box">
        <el-select v-model='selectVal' @change="selectChange" class="datepick" placeholder="请选择探头">
          <el-option v-for="(item, index) in headList" :value='item.id' :label="item.name" :key="index"></el-option>
        </el-select>
         <el-date-picker
          @change="datepickChange"
          v-model="dateValue"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期">
        </el-date-picker>
      </div>
      <div id="echart" class="echarts"></div>
      <div class="boxfoot"></div>
    </div>
    <!-- 表格区域 -->
    <div class="table-warp box-border">
      <h2 class="com-title">表格区域</h2>
      <div class="operat-box">
        <div class="serach">
          <el-input style="width:250px;margin-right:20px" v-model="serchInfo.headId"></el-input>
           <el-date-picker
           style="margin-right:20px"
            v-model="serchInfo.dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
          <el-button class="export" type="primary">搜索</el-button>
        </div>
        <el-button class="export" type="primary">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        :height='tableHeight'
        style="width: 100%">
        <el-table-column
          prop="date"
          label="主机编号"
          align="center"
          />
        <el-table-column
          prop="name"
          label="探头编号"
          align="center"
          />
        <el-table-column
          prop="address"
          label="时间"
          align="center"
        />
        <el-table-column
          prop="address"
          label="检测类型"
          align="center"
        />
        <el-table-column
          prop="address"
          label="检测值"
          align="center"
        />
        <el-table-column
          prop="address"
          label="报警类型"
          align="center"
        />
      </el-table>
      <div class="boxfoot"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { lineOption } from '../utils/eOptions'
let _ = require('lodash')
export default {
  data() {
    return {
      option: lineOption,
      selectVal: '',
      dateValue: '',
      serchInfo: {
        dateRange:[],
        headId: ''
      },
      headList: [
        {
          name: '一号探头',
          id: 0
        },
        {
          name: '二号探头',
          id: 1
        },
        {
          name: '三号探头',
          id: 3
        }
      ],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tableHeight: null,
      echartsInstance: null
    }
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
      let height = this.$refs.echartsWrap.clientHeight -80 + 'px'
      let width = this.$refs.echartsWrap.clientWidth - 20 + 'px'
      dom.style.height = height
      dom.style.width = width
      this.echartsInstance = echarts.init(dom);
      // myChart.getDom().style.height = this.$refs.echartsWrap.clientHeight + 'px'
      if(res){
        this.echartsInstance.resize(width,height)
        return 
      }
      this.echartsInstance.setOption(this.option)
    },
    getTableHeight(){
      this.tableHeight = this.$refs.echartsWrap.clientHeight -100 + 'px'
    },
    selectChange () {
      
    },
    datepickChange(val) {
      console.log(val);
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
  .datepick {
    margin-right: 20px;
    background: transparent;
    color: #fff;
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
}
</style> 