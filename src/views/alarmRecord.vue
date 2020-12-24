<template>
  <div class="alarm-record">
    <!-- 地图区域 -->
    <div class="map-warp box-border" ref="mapWrap">
      <div class="switch-box">
        <span class="sitem " :class="{active:mapModel==1}" @click="switchModel(1)">地图</span>
        <span class="sitem" :class="{active:mapModel!=1}" @click="switchModel(2)">数表</span>
      </div>
      <div class="map-box" v-if="mapModel == 1">
        <img class="bk-img" ref="backImg" :src="backImg" alt="">
        <div class="pop-item" v-for="(item,index) in mapShowList" :key="index" :style="item | locStyle" @mouseenter="deteClick(item,'in')" @mouseleave="deteClick(item,'out')" @dblclick="jumbDetail(item)">
          <!-- <img class="picture" src="../assets/images/smokeDetector.png" alt="" @click="deteClick(index)"> -->
         <div class="item-tips" :class="{'animate-jumped':item.status == '异常',alarm: item.status == '异常',offline: item.status == '离线'}">
            <svgicon class="danger-icon" :icon-name="item.type | dangerType"></svgicon>
         </div>
         <p class="danger-text">{{item.currentValue+item.unit}}</p>
          <el-popover
            v-model="item.isShow"
            placement="bottom"
            :class="{'popo-top':item.yAxis > 80 }"
            >
            <ul class="point-info">
              <li class="point-item">
                <p class="point-label">探头编号：</p>
                <p>{{item.sensorNum}}</p>
              </li>
              <li class="point-item">
                <p class="point-label">主机名称：</p>
                <p>{{item.labName || item.sn}}</p>
              </li>
              <li class="point-item">
                <p class="point-label">监测种类：</p>
                <p>{{item.typeName}}</p>
              </li>
              <li class="point-item">
                <p class="point-label">Ⅰ级/上警值：</p>
                <p>{{item.levelOneLimited}}</p>
              </li>
              <li class="point-item">
                <p class="point-label">Ⅱ级值/下警值：</p>
                <p>{{item.levelTwoLimited}}</p>
              </li>
              <li class="point-item">
                <p class="point-label">位置：</p>
                <p>{{item.location}}</p>
              </li>
            </ul>
            <!-- <el-button slot="reference" >click 激活</el-button> -->
          </el-popover>
        </div>
      </div>
       <el-table
        v-else
        ref="table"
        :data="detetionList"
        :height='tableHeight'
        :default-sort = "{prop: 'sensorNum', order: 'descending'}"
        style="width: 100%">
        <el-table-column
          prop="sn"
          label="主机名称"
          width="170"
          sortable
          align="center"
          :sort-by="['sn','sensorNum']"
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
          prop="currentValue"
          label="监测值"
          align="center"
        />
        <el-table-column
          prop="levelOneLimited"
          label="Ⅰ级/下警限"
          align="center"
        />
        <el-table-column
          prop="levelTwoLimited"
          label="Ⅱ级/上警限"
          align="center"
        />
        <el-table-column
          prop="ranges"
          label="量程"
          align="center"
        />
        <el-table-column
          prop="unit"
          label="单位"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          sortable
          align="center"
        />
        <el-table-column
          prop="location"
          label="位置"
          width="170"
          align="center"
        />
      </el-table>
      <div class="boxfoot"></div>
    </div>
    <!-- 右边区域 -->
    <div class="right-warp">
      <!-- 视频区域 -->
      <div class="general  box-border">
        <h2 class="com-title center">概况</h2>
        <div class="gen-list">
          <div class="gen-item">
            <p class="name">监测种类：</p>
            <p class="cot">{{ survey.monitorType }}</p>
          </div>
          <div class="gen-item">
            <p class="name">监测点数量：</p>
            <p class="cot">{{ survey.controls }}</p>
          </div>
          <div class="gen-item">
            <p class="name">报警次数统计：</p>
            <p class="cot">{{ survey.alarmCounts }}</p>
          </div>
          <div class="gen-item">
            <p class="name">安全员：</p>
            <p class="cot">{{ survey.safetyOfficer }}</p>
          </div>
        </div>
        <p class="time-tips">账户有效期至{{survey.expiredTime}}</p>
        <div class="boxfoot"></div>
      </div>
      <!-- 滚动信息区域 -->
      <div class="infos  box-border">
        <h2 class="com-title center">警情提示</h2>
             <transition-group name="faded-transform" class="info-box" tag="ul" > 
              <li v-for="(item) in infos" :key="item.id" >
                <span>{{item.labName || item.sn}}/{{item.sensorNum}}</span>
                <span>{{item.regulation}}</span>
                <span>{{item.alarmInfo}}</span>
                <span>{{item.alarmTime}}</span>
              </li>
             </transition-group>
        <div class="boxfoot"></div>
      </div>
    </div>
    <!-- 提示音 -->
    <audio src="../assets/alarm.mp3" ref="audio"></audio>
  </div>
</template>
<script>
import { format, getImgNaturalDimensions, corresponed,corresFuns,getLocalItem } from '../utils/commonFuns'
 import mqtt from 'mqtt'
import { getCompanyInfo, getAlarmCount, getControlCount, getLastAlarm, getPicture } from '../request/device'
import { log } from 'util'
let _ = require('lodash')
export default {
  data() {
    return {
      infos: [],
      elPopover: false,
      client: null,
      msg: '',
      mapModel: 1,
      _MQTT: null,
      survey: {
        companyName: '',
        monitorType: '',
        safetyOfficer: '',
        alarmCounts: 0,
        controls: 0,
        expiredTime: ''
      },
      remeberClick: -1,
      detetionList: [],
      mapShowList: [],
      tableHeight: 0,
      backImg:'',
      timer: null,
      //位置偏移比率
      locRate: {
        x: 0,
        y: 0
      },
      corrList: [],
      username: ''
    }
  },
  mounted(){
    this.username = getLocalItem('account')
    const options = {
      connectTimeout: 40000,
      clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
      username: 'admin',
      password: '123456',
      clean: true
    }
    this._MQTT = mqtt.connect('ws://47.102.98.102:32976/mqtt', options)
    this.mqttConnect()
    corresponed((res)=>{
      this.corrList = res ? res : [] 
      this.getList()
    })
    // setInterval(() => {
    //   this.alarmAudio()
    // },5000)
  },
  methods:{
    getList(){
      const param = {
        username: this.username
      }
      getCompanyInfo(param).then(res=>{
        let data = res.data
         this.survey = {...this.survey,...data}
         let time = this.survey.expiredTime
         console.log(time,time.split(''));
         this.survey.expiredTime = time ? time.split(' ')[0] : '--'
      })
      // this.timer =  setInterval(()=>{
      //   this.getAllSen()
      // },2000)
      getAlarmCount(param).then(res=>{
      this.survey.alarmCounts = res.data
      })
      //获取最近报警信息
      getLastAlarm(param).then(res=>{
        this.infos = res.data.map((item)=>{
          item.labName = corresFuns(this.corrList,item.sn)
          return item
        })
        // this.mqttConnect()
      })
      //获取图片
      getPicture(param).then(res=>{
        this.backImg = res.data
        this.getAllSen()
      //  this.$nextTick(()=>{
      //     this.setCurLocation()
      //  })
      })
    },
    switchModel(type){
      if(type == this.mapModel) {
        return 
      }
      this.mapModel = type
      if(type == 1){
        window.onresize = null
      }else {
        window.onresize = _.debounce(() => {
          this.tableHeight = this.$refs.mapWrap.clientHeight -70 + 'px'
        }, 400)
        this.tableHeight = this.$refs.mapWrap.clientHeight -70 + 'px'
      }

    },
    //获取所有探头信息
    getAllSen() {
      getControlCount({username: this.username}).then(res=>{
        this.survey.controls = res.data.length
        this.detetionList = res.data.map(item=>{
          item.isShow = (this.remeberClick.sn == item.sn && this.remeberClick.sensorNum == item.sensorNum) ? true : false
          return item
        })
         this.$nextTick(()=>{
          this.setCurLocation()
       })
        // this.setLocation()
      })
    },
    mqttConnect() {
      // mqttMsg() {
        console.log('dingyue');
        this._MQTT.on('connect', (e) => {
          console.log("连接成功！！！")
          this._MQTT.subscribe('/push/alarm',{qos:1}, (error) => {
            if (!error) {
              console.log('订阅成功')
            } else {
              console.log('订阅失败')
            }
          })

        })
        // 接收消息处理
        this._MQTT.on('message', (topic, message) => {
          console.log('收到来自', topic, '的消息', message.toString())
          this.msg = message.toString()
          let msgs = JSON.parse( message.toString())
          msgs.alarmTime = format('yyyy-MM-dd hh:mm:ss',new Date(msgs.alarmTime))
          msgs.labName = corresFuns(this.corrList,msgs.sn)
          this.infos.pop()
          this.infos.unshift(msgs)
          this.searchItem(msgs)
          // this.alarmAudio()
        })
      // }
    },
    // 地图点点击
    deteClick(index,type){
      let  res = this.getIndex(this.mapShowList,index)
      let item = res.chid
      // let whatShow = item.isShow = !item.isShow
     let whatShow = item.isShow = type=="in" ? true : false
      this.$set(this.mapShowList,res.num,item)
      // let dex = this.remeberClick
      // if(dex>-1 && dex != index){
      //   let res1 = this.getIndex(this.mapShowList, dex)
      //   let item1 = res1.chid
      //   item1.isShow = false
      //   this.$set(this.mapShowList, res1.num, item1)
      // }
      this.remeberClick = whatShow ? index : {}
      
    },
    getIndex(list, id) {
      let num = ''
      let chid = list.filter((item,index) => {
        if(id.sn == item.sn && id.sensorNum == item.sensorNum) {
          num = index
        }
        return id.sn == item.sn && id.sensorNum == item.sensorNum
      })
      return {num,chid:chid[0]}
    },
    setCurLocation(items){
      let dom = this.$refs.backImg
      let w =dom.clientWidth 
      let h =dom.clientHeight 
      getImgNaturalDimensions(dom,(res)=>{
        let rateX = w/res.w
        let rateY = h/res.h
        this.locRate.x = rateX
        this.locRate.y = rateY
        this.setLocation()
      })
    },
    //设置位置
    setLocation(){
      this.mapShowList = this.detetionList.filter((item,index)=>{
        console.log('xaxis',item.xAxis);
        console.log('yAxis',item.yAxis);
        console.log('=============');
         if(item.xAxis) item.xAxis = item.xAxis * this.locRate.x
          if(item.yAxis) item.yAxis = item.yAxis * this.locRate.y
          console.log('--xaxis',item.xAxis);
        console.log('--yAxis',item.yAxis);
          this.corrList.map(ob=>{
            if(ob.sn == item.sn){item.labName=ob.snName}
          })
          return item.xAxis
        })
    },
    //查找项
    searchItem(item){
      let idx = 0
      let chidl = this.mapShowList.filter((it,i)=>{
        if(it.sn ==item.sn && it.sensorNum == item.sensorNum) {
          idx = i
        }
        return it.sn ==item.sn && it.sensorNum == item.sensorNum
      })
      chidl[0].status = '异常'
      this.$set(this.mapShowList, idx, chidl[0])
    },
    //跳转到详情页
    jumbDetail(item) {
      this.$router.push({path:'/probeDetail',query:{
        sn: item.sn,
        snNum: item.sensorNum,
        labelName: item.labName,
      }})
    },
    // 提示音
    alarmAudio() {
      try {
        this.$refs.audio.currentTime = 0; //从头开始播放提示音
        this.$refs.audio.play(); //播放
      } catch (error) {
        console.log(error);
      }
    }
  },
  beforeDestroy(){
    //连接断开
    // client.end()
    if(this._MQTT.end){this._MQTT.end()}
   clearInterval(this.timer)
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
    z-index: 100;
    // overflow: hidden;
    .switch-box {
      float: right;
      margin: 10px 20px 10px;
      display: flex;
      cursor: pointer;
      .sitem {
        padding: 10px 20px;
        border: 1px solid #1A96EC;
        color: rgba(255, 255, 255 ,.5);
        background: #409EFF;
        &:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        &:nth-child(2){
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        &.active {
          color: #fff;
        }
      }
    }
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
      left: 50%;
      top: 50%;
      text-align: center;
    }
    .point-label {
      white-space: nowrap;
    }
    .item-tips {
      display: inline-block;
      color: #00fc00;
      background:#1F3561;
      text-align: center;
      padding: 5px;
      border-radius: 50%;
      &.alarm {
        color: red;
      }
      &.alarm + .danger-text{
        color: red;
      }
      &.offline, &.offline + .danger-text {
        color: #FFA500;
      }
    }
    .danger-icon{
      font-size: 20px;
    }
    .danger-text{
      color: #00fc00;
      background:#1F3561;
      font-size: 12px;
      padding: 0 5px;
    }
    .point-item {
      display: flex;
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  .time-tips{
    margin-top: -10px;
    font-size: 12px;
    line-height: 12px;
    color: #d53b3b;
    text-align: center;
  }
  .general {
    margin-bottom: 10px;
  }
  .gen-list,.info-box {
    height: calc(100% - 45px);
    overflow: auto;
  }
  .gen-list {
    margin-left: 30px;
    padding-bottom: 20px;
  }
  .gen-item {
    padding: 10px ;
    display: flex;
    .name {
      font-size: 20px;
      color: #fff;
      line-height: 24px;
      flex-shrink: 0;
    }
    .cot {
      color: #bfbebe;
      line-height: 24px;
      font-size: 18px;
    }
  }
  .right-warp {
    // flex: 1;
    width: 25%;
    display: flex;
    flex-direction: column;
    .infos ,.general{
      flex: 1;
      overflow: auto;
    }
    .info-box li{
      display: flex;
      justify-content: space-around;
      padding: 5px 10px;
      color: #cd5d5d;
      font-size: 16px;
      line-height: 26px;
      background: #1B3560;
      margin-bottom: 5px;
    }
  }
    /* faded-transform */
  .faded-transform-leave-active,
  .faded-transform-enter-active {
    transition: all .5s;
  }

  .faded-transform-enter {
    opacity: 0;
    transform: translateY(-30px);
  }

  .faded-transform-leave-to {
    opacity: 0;
    transform: translateY(30px);
    // position: absolute;
    // width: 100%;
  }
}
</style>