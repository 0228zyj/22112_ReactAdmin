/*
    能发送异步的Ajax请求的函数模块
    封装axios库
    该函数的返回值是promise对象
    1.优化：统一处理请求异常？
      做法：在外层包一个自己创建的promise对象
      在请求出错时，不去reject(error)，而是显示错误提示
    2.优化2：异步得到的不是response，而是response.data
      做法：在请求成功resolve时：resolve(response.data)
*/
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data={},type='GET'){
  return new Promise((resolve,reject)=>{
    let promise
    // 1. 执行异步Ajax请求
    if(type === 'GET'){ // 发GET请求
      promise = axios.get(url,{ // 配置对象
        params: data // params 指定请求的参数
      })
    }else { // 发POST请求
      promise = axios.post(url,data)
    }

    promise.then(response => {     // 2. 如果请求成功了，调用resolve(value)
      resolve(response.data)
    }).catch(error => {  // 3. 如果失败了，不调用reject(reason)，而是提示异常信息（直接在这里统一处理错误）
      // reject(error)
      message.error('请求出错了'+ error.message )
    })

  })


}

// 请求登陆接口
// ajax('/login', {username: 'Tom', passsword: '12345'}, 'POST').then()
// 添加用户
// ajax('/manage/user/add', {username: 'Tom', passsword: '12345', phone: '13712341234'}, 'POST').then()