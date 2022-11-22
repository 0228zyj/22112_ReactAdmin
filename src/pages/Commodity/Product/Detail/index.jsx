// 商品管理(添加商品功能)组件
import React, { useState,useEffect } from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons';
import {Card, List, message} from 'antd';
import LinkButton from "../../../../components/LinkButton";
import './detail.css'
import {BASE_IMG_URL} from '../../../../utils/constants'
import {reqCategory} from '../../../../api'

export default function Detail(){

  const navigate = useNavigate()
  const location = useLocation()
  const {name,desc,price,imgs,pCategoryId,categoryId,detail} = location.state
  const [categoryName1,setCategoryName1] = useState('') // 一级分类名称
  const [categoryName2,setCategoryName2] = useState('') // 二级分类名称

  const data = [
    (<span>
      <span className="detail-title">商品名称：</span>
      <span>{name}</span>
    </span>),
    (<span>
      <span className="detail-title">商品描述：</span>
      <span>{desc}</span>
    </span>),
    (<span>
      <span className="detail-title">商品价格：</span>
      <span>{price}元</span>
    </span>),
    (<span>
      <span className="detail-title">所属分类：</span>
      <span>{categoryName1} {categoryName2 ? '--> '+ categoryName2 : ''}</span>
    </span>),
    (<span>
      <span className="detail-title">商品图片：</span>
      <span>
        {/*{
          imgs.map((img)=>{
            return (
              <img key={img} className="detail-img" src={require({BASE_IMG_URL+img})} alt="商品图片1"/>
            )
          })
        }*/}
        <img className="detail-img" src={require("../../../../asset/images/logo.png")} alt="商品图片1"/>
        <img className="detail-img" src={require("../../../../asset/images/logo.png")} alt="商品图片2"/>
      </span>
    </span>),
    (<span>
      <span className="detail-title">商品详情：</span>
      <span dangerouslySetInnerHTML={{__html:detail}}></span>
    </span>),
  ];

  /*
     发送Ajax请求，根据分类id获取对应的分类
  */
  const getCategory = async (pCategoryId,categoryId)=>{
    if(pCategoryId === '0'){ // 一级分类下的商品
      const result = await reqCategory(categoryId)
      if(result.status === '0'){ // 请求发送成功
        setCategoryName1(result.data.name)
      }else { // 请求发送失败
        message.warn('所属分类获取失败')
      }
    }else { // 二级分类下的商品
      /*
      // 通过多个await方式发送多个请求：后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId)
      const result2 = await reqCategory(categoryId)
      */

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      if(results[0].status === '0' && results[1].status === '0'){ // 请求发送成功
        setCategoryName1(results[0].data.name)
        setCategoryName2(results[1].data.name)
      }else { // 请求发送失败
        message.warn('所属分类获取失败')
      }
    }
  }

  const toProductPage = ()=>{
    navigate(`/system/product`)
  }

  /*
    执行异步任务: 发异步ajax请求
  */
  useEffect(()=>{ // 当组件加载完时
    // 发送请求动态获取某个商品的所属分类信息
    // getCategory(pCategoryId,categoryId)

    // 使用静态数据去初始化
    setCategoryName1('电脑')
    setCategoryName2('笔记本')

    return ()=>{ // 返回函数

    }
  },[pCategoryId,categoryId])

  return (
    <Card
      title={<span>
        <LinkButton onClick={toProductPage}><ArrowLeftOutlined className="detail-arrow"/></LinkButton>
        <span>商品详情</span>
      </span>}
    >
      <List
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  )

}

