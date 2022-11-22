// 首页的组件TabChangeTabChange
import React, { Component } from 'react'
import moment from 'moment';
import { QuestionCircleOutlined , ArrowDownOutlined , ArrowUpOutlined , ReloadOutlined } from '@ant-design/icons';
import { Card , DatePicker , Timeline , Statistic} from 'antd';
import './home.css'
// 引入 echarts-for-react 主模块
import EChartsReact from "echarts-for-react";
/* bizcharts在这个版本的引入有问题，暂时用ECharts代替 */ 
// import Line from './line';
// import Bar from './bar';

// 组件上方所需的数据
let option1 = {
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  },
  yAxis: {
      axisLine: { // 表示是否显示坐标轴轴线
        show: true,
      },
      axisTick: { // 表示是否显示坐标轴刻度
        show: true,
      },
      type: 'value',
      alignTicks: true,
      axisLabel: {
        formatter: '{value} 万个'
      },
  },
  legend: {
    data: ['a', 'b', 'c'],
    top:'bottom',
  },
  color:['rgb(24,144,255)','rgb(47,194,91)','rgb(250,204,20)'],
  series: [
    {
      name:'a',
      type: 'line',
      data: [8,8,10,15,19,21.5,25,27,23,18,14,9],
      symbol: 'circle',
      symbolSize: 7,
    },
    {
      name:'b',
      type: 'line',
      data: [4,5,6,9,12,15.2,17,16,14,10,7,5],
      symbol: 'circle',
      symbolSize: 7,
    },
    {
      name:'c',
      type: 'line',
      data: [6,2,5,6,9,10,12,14,21,26,31,36],
      symbol: 'circle',
      symbolSize: 7,
    },
  ]
}
let option2 = {
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
  },
  yAxis: {
    type: 'value',
    axisLine: { // 表示是否显示坐标轴轴线
      show: true,
    },
    axisTick: { // 表示是否显示坐标轴刻度
      show: true,
    },
  },
  color:'rgb(24,144,255)',
  series: [
    {
      name:'visits',
      type: 'bar',
      data: [38,52,61,145,48,37,30,38,69,38,58,38],
    },
  ]
}

// 组件下方所需的数据(页签标题列表)
const tabListNoTitle = [
  {
    key: 'visits',
    tab: '访问量',
  },
  {
    key: 'salesVolume',
    tab: '销售量',
  },
]

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default class Home extends Component{
  state = {
    sum:1128163, // 总数
    yearOnWeek:15, // 周同比
    dayOnDay:10, // 日同比
    activeTabKey:'visits', // 表示当前激活的页签
  }

  // 页签对应的内容对象
  contentListNoTitle = {
    visits:
      <div>
        <Card
          title="访问趋势"
          extra={<ReloadOutlined />}
          style={{
            width: 600,
            float:"left",
          }}
        >
          <EChartsReact option={option2}/>
        </Card>
        <Card
          title="任务"
          extra={<ReloadOutlined />}
          style={{
            width: 300,
            float:"right",
          }}
        >
          <Timeline>
            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
            <Timeline.Item color="red">
              <p>联调接口</p>
              <p>功能验收</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>登录功能设计</p>
              <p>权限验证</p>
              <p>页面排版</p>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>,
    salesVolume:
      <div>
        <Card
          title="销量趋势"
          extra={<ReloadOutlined />}
          style={{
            width: 600,
            float:"left",
          }}
        >
          <EChartsReact option={option2}/>
        </Card>
        <Card
          title="任务"
          extra={<ReloadOutlined />}
          style={{
            width: 300,
            float:"right",
          }}
        >
          <Timeline>
            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
            <Timeline.Item color="red">
              <p>联调接口</p>
              <p>功能验收</p>
            </Timeline.Item>
            <Timeline.Item>
              <p>登录功能设计</p>
              <p>权限验证</p>
              <p>页面排版</p>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>,
  }

  /* 更改当前激活的页签 */ 
  onTabChange = (key) => {
    this.setState({activeTabKey: key})
  }

  render() {
    const {activeTabKey,sum,dayOnDay,yearOnWeek} = this.state
    return (
      <div>
        <div className="home-top">
          <div className="home-top-left">
            <Card
              title="商品总量"
              extra={<QuestionCircleOutlined style={{color:'#919191'}}/>}
              style={{ width: 260 }}
              headStyle={{color:'#919191'}}
            >
              <Statistic value={sum} valueStyle={{fontSize:"25px",fontWeight:"bold"}} suffix=
              {<span style={{fontSize: "17px",fontWeight: "bold"}}>个</span>}/>
              <Card bordered={false} bodyStyle={{padding:0}}>
                <Statistic
                  value={yearOnWeek}
                  valueStyle={{fontSize: 16}}
                  prefix={<span>周同比</span>}
                  suffix={<span>
                      <span>%</span>
                      <ArrowDownOutlined style={{color:"#FF0707",marginLeft:10}}/>
                  </span>}
                />
              </Card>
              <Card bordered={false} bodyStyle={{padding:0}}>
                <Statistic
                  value={dayOnDay}
                  valueStyle={{fontSize: 16}}
                  prefix={<span>日同比</span>}
                  suffix={<span>
                      <span>%</span>
                      <ArrowUpOutlined style={{color:"#448907",marginLeft:10}}/>
                  </span>}
                />
              </Card>
            </Card>
          </div>
          <div className="home-top-right" >
            <EChartsReact option={option1}/>
          </div>
        </div>
        <div className="home-bottom">
          <Card
            tabList={tabListNoTitle}
            activeTabKey={activeTabKey}
            tabBarExtraContent={
                <RangePicker defaultValue={[moment('2022/11/01', dateFormat), moment('2022/11/25', dateFormat)]} style={{width:340}} format={dateFormat} />
            }
            onTabChange={(key) => {
              this.onTabChange(key)
            }}
          >
            {this.contentListNoTitle[activeTabKey]}
          </Card>
        </div>
      </div>
    )
  }

}