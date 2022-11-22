import React from 'react'
import {useNavigate,Link,useLocation} from 'react-router-dom'
import { Menu } from 'antd'
import menuList from "../../config/menuConfig"
import memoryUtils from "../../utils/memoryUtils";
import './left_nav.css'

/* 左侧导航栏组件 */
export default function LeftNav(){

  const navigate = useNavigate()
  const location = useLocation()
  /*
      这里没有使用到state状态属性。但是也同样可以实现点击按钮时，界面的变更，这是原生的默认的行为。
      因为当你进行路由跳转时，页面的所有样式和标签默认会重新渲染。
      并且当你刷新页面的时候，页面的所有样式和标签默认会重新渲染。
  */
  let path = location.pathname
  let reg1 = new RegExp("/system/","g");
  path = path.replace(reg1,"")
  if(path.indexOf('product') === 0){ // 当前请求的是商品管理页面或其添加商品、修改商品的子路由界面
    path = 'product'
  }
  let openKey = '' // 如果是空字符串表示，不需要展开。有值的话是展开对应的key的项

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  /*
    根据menu的数据数组生成对应的 getItem() 数组:
      使用 map + 递归调用
  */
  const getItemList_map = (menuList)=>{
    return menuList.map( item => {
      if(!item.children) {  // 如果不存在子菜单
        return (
          getItem(item.title, item.key, item.icon)
        )
      } else { // 如果存在子菜单
        return (
          getItem(item.title, item.key, item.icon, getItemList_map(item.children))
        )
      }
    })
  }

  /*
    判断当前登陆用户对item是否有权限
    (以当前用户的menus为基准,将每个item的key值进行判断是否在该用户的menus中存在,若存在则返回true)
  */
  const hasAuth = (item) =>{
    const {key,isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
      1. 如果当前用户是admin,则立马返回true(因为admin默认显示全部)
      2. 如果当前item是公开的(则返回true)
      3. 当前用户有此item的权限: 判断key有没有在menus中(有则返回true)
    */ 
    if(username === "admin" || isPublic || menus.indexOf(key) !==-1){
      return true
    }else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !==-1) // !!表示强制转换为bool值
    }

    return false
  }

  /*
    根据menu的数据数组生成对应的 getItem() 数组:
      使用 reduce + 递归调用
  */
  const getItemList_reduce = (menuList)=>{
    return menuList.reduce((pre,item) => {
      // 如果当前用户有item对应的权限, 才能显示对应的菜单项
      if(hasAuth(item)){ 
        // 向pre添加<Menu.Item>
        if(!item.children) {
          pre.push(
            getItem(item.title, item.key, item.icon)
          )
        } else {

          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            openKey = item.key
          }

          // 向pre添加<SubMenu>
          pre.push(
            getItem(item.title, item.key, item.icon, getItemList_reduce(item.children))
          )
        }
      }
      return pre
    },[])
  }

  /*[
      getItem('首页', 'home', <HomeOutlined />),
      getItem('商品', 'commodity', <AppstoreOutlined />, [
        getItem('品类管理', 'category',<UnorderedListOutlined />),
        getItem('商品管理', 'product',<ToolOutlined />),
      ]),
      getItem('用户管理', 'user', <UserOutlined />),
      getItem('角色管理', 'role', <SafetyOutlined />),
      getItem('图形图表', 'charts', <AreaChartOutlined />, [
        getItem('柱形图', 'charts/column_chart',<BarChartOutlined />),
        getItem('折线图', 'charts/line_chart',<LineChartOutlined />),
        getItem('饼图', 'charts/pie_chart',<PieChartOutlined />),
      ]),
      getItem('订单管理', 'order', <WindowsOutlined />),
    ]*/
  /* 函数式组件没有componentWillMount这个生命周期函数对应的Hooks函数。并且这里也使用了跳转路由时，页面上的组件会重新渲染的特性*/
  const items = getItemList_reduce(menuList)

  /*
      老师是使用Link组件包装Menu.Item标签实现路由跳转。
      我这里因为是最新版的antd和路由，所以使用编程式路由跳转
  */
  const onClick = (e) => {
    const key = e.key
    navigate(`/system/${key}`)
  };

  return (
    <div style={{width: "100%",height:"100%"}}>
      <Link to="/system" className="left-nav-header">
        <img src={require('../../asset/images/logo.png')} alt="logo图标" />
        <h3>硅谷后台</h3>
      </Link>
      <Menu
        onClick={onClick}
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
        mode="inline"
        items={items}
        theme="dark"
      />
    </div>
  )

}

/*
     重点知识：
       在路由跳转时，公共组件默认会重新渲染；并且当你刷新页面的时候，所有组件也默认会重新渲染
         如果你要解决这个问题：
            使用diff算法。diff算法是react的核心思想。
            当你添加了一个key之后，因为react在重新渲染时，会比较组件是否发生了变更，diff算法包括组件diff,element diff，还有dom树diff。
            有了key作为标识，react能很快的计算出是否需要重新渲染，如果没有添加key，默认就重新渲染。
*/