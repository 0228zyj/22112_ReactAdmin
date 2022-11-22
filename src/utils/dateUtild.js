/*
  包含n个日期时间处理的工具函数模块
*/

/* 格式化时间的函数（我网上借鉴的） */
export function timestampToTime(times) {
  let time = times[1]
  let mdy = times[0]
  mdy = mdy.split('/')
  let month = parseInt(mdy[0]);
  let day = parseInt(mdy[1]);
  let year = parseInt(mdy[2])
  return year + '-' + month + '-' + day + ' ' + time
}

/* 格式化时间的函数（老师写好的） */
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}