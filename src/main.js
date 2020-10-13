import Vue from 'vue'
import 'normalize.css/normalize.css' 
import App from './App.vue'
import router from './router'
// import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
// import { uniqueId } from 'lodash'
// 导出引入依赖
import $export from './utils/exportTable/index'
import './styles/iconfont/iconfont'
import SvgIcon from './components/public/svgicon.vue'

Vue.use(ElementUI)
Vue.component('svgicon',SvgIcon)
Vue.config.productionTip = false
Vue.prototype.$export = $export
Vue.prototype.$bus = new Vue()

// Vue.filter("corrspond", function (val) {  //保留小数位，acc为保留几位小数位
//   let res = localStorage.getItem('corrponsd')
  
//   let corList = res ? JSON.parse(res):[]
//   let labelName = ""
//   corList.filter(item=>{
//     if(item.sn == val){labelName=item.snName}
//   })
//   console.log(res,val,labelName);
//   return labelName?labelName:val
// });
new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
