<template>
  <div class="alarm-record">
    <!-- 地图区域 -->
    <div class="map-warp box-border" ref="mapWrap">
      <div id="map" class="echarts">
        <baidu-map class="bm-view" :center="{lng: 116.404, lat: 39.915}" :zoom="15" ak="PAkg53csYbo5O3CdmN4AoXRaWNNUDtVn" @ready="handler" :mapStyle="mapStyle" scroll-wheel-zoom @resize="resizeMap">
          <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" :icon="{url: require('../assets/images/smokeDetector.png'), size: {width: 20, height: 20},opts:{imageSize:{width: 20, height: 20}}}" @click="infoWindowOpen">
            <bm-info-window :show="show" @close="show=false" @open="show=true">
              <div class="map-info">危险品信息</div>
            </bm-info-window>
          </bm-marker>
          <!-- <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL" @click="clickHandler"></bm-point-collection> -->
        </baidu-map>
      </div>
      <div class="boxfoot"></div>
    </div>
    <!-- 右边区域 -->
    <div class="right-warp">
      <!-- 视频区域 -->
      <div class="video  box-border">
        <h2 class="com-title">视频区域</h2>
        <div class="video-box" ref="videoBox">
          <video-player  class="video-player vjs-custom-skin"
              ref="videoPlayer" 
              :playsinline="true" 
              :options="playerOptions"
          ></video-player>
          </div>
        <div class="boxfoot"></div>
      </div>
      <!-- 滚动信息区域 -->
      <div class="infos  box-border">
        <h2 class="com-title">信息区域</h2>
        <vue-seamless :data="infos" class="seamless-warp" style="height: 100%,overflow:hidden">
          <ul class="info-box">
             <!-- <transition-group name="fade-transform" class="info-box" tag="ul" > 
              <li v-for="(item) in infos" :key="item.id" >{{item.name}}</li>
             </transition-group> -->
             <li v-for="(item) in infos" :key="item.id" >{{item.name}}</li>
          </ul>
          </vue-seamless>
        <div class="boxfoot"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import bmMarker  from 'vue-baidu-map/components/overlays/Marker'
import bmInfoWindow  from 'vue-baidu-map/components/overlays/InfoWindow'
//video
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
 import vueSeamless from 'vue-seamless-scroll'
// let _ = require('lodash')
export default {
  data() {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3,
      points: [],
      show: false,
      mapStyle: {style:'midnight'},
      playerOptions: {},
      infos: []
    }
  },
  components: {
    BaiduMap,
    bmInfoWindow,
    // bmPointCollection
    bmMarker,
    videoPlayer,
     vueSeamless
  },
  mounted(){

     this.videoInit()
     this.initMap()
     this.scroll()
    //  setInterval(this.scroll,1000)
    // this.addPoints()
    // window.onresize = _.debounce(() => {
    //   }, 400)
  },
  methods:{
    infoWindowOpen(){
      this.show = true
    },
    handler ({BMap, map}) {
      this.initMap()
      console.log(BMap, map)
      // this.center.lng = 116.404
      // this.center.lat = 39.915
      this.zoom = 15
    },
     initMap(){
      let dom = document.getElementById('map');
      let height = this.$refs.mapWrap.clientHeight - 20 + 'px'
      let width = this.$refs.mapWrap.clientWidth - 20 + 'px'
      dom.style.height = height
      dom.style.width = width
    },
    addPoints () {
      const points = [];
      for (var i = 0; i < 10; i++) {
        const position = {lng: Math.random() * 40 + 85, lat: Math.random() * 30 + 21}
        points.push(position)
      }
      this.points = points
    },
    clickHandler (e) {
      alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
    },
    videoInit() {
      let dom = this.$refs.videoBox
      let hei = dom.clientHeight
      let wid = dom.clientWidth
      console.log(dom,hei,wid);
      this.playerOptions= {
        muted: true,
        language: 'en',
        //  fluid: true,
         width: wid,
         height: hei,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: "video/mp4",
          src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        poster: "/static/images/author.jpg",
      }
      this.$refs.videoPlayer.player
    },
    scroll(){
      for (let index = 0; index < 10; index++) {
        this.infos.push({name: 'a'+index,id:index})
      }
    },
    resizeMap(t){
      console.log(t);
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
    padding: 10px;
    flex: 2;
    margin-right: 20px;
    .map-info {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .bm-view {
    height: 100%;
  }
  .right-warp {
    flex: 1;
    display: flex;
    flex-direction: column;
    .video {
      flex: 1;
      margin-bottom: 20px;
    }
    .video-box {
      position: relative;
      height: calc(100% - 40px);
    }
    .video-player {
      position: absolute;
      width: 100%;
      height: 100%;
      // width: 100%;
      // height: 100%;
    }
    .infos {
      flex: 1;
    }
    .info-box {
      // height: 170px;
      // position: relative;
      // overflow: hidden;
    }
    .info-box li{
      display: flex;
      justify-content: space-around;
      padding: 5px 10px;
      color: #fff;
      background: rgba(0, 0 ,0 ,0.5);
      margin-bottom: 5px;
    }
    .seamless-warp {
      height: 270px;
      overflow: hidden;
    }
  }
    /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateY(30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateY(-30px);
    // position: absolute;
    // width: 100%;
  }
}
</style>