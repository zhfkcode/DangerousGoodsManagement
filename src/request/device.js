import request from '@/utils/request'
import axios from 'axios'
/*******登录 */
// login
export function setLogin(data) {
  return request({
    url: '/sfcs/api/company/general/login',
    method: 'post',
    data
  })
}
// login
export function accountLogin(data) {
  return request({
    url: '/sfcs/api/login/account',
    method: 'post',
    data
  })
}
/******报警监测 */
//获取公司信息
export function getCompanyInfo(params) {
  return request({
    url: '/sfcs/api/company/get',
    method: 'get',
    params
  })
}
//获取报警总次数
export function getAlarmCount(params) {
  return request({
    url: '/sfcs/api/historyAlarm/get/count',
    method: 'get',
    params
  })
}
//获取报警点个数
export function getControlCount(params) {
  return request({
    url: '/sfcs/api/sensor/get/all',
    method: 'get',
    params
  })
}
//获取最近报警信息
export function getLastAlarm(params) {
  return request({
    url: '/sfcs/api/pushAlarm/get/last',
    method: 'get',
    params
  })
}
//获取图片url
export function getPicture(params) {
  return request({
    url: '/sfcs/api/company/query/picture',
    method: 'get',
    params
  })
}
//获取主机名称对应关系
export function getCorrsponed(params) {
  return request({
    url: '/sfcs/api/host/get/all',
    method: 'get',
    params
  })
}

/*******报警记录 */
//获取历史报警图表数据
export function getAlarmEcharts(data) {
  return request({
    url: '/sfcs/api/historyAlarm/query/count/by/date',
    method: 'post',
    data
  })
}
//获取历史报警表格数据
export function getAlarmTable(data) {
  return request({
    url: '/sfcs/api/historyAlarm/get/by/page',
    method: 'post',
    data
  })
}
//获取历史报警过滤数据
export function getAlarmFilter(data) {
  return request({
    url: '/sfcs/api/historyAlarm/query/by/time_sn_sensor',
    method: 'post',
    data
  })
}
/****历史记录 */
//获取历史记录echarts数据
const CancelToken= axios.CancelToken
export function getHistEchart(data, _this) {
  return request({
    url: '/sfcs/api/historyValue/query/values/by/date_sn_sensor',
    method: 'post',
    data,
    cancelToken: new CancelToken(function executor(c) {
      _this.cancelAjax = c
    })
  })
}
//获取所有主机编号
export function getAllMainNum(params) {
  return request({
    url: '/sfcs/api/sensor/get/all/sn',
    method: 'get',
    params
  })
}
//主机对应的探头所有
export function getCorrespondSn(data) {
  return request({
    url: '/sfcs/api/sensor/get/sensorNums/by/sn',
    method: 'post',
    data
  })
}
//表格所有数据
export function getAllHistory(data) {
  return request({
    url: '/sfcs/api/historyValue/get/by/page',
    method: 'post',
    data
  })
}
//筛选
export function getHistoryFilter(data) {
  return request({
    url: '/sfcs/api/historyValue/query/by/time_sn_sensor',
    method: 'post',
    data
  })
}
/*****信息设置 */
//更新公司信息
export function updataCompany(data) {
  return request({
    url: '/sfcs/api/company/update',
    method: 'post',
    data
  })
}
//更新位置信息
export function updataLocation(data) {
  return request({
    url: '/sfcs/api/sensor/update/location',
    method: 'post',
    data
  })
}
//更新别名信息
export function updataName(data) {
  return request({
    url: '/sfcs/api/host/update/snName',
    method: 'post',
    data
  })
}
//删除主机
export function deleteSn(data) {
  return request({
    url: '/sfcs/api/host/delete/by/sn',
    method: 'post',
    data
  })
}
//删除探头
export function deleteSensor(data) {
  return request({
    url: '/sfcs/api/sensor/delete/by/sn_sensorNum',
    method: 'post',
    data
  })
}

/****设备点位设置 */
//更新点位信息
export function modifyLoc(data) {
  return request({
    url: '/sfcs/api/sensor/update/axis',
    method: 'post',
    data
  })
}
//更新点位信息
export function picLoad(data,headers) {
  return request({
    url: '/sfcs/api/company/upload/picture',
    method: 'post',
    data,
    headers
  })
}

/***   详情页 */
export function probeInfos(data ){
  return request({
    url: '/sfcs/api/sensor/get/info/by/sn_sensorNum',
    method: 'post',
    data
  })
}