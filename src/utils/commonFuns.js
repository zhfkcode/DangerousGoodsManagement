import {getCorrsponed} from '../request/device'
export  function format (fmt,date) {
   var o = {
       "M+": date.getMonth() + 1, //月份
       "d+": date.getDate(), //日
       "h+": date.getHours(), //小时
       "m+": date.getMinutes(), //分
       "s+": date.getSeconds(), //秒
       "q+": Math.floor((date.getMonth() + 3) / 3), //季度
       "S": date.getMilliseconds() //毫秒
   };
   if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
   for (var k in o)
       if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
   return fmt;
}
export function getImgNaturalDimensions(oImg, callback) {
    　　var nWidth, nHeight;
    // 　　if (!oImg.naturalWidth) { // 现代浏览器
    //     console.log('nature');
    // 　　　　nWidth = oImg.naturalWidth;
    // 　　　　nHeight = oImg.naturalHeight;
    // 　　　　callback({w: nWidth, h:nHeight});
    
    // 　　} else { // IE6/7/8
    　　　　var nImg = new Image();
    
            nImg.onload = function() {
                 var nWidth = nImg.width,
                     nHeight = nImg.height;
               callback({w: nWidth, h:nHeight});
    　　　　}
    　　　　nImg.src = oImg.src;
    // 　　}
    }
    export function corresponed (callback) {
        const acct = getLocalItem('account')
        getCorrsponed({username: acct}).then(res => {
            // list.map(item=>{
            //     if(item.sn == val){
            //         item.labelName=item.snName
            //     }
            // })
            callback(res.data)
          })
    }
//     export function corresFuns(list, val) {
//         let labeName = ""
//          list.map((item)=>{
//                 if(item.sn == val){
//                     labeName = item.snName
//                 }
//         return labeName
//     }
// }
export function corresFuns(list, val){
    let labeName = ""
    list.map((item)=>{
        if(item.sn == val){
            labeName = item.snName
        }
    })
    return  labeName
}
export function getLocalItem(name) {
    return localStorage.getItem(name)
}
export function rmLocalItem(name) {
    return localStorage.removeItem(name)
}