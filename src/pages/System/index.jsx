// 主页的容器组件
import React, { Component } from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import { Layout } from 'antd';
import Header from "../../components/Header";
import LeftNav from "../../components/LeftNav";
import './system.css'
import memoryUtils from "../../utils/memoryUtils";

const { Footer, Sider, Content } = Layout;
export default class System extends Component {

  render() {
    const user = memoryUtils.user
    // 如果内存中没有存储user ==> 当前没有登陆
    if(!user || !user._id) {
      // 自动跳转到登录页面
      return <Navigate to="/login" />
    }
    return (
      /*<div className="admin">
        <Header user={user.username}/>
        <div className="admin-content">
          <LeftNav/>
          <div className="admin-right" >
            {/!* 指定路由组件呈现的位置 *!/}
            <Outlet />
          </div>
        </div>
      </div>*/

      // <Layout style={{height:"100%"}}>
      <Layout style={{minHeight:"100%"}}>
        <Sider style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
          <LeftNav/>
        </Sider>
        <Layout className="site-layout" style={{marginLeft: 200,}}>
          <Header/>
          <Content style={{backgroundColor:"#fff",margin:20}}>
              {/*指定路由组件呈现的位置 */}
              <Outlet />
          </Content>
          <Footer style={{textAlign:"center",color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
