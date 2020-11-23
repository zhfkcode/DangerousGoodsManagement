<template>
  <div class="head-wrap">
    <ul class="menus" v-if="!hiddenMenu">
      <router-link v-for="item in menus" :to="item.path" :key="item.path"  tag="li" class="menu-item">{{item.name}}</router-link>
    </ul>
    <h1 class="title" :class="{single: !subTitle}">工厂危险化学品安全监测预警系统</h1>
    <h2 class="sub-title" v-if="subTitle">——{{subTitle}}</h2>
    <div class="date-weth">
      <div class="date">
        <div class="pick">
          <p>{{ date.year }}</p>
          <p class="week">{{ date.week }}</p>
        </div>
        <div class="time">{{ date.times }}</div>
      </div>
      <div class="weth">
        <!-- <i class="el-icon-heavy-rain"></i> -->
        <!-- <span class="desc">多云转小雨</span> -->
        <iframe scrolling="no" src="http://tianqiapi.com/api.php?style=yd&skin=cake&color=fff&fontsize=14&align=center" frameborder="0" width="80%" height="25" allowtransparency="true"></iframe>
      </div>
      <el-dropdown class="set-drop">
        <span class="el-dropdown-link">
          <i class="el-icon-setting set-icon"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <p @click="logout">退出</p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import {format} from '../../utils/commonFuns';
import { getCompanyInfo } from '../../request/device'
export default {
  data() {
    return {
      date: {
        year: '',
        week: '',
        times: ''
      },
      subTitle: "",
      menus: [
        {path: '/index',name: '报警监测'},
        {path: '/alarm',name: '报警记录'},
        {path: '/hisData',name: '历史数据'},
        {path: '/setting',name: '系统设置'},
      ],
      timer: null,
      hiddenMenu: false
    }
  },
  created(){
    let that = this
    this.timer = setInterval(()=>{
      that.getCurrentDate()
    },1000)
    this.getCompanyInfo()
    // this.getCorrespond()
    if(this.$route.name == 'locationSetting') {
      this.hiddenMenu = true
    }
  },
  methods: {
    getCurrentDate() {
      var myDate = new Date();
      var days = myDate.getDay();
      let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四','星期五','星期六']
      let formDate = format('yyyy-MM-dd hh:mm:ss',myDate)
      let str = formDate.split(' ')
      this.date = {
        year: str[0],
        week: weekArr[days],
        times: str[1]
      }
      return {};
    },
    getCompanyInfo() {
      const acct = localStorage.getItem('account')
       getCompanyInfo({username: acct}).then(res=>{
        let data = res.data
        this.subTitle = data.companyName
      })
    },
    logout() {
      localStorage.removeItem('token')
      this.$message.success('退出登录')
      this.$router.push('/login')
    }
    // getCorrespond() {
    //   getCorrsponed().then(res=>{
    //     localStorage.setItem('corrponsd',JSON.stringify(res.data))
    //   })
    // }
  },
  beforeDestroy(){
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.head-wrap {
  height: 95px;
  background: url(../../assets/images/head_bg.png) no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  .title {
    color: #fff;
    text-align: center;
    font-size: 28px;
    line-height: 60px;
    font-weight: bold;
    &.single {
      line-height: 80px;
    }
  }
  .sub-title {
    position: absolute;
    left: 35%;
    top: 45px;
    color: #fff;
    width: 35%;
    text-align: right;
  }
  .date-weth {
    width: 23%;
    position: absolute;
    right: 25px;
    top: 10px;
    display: flex;
    color: #fff;
  }
  .date {
    display: flex;
    justify-content: center;
  }
  .pick {
    white-space: nowrap;
  }
  .weth {
    align-self: center;
    width: 80px;
  }
  .week {
    margin-top: 5px;
    text-align: justify;
    text-align-last: justify;
  }
  .time {
    font-size: 30px;
    margin: 0 15px;
  }
  .set-icon {
    font-size: 20px;
    margin-top: 10px;
    color: #fff;
  }
  .menus {
    position: absolute;
    top: 20px;
    left: 30px;
    display: flex;
    .menu-item {
      background: url(../../assets/images/route-bg.png) no-repeat center center;
      padding: 10px 20px;
      color:#fff ;
      background-size: 100% 100%;
      margin-right: 15px;
      cursor: pointer;
    }
    .router-link-exact-active {
      color: #46FDFE;
    }
  }
}
</style>