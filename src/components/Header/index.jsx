import React, { useState , useEffect ,} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { Button , Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import './header.css'
import storageUtils from "../../utils/storageUtils";
import {timestampToTime} from '../../utils/dateUtild'
import memoryUtils from "../../utils/memoryUtils";
import menuList from "../../config/menuConfig";
import {reqWeather} from '../../api'


const { confirm } = Modal;

export default function Header(){

  const [time,setTime] = useState(timestampToTime((new Date()).toLocaleString('en-US',{hour12: false}).split(" ")))
  const [city,setCity] = useState('') // 所在城市（这里的城市是死数据）
  const [weather,setWeather]= useState('') // 天气的文本
  const navigate = useNavigate()
  const location = useLocation()

  /*
      使用useLocation来获取当前的url来实现标题的更新（并且借助当进行路由跳转时，页面的所有组件会重新渲染的特性）
  */
  // 获取头部组件的标题
  const getTitle = () => {
    // 得到当前请求路径
    let path = location.pathname
    let reg1 = new RegExp("/system/","g");
    path = path.replace(reg1,"")
    let title
    menuList.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) { // 如果当前item对象的key与path不一样,则在对有children属性的item在进行判断
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果cItem有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }

  // 调用请求api，获取当前的天气
  const getWeather = async () => {
    // 调用接口请求，异步获取数据
    const {city, weather} = await reqWeather(350322)
    // 更新状态
    setCity(city)
    setWeather(weather)
  }

  useEffect(()=>{ // 当组件加载完时

    // 通过定义循环定时器来实现动态显示当前的时间
    const timer = setInterval(()=>{ // 每隔1秒钟执行一次
      let nowTime = timestampToTime((new Date()).toLocaleString('en-US',{hour12: false}).split(" "))
      setTime(nowTime)
    },1000)

    // 获取当前的天气
    getWeather()

    return ()=>{ // 返回函数
      // 当组件即将卸载之前关闭定时器
      clearInterval(timer)
    }
  },[])

  // 退出登陆
  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗？',
      onOk() {
        // 删除保存的user数据（先删除本地的，在删除内存中的）
        storageUtils.removeUser()
        memoryUtils.user = {}
        // 跳转到login
        navigate(`/login`, {
          replace: true,
        })
      },
    });
  };

  return (
    <div className="header">
        <div className="header-top">
          <Button className="header-top-linkBtn" type="link" onClick={showConfirm}>退出</Button>
          <div>
            <span>欢迎，{memoryUtils.user.username}</span>
          </div>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{getTitle()}</span>
            <div className="angle"></div>
          </div>
          <div className="header-bottom-right">
            <span style={{marginRight:"15px"}}>{time}</span>
            <span style={{marginRight:"15px"}}>{city}</span>
            <span>{weather}</span>
          </div>
        </div>
    </div>
  )

}