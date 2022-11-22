// 折线图组件
import React, { Component } from 'react'
import {Button, Divider} from "antd";
// 引入 echarts-for-react 主模块
import EChartsReact from "echarts-for-react";


export default class LineChart extends Component{
  state = {
    sales:[5,20,36,10,10,20] , // 销量的数组
    stores:[6,10,25,20,15,10], // 库存的数组
  }

  /* 更新数据:库存减1,销量加1 */ 
  updateChart = ()=>{
    this.setState(state=>({
      sales:state.sales.map(sale => sale + 1),
      stores:state.stores.reduce((pre,store) => {
        pre.push(store-1)
        return pre
      },[]),
    }))
  }

  render() {
    const {sales,stores} = this.state
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
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
      legend: {
        data: ['销量', '库存']
      },
      color:['rgb(193,52,48)','rgb(46,68,83)'],
      series: [
        {
          name:'销量',
          type: 'line',
          data: sales,
        },
        {
          name: '库存',
          type: 'line',
          data: stores
        },
      ]
    }
    return (
      <div>
        <Button type="primary" style={{margin:"20px 0 10px 30px"}} onClick={this.updateChart}>更新</Button>
        <Divider style={{margin:"15px 0"}}/>
          <span style={{margin:"0 0 0 30px",fontSize:16}}>折线图一</span>
        <Divider style={{margin:"15px 0"}}/>
        <div style={{margin:"0 0 0 30px"}}>
          <EChartsReact option={option} />
        </div>
      </div>
    )
  }


}
