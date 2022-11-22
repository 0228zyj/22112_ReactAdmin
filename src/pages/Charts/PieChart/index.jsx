// 饼图组件
import React, { Component } from 'react'
import {Button, Divider} from "antd";
// 引入 echarts-for-react 主模块
import EChartsReact from "echarts-for-react";

export default class PieChart extends Component{
  state = {option1: {},option2: {}};

  render() {
    return (
      <div>
        <p style={{margin:"10px 0 0 25px",fontSize:16}}>饼图一</p>
        <Divider style={{margin:"15px 0"}}/>
        <div style={{margin:"0 0 0 25px"}}>
          <EChartsReact option={this.state.option1} />
        </div>
        <Divider style={{margin:"15px 0"}}/>
        <span style={{margin:"0 0 0 25px",fontSize:16}}>饼图二</span>
        <Divider style={{margin:"15px 0"}}/>
        <div style={{margin:"0 25px 30px 25px"}}>
          <EChartsReact option={this.state.option2} />
        </div>
      </div>
    )
  }

  componentDidMount () {

    let option1 = {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center',
      },
      tooltip:{
        trigger:'item',
        formatter:"{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'top',
      },
      color:['rgb(194,53,49)','rgb(47,69,84)','rgb(97,160,168)','rgb(212,130,101)','rgb(145,199,174)'],
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center:['50%','60%'],
          data: [
            { value: 15, name: '直接访问' },
            { value: 15, name: '邮件营销' },
            { value: 9, name: '联盟广告' },
            { value: 6, name: '视频广告' },
            { value: 75, name: '搜索引擎' },
          ],
          // label: {
          //   color:'rgb(97,160,168)'
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
      ]
    };

    let option2 = {
      backgroundColor: '#2c343c',
      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          top: 50,
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 235, name: '视频广告' },
            { value: 400, name: '搜索引擎' }
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
    this.setState({option1,option2})
  }

}
