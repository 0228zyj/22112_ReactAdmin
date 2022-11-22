/*
  进行local数据存储管理的工具模块
*/
import store from 'store'

const USER_KEY = 'user_key'
export default {
  /*
    保存user
  */
  saveUser(user){
    //  这是原生的写法
    // localStorage.setItem(USER_KEY,JSON.stringify(user))
    // 这是引用store库的写法
    store.set(USER_KEY,user)
  },
  /*
    读取user
  */
  getUser(){
    // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY)
  },
  /*
    删除user
  */
  removeUser(){
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  },
}