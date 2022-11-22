/*
    要求：能根据接口文档定义对应的接口请求函数
    包含应用中所有接口的请求函数的模块
    每个函数的返回值是promise对象

    基本要求: 能根据接口文档定义接口请求函数
*/
import {message} from 'antd'
import ajax from "./ajax";
import jsonp from 'jsonp'

/* 一、登录 */
/*
export function reqLogin(username,password) {
  return  ajax('/login',{username,password},'POST')
}*/
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

/* 二、品类管理 */
// 获取一级/二级分类的列表数据（这个数据，老师给的数据库中已经删除了）
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId})

// 添加分类（需要类别名称 和 类别Id）
export const reqAddCategory = (categoryName,parentId) => ajax('/manage/category/add', {categoryName, parentId},'POST')

// 更新分类（该分类对应的Id 和 新的类名）
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName},'POST')

/* 三、商品管理 */
// 获取商品分页列表
export const reqPageProducts = (pageNum,pageSize) => ajax('/manage/product/list', {pageNum,pageSize})

/*
  搜索商品分页列表（根据商品名称/商品描述）
  searchType：搜索的类型，productName/productDesc
*/
export const reqSearchPageProducts = ({pageNum,pageSize,searchName,searchType}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]:searchName,
})

// 搜索商品分页列表（根据商品描述）
/*export const reqSearchPageProducts2 = ({pageNum,pageSize,searchName}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  productDesc:searchName
})*/

// 更新商品的状态（上架/下架）
export const reqUpdateCategoryStatus = (productId,status) => ajax('/manage/product/updateStatus', {productId,status},'POST')

/* 详情页面 */
// 获取分类ID对应的分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name},'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/'+ (product._id? 'update':'add'), product,'POST')
// 修改商品
// export const reqUpdateProduct = (product) => ajax('/manage/product/update', product, 'POST')

/* 角色管理界面 */
// 获取所有的角色列表数据
export const reqRoles = () => ajax('/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')
// 设置角色权限
export const reqRolePemissions = (role) => ajax('/manage/role/update',role,'POST')


/* 用户管理界面 */
// 获取所有用户的列表数据
export const reqUsers = () => ajax('/manage/user/list')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'),user,'POST')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')


/*
  jsonp请求的接口请求函数（使用高德API获取天气数据信息）
*/
export const reqWeather = (cityAdcode)=> {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=5b366e0444f42423ac98674bde8953d4&city=${cityAdcode}`
    // 发送jsonp请求 350322
    jsonp(url, {}, (err, data) => {
      // console.log('jsonp()', err, data)
      // 如果成功了
      if (!err && data.status==='1') {
        // 取出需要的数据
        const {city,weather} = data.lives[0]
        resolve({city, weather})
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }
    })
  })
}
// reqWeather(350322)
/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
*/