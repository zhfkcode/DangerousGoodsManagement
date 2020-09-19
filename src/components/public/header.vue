<template>
  <div class="head-wrap">
    <ul class="menus">
      <router-link v-for="item in menus" :to="item.path" :key="item.path"  tag="li" class="menu-item">{{item.name}}</router-link>
    </ul>
    <h1 class="title">工厂危险化学品安全检测预警系统</h1>
    <h2 class="sub-title">--广州南乔化工厂</h2>
    <div class="date-weth">
      <div class="date">
        <div class="pick">
          <p>{{ date.year }}</p>
          <p class="week">{{ date.week }}</p>
        </div>
        <div class="time">{{ date.times }}</div>
      </div>
      <div class="weth">
        <i class="el-icon-heavy-rain"></i>
        <span class="desc">多云转小雨</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date: {
        year: '',
        week: '',
        times: ''
      },
      menus: [
        {path: '/index',name: '报警检测'},
        {path: '/alarm',name: '报警记录'},
        {path: '/hisData',name: '历史数据'},
        {path: '/setting',name: '系统设置'},
      ],
      timer: null
    }
  },
  created(){
    let that = this
    this.timer = setInterval(()=>{
      that.getCurrentDate()
    },1000)
  },
  methods: {
    getCurrentDate() {
      var myDate = new Date();
      var days = myDate.getDay();
      let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四','星期五','星期六']
      let formDate = this.format(myDate,'yyyy-MM-dd hh:mm:ss')
      let str = formDate.split(' ')
      this.date = {
        year: str[0],
        week: weekArr[days],
        times: str[1]
      }
      return {};
    },
    format (date,fmt) {
    var o = {
        "M+": date.getMonth() + 1,                   //月份
        "d+": date.getDate(),                        //日
        "h+": date.getHours(),                       //小时
        "m+": date.getMinutes(),                     //分
        "s+": date.getSeconds(),                     //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()                  //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}   

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
  }
  .sub-title {
    position: absolute;
    left: 50%;
    top: 45px;
    color: #fff;
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
  .weth {
    align-self: center;
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