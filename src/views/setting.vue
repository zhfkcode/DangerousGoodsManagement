<template>
  <div class="setting">
    <div class="company-info box-border">
      <h2 class="com-title">公司信息设置</h2>
      <ul class="com-set">
        <li class="com-item">
          <label class="label">公司名称</label>
          <div class="input-box">
            <input type="text" class="inpt">
          </div>
        </li>
        <li class="com-item">
          <label class="label">检测种类</label>
          <div class="input-box">
            <input type="text" class="inpt">
          </div>
        </li>
        <li class="com-item">
          <label class="label">安全员</label>
          <div class="input-box">
            <input type="text" class="inpt">
          </div>
        </li>
        <li class="com-item">
          <label class="label">登录密码</label>
          <div class="input-box">
            <input type="password" class="inpt">
          </div>
        </li>
        <li class="com-item">
          <label class="label">设置密码</label>
          <div class="input-box">
            <input type="password" class="inpt">
          </div>
        </li>
      </ul>
      <div class="boxfoot"></div>
    </div>
    <div class="det-set box-border">
      <h2 class="com-title">探测器参数设置</h2>
      <div class="content">
        <el-select v-model="houstNum" placeholder="请选择主机编号" style="margin-right: 20px">
          <el-option v-for="(item,indx) in hostList" :value="item.id" :label="item.name" :key="indx"></el-option>
        </el-select>
        <el-select v-model="headNum" placeholder="请选择探头编号" :disabled="Boolean(!hostList.length)">
          <el-option v-for="(item,indx) in headList" :value="item.id" :label="item.name" :key="indx"></el-option>
        </el-select>
        <ul class="com-set location">
          <li class="com-item">
            <label class="label">位置名称</label>
            <div class="input-box">
              <input type="text" class="inpt">
            </div>
          </li>
        </ul>
      </div>
      <div class="boxfoot"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      houstNum: '',
      headNum: '',
      hostList: [],
      headList: [],
    }
  }
}
</script>
<style lang="scss" scoped>
.setting {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 105px);
  .det-set {
    flex: 1;
    margin-bottom: 10px;
    .content {
      text-align: center;
    }
    .location {
      margin-top: 20px;
    }
  }
  .company-info{
    flex: 1;
    margin-bottom: 10px;
  }
  .com-set {
    width: 50%;
    margin: 0 auto;
    .com-item {
      padding: 5px 10px;
      margin-bottom: 20px;
      display: flex;
    }
    .label {
      width: 80px;
      font-size: 16px;
      color: #DCF6FF;
      line-height: 40px;
      margin-right: 20px;
    }
    .input-box {
      flex: 1;
      position: relative;
      .inpt {
        width: 100%;
        height: 40px;
        border: 1px solid rgba(26, 150, 236, 0.5);
        outline: none;
        border-radius: 3px;
        background: transparent;
        color: #fff;
        padding: 0 15px;
        box-sizing: border-box;
      }
      &::before,&::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 26px;
        top: 7px;
        background:rgba(26, 150, 236, 0.5);
      }
      &::before {
        left: -2px;
      }
      &::after {
        right: -2px;
      }
    }
  }
}
</style>