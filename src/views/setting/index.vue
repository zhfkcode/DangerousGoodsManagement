<template>
  <div class="seting-container">
    <el-container class="layout-cont">
      <el-aside width="200px">
        <el-menu :default-active='activeMenu' @select="menuSelect">
          <el-menu-item index="1">
            <span slot="title">公司信息配置</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">主机信息配置</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span slot="title">探头信息配置</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">地图信息配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <component :is="showComponent"></component>
      </el-main>
    </el-container>
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
import { setLogin }  from '@/request/device'
import companySet from './component/companySet'
import snSet from './component/snSet'
import sensorSet from './component/sensorSet'
import mapSet from './component/mapSet'
import {getLocalItem} from '@/utils/commonFuns'
export default {
  name: 'setting',
  components: {
    companySet,
    snSet,
    sensorSet,
    mapSet
  },
  data() {
    return {
      password: '',
      setFormDialog: true,
      activeMenu: '1',
      showComponent: 'companySet'
    }
  },  
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
    //设置密码
    ensureClick() {
      if(!this.password) {
        this.$message.warning('请输入设置密码')
        return false
      }
      const acc = getLocalItem('account')
      setLogin({super_password: this.password, username: acc}).then(res=>{
        this.setFormDialog = false;
      })
    },
    menuSelect(index) {
      this.activeMenu = index
      this.showComponent = index === '1' ? 'companySet' : index === '2' ? 'snSet' : index === '3' ? 'sensorSet' : index === '4' ? 'mapSet' : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.seting-container {
  .layout-cont {
    height: calc(100vh - 100px);
  }
}
</style>