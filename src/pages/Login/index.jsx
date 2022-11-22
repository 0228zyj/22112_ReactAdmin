// 登陆页面的所有组件
import React from 'react'
import {useNavigate,Navigate} from 'react-router-dom'
import { Button,Input,Form,message } from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';
import {reqLogin} from '../../api'
import './login.css'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

/*
登陆的路由组件
 */
export default function Login () {

  const navigate = useNavigate()

  // 点击提交按钮时，默认会将每个表单项的值封装成一个对象，传递到该函数中（提交表单且数据验证成功后该回调事件才会触发）
  const onFinish = async (values) => {
    // console.log('Received values of form: ', values);
    const {username,password} = values

    // 进一步验证表单数据与后台数据是否一样（需要发送Ajax请求）
    // 请求登录  // alt + <-
    /*reqLogin(username,password).then(response => {
      console.log('成功了',response.data);
    }).catch(error => {
      console.log('失败了',error);
    })*/

    const result = await reqLogin(username,password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
    // console.log('请求成功了',result);
    if(result.status === 0){ // 登录成功
      // 提示登录成功
      message.success('登录成功')

      // 保存user
      const user = result.data
      memoryUtils.user = user // 保存在内存中
      storageUtils.saveUser(user) // 保存到local中

      // 跳转到管理界面
      navigate(`/system/home`)
      /*
        登录成功时：
          解放方案一：
            将username的值传递给后台管理界面头部组件的用户名的框（可以使用消息订阅功能）
          解决方案二：

      */

    }else { // 登录失败
      // 提示错误信息
      message.error(result.msg)
    }

  }

  /* 对密码进行自定义验证规则 */
  /*
    用户名/密码的的合法性要求
      1). 必须输入
      2). 必须大于等于4位
      3). 必须小于等于12位
      4). 必须是英文、数字或下划线组成
   */
  const validatePwd = (_, value) => {
    // console.log('validatePwd()', rule, value)
    if(!value) {
      return  Promise.reject(new Error('密码必须输入!'));
    } else if (value.length<5) {
      return  Promise.reject(new Error('密码长度不能小于4位'));
    } else if (value.length>12) {
      return  Promise.reject(new Error('密码长度不能大于12位'));
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return  Promise.reject(new Error('密码必须是英文、数字或下划线组成'));
    } else {
      return Promise.resolve();
    }
  }

  // 如果用户已经登陆, 自动跳转到管理界面
  const user = memoryUtils.user
  if(user && user._id) {
    return <Navigate to="/system" />
  }
  return (
    <div className="bg">
      <div className="header-container">
        <div className="login-header">
          <img src={require('../../asset/images/logo.png')} alt="项目logo"/>
          <h1>React项目：后台管理系统</h1>
        </div>
      </div>
      <div className="login">
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          {
            /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
           */
          }
          {/*
              配置对象: 属性名是特定的一些名称
              声明式验证: 直接使用别人定义好的验证规则进行验证
          */}
          <Form.Item
            name="username"
            initialValue="admin" // 指定初始值
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入你的用户名!',
              },
              {
                min: 5,
                message: '用户名至少5位',
              },
              {
                max: 11,
                message: '用户名至多11位',
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: '用户名必须是英文、数字或下划线组成',
              },
            ]}
          >
            <Input className="input" prefix={<UserOutlined className="site-form-item-icon" style={{color:"#BFBFBF"}}/>} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                validator: validatePwd,
              },
            ]}
          >
            <Input
              className="input"
              prefix={<LockOutlined className="site-form-item-icon" style={{color:"#BFBFBF"}}/>}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button btn">登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

/*
* 1.前台表单验证
* 2.收集表单数据
* */

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 为了不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */
