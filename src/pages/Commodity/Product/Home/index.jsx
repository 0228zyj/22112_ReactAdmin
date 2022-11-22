// 商品管理组件
import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import {Button, Table, Divider, Input, Select, message} from 'antd';
import LinkButton from "../../../../components/LinkButton";
import {reqPageProducts,reqSearchPageProducts,reqUpdateCategoryStatus} from '../../../../api'
import {PAGE_SIZE} from '../../../../utils/constants'
import './product.css'

let columns = [] // 列表头数据
const productsData = [
  {
    "status":1,
    "imgs":[
      "image-1554636776678.jpg",
      "image-1557738385383.jpg"
    ],
    "_id":"5ca9e05123a",
    "name":"联想Think Pad翼 480",
    "desc":"年度重量级新品，X390，T490全新登场 更加轻薄机身设计9",
    "price":66000,
    "pCategoryId":"5ca9d6c123",
    "categoryId":"5ca9db71233",
    "detail":"<p style=\"display: inline-block;color: red;margin-bottom:0;\">想你所需，超你所想！精致外观，轻薄便携光驱，内置正版office杜绝盗版死机，全国联保两年！</p>",
    "__v":0
  },
  {
    "status":1,
    "imgs":[
      "image-1554636776678.jpg",
      "image-1557738385383.jpg"
    ],
    "_id":"5ca9e05456b",
    "name":"华硕(ASUS)飞行堡垒",
    "desc":"15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
    "price":6799,
    "pCategoryId":"5ca9d6c456",
    "categoryId":"5ca9db74566",
    "detail":"<p style=\"display: inline-block;color: red;margin-bottom:0;\">想你所需，超你所想！精致外观，轻薄便携光驱，内置正版office杜绝盗版死机，全国联保两年！</p>",
    "__v":0
  },
  {
    "status":0,
    "imgs":[
      "image-1554636776678.jpg",
      "image-1557738385383.jpg"
    ],
    "_id":"5ca9e05789c",
    "name":"你不知道的js（上卷）",
    "desc":"图灵程序设计丛书：[You Don't Know JS:Scope & Closures]JavaScript开发经典入门图书 打通JavaScript的任督二脉",
    "price":35,
    "pCategoryId":"0",
    "categoryId":"5ca9db77899",
    "detail":"<p style=\"display: inline-block;color: red;margin-bottom:0;\">想你所需，超你所想！精致外观，轻薄便携光驱，内置正版office杜绝盗版死机，全国联保两年！</p>",
    "__v":0
  },
]; // 列表数据
let pageNumber // 用于保存当前页，方便其他方法使用

export default function Product() {

  const [products,setProducts] = useState([]) // 每页的商品数组
  const [total,setTotal] = useState(15) // 商品数据的总数量
  const [loading,setLoading] = useState(true) // 是否正在加载
  const [searchType,setSearchType] = useState('productName') // 根据哪个类型搜索（默认是productName）
  const [searchName,setSearchName] = useState('') // 搜索的关键字
  const navigate = useNavigate()

  /*
    跳转到添加商品页面（添加商品和修改商品使用的是同一个组件）
  */
  const toAddPage = ()=>{
    navigate(`/system/product_add`)
  }

  /*
    获取指定页码的列表数据显示
    （这个方法暂时有一个bug：就是当关键字框内有值时，如果每页点击搜索按钮，而是点击切换页面的按钮，则也会进行搜索的功能。
    所以我觉得还得进一步判断是否点击搜索按钮和关键字框是否有值。先看一下老师后面有没有解决这个问题；没有的话我后面自己解决）
    （还有一种情况，当搜索完之后，在把关键字框清楚后，在点击切换页面按钮，会导致所搜索的结果变成不是搜索后结果的分页）
  */
  const getProducts =async (pageNum)=>{
    pageNumber = pageNum // 保存当前页，方便其他方法使用

    let result
    if(searchName){ // 如果搜索关键字有值, 说明我们要做搜索分页（个人觉得还得加一个判断：就是判断搜索按钮是否被点击。是且的关系）
      result =await reqSearchPageProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    }else {
      result =await reqPageProducts(pageNum,PAGE_SIZE)
    }
    // 在请求完成后，隐藏loading
    setLoading(false)
    if(result.status === 0){
      const {total,list} = result.data

      // 更新状态
      setTotal(total)
      setProducts(list)

    }else{
      message.error('获取商品数据失败')
    }

  }

  /*
    更新指定商品的状态（有两种状态：在售 和 已下架）
  */
  const changeCategoryStatus = async (productId,status)=>{
    // 动态的
    /*const result = await reqUpdateCategoryStatus(productId,status)
    if(result.status === 0){
      message.success('更新商品成功')
      getProducts(pageNumber)
    }else {
      message.error('更新商品失败')
    }*/

    // 静态更新
    const data = productsData.map(product => {
      if (product._id === productId){
        product.status = status
        return product
      }else {
        return product
      }
    })
    setProducts(data)

  }

  /*
    执行异步任务: 发异步ajax请求
  */
  useEffect(()=>{ // 当组件加载完时
    // 发送请求动态获取商品列表显示
    // getProducts(1)

    // 使用静态数据去初始化
    setProducts(productsData)

    return ()=>{ // 返回函数

    }
  },products)

  /*
    初始化table的表头数据
  */
  const initColumns = ()=>{
    columns =  [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => `￥${price}`,
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const {status,_id} = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <div>
              <Button type="primary" onClick={()=>{changeCategoryStatus(_id,newStatus)}}>{status===1 ? '下架' : '上架'}</Button>
              <div>
                {/* status=1 ： 表示 在售，反之表示 已下架 */}
                <span>{status===1 ? '在售' : '已下架'}</span>
              </div>
            </div>
          )
        },
      },
      {
        title: '操作',
        width: 100,
        render: (product) => (
          <span>
            {/* 跳转到详情页面，并将product对象使用state参数传递给目标路由组件，目标路由组件使用location进行接收 */}
            <LinkButton onClick={()=>{ navigate(`/system/product_detail`,{
              state: product
            })}}>详情</LinkButton>
            {/* 跳转到修改商品页面（添加商品和修改商品使用的是同一个组件），并将product对象使用state参数传递给目标路由组件 */}
            <LinkButton onClick={() =>{navigate(`/system/product_add`,{
              state: product
            })}}>修改</LinkButton>
          </span>
        ),
      },
    ]
  }

  initColumns()

  return (
    /* 这里我没有使用antd的Card组件去实现卡片效果，是自己写的类似于Card组件的 div */
    <div className="card">
      <div className="card-top-left">
        <Select
          value= {searchType}
          className="form-select"
          onChange={value => setSearchType(value)}
          options={[
            {
              value: 'productName',
              label: '按名称搜索',
            },
            {
              value: 'productDesc',
              label: '按描述搜索',
            },
          ]}
        />
        <Input className="form-input" placeholder="关键字" value={searchName} onChange={(e)=>{setSearchName(e.target.value)}}/>
        <Button type="primary" onClick={()=> getProducts(1)}>搜索</Button>
      </div>
      <Button type="primary" className="card-top-right" onClick={toAddPage} icon={<PlusOutlined />}>添加商品</Button>
      <Divider className="card-line"/>
      <Table className="card-bottom-table"
        rowKey="_id"
        // loading={loading}
        pagination={{
          current:pageNumber,total:total,defaultPageSize: PAGE_SIZE,showQuickJumper:true,onChange:getProducts,}}
        bordered
        columns={columns}
        dataSource={products}
      />
      <Divider className="card-line"/>
    </div>
  )

}

