// 商品管理(添加商品功能)组件
import React, { useState , useEffect , useRef} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { LoadingOutlined, PlusOutlined,ArrowLeftOutlined } from '@ant-design/icons';
import {Card, Button, Divider, Input, message, Upload, Cascader , Form} from 'antd';
import LinkButton from "../../../../components/LinkButton";
import {reqCategories,reqAddOrUpdateProduct} from "../../../../api"
import RichTextEditor from "./rich-text-editor";
import PicturesWall from "./pictures-wall";
import './add-product.css'

const { TextArea } = Input;

const optionLists = [
  {
    value: '5ca9d6c123',
    label: '家用电器',
    isLeaf: false,
  },
  {
    value: '5ca9d6c456',
    label: '电脑',
    isLeaf: false,
  },
  {
    value: '5ca9db77899',
    label: '图书',
    isLeaf: false,
  },
  {
    value: '1',
    label: '1',
    isLeaf: false,
  },
  {
    value: '2',
    label: '2',
    isLeaf: false,
  },
  {
    value: '3',
    label: '3',
    isLeaf: false,
  },
  {
    value: '4',
    label: '5',
    isLeaf: false,
  },
  {
    value: '5',
    label: '5',
    isLeaf: false,
  },
  {
    value: '6',
    label: '6',
    isLeaf: false,
  },
];
let isUpdate // 标识是否是修改的状态（为true表示为是修改的状态，为false表示为添加的状态）
let product // 传过来的某个商品的数据

/* 注意：当跳转路由或刷新时，虽然组件会重新渲染，但是写在组件外的变量（即函数外或类外）不会重新渲染 */
export default function AddProduct(){

  const [options, setOptions] = useState([]); // 级联初始数据数组
  /* 绑定Form表单 */
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const location = useLocation()
  if(!location.state){ // 如果没有值，则 location.state = {}。避免添加商品 和 修改商品 共用组件时从location.state取值时报错
    product = {}
    isUpdate = false // 更改为添加商品的状态
  }else { // 如果有值
    product = location.state
    isUpdate = true // 更改为添加商品的状态
  }
  const {_id,name,desc,price,imgs,pCategoryId,categoryId,detail} = product
  const pwRef = useRef(null)
  const editorRef = useRef(null)

  // 初始化（一级分类）options
  const initOptions = async (categories) => {
    // 根据categories生成options
    const options = categories.map(c => ({
      value:c._id,
      label:c.name,
      isLeaf:false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新
    if(isUpdate && pCategoryId !== "0"){

      // 发送Ajax请求，动态获取二级列表的数据，并转为options
      // 获取对应的二级分类列表
      const subCategories = await getCategories(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategories.map(sub => ({
        value: sub._id,
        label: sub.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    // 更新options状态
    setOptions(options)
  }

  /*
      异步获取一级/二级商品分类列表信息
      async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  */
  const getCategories = async (parentId)=>{
    const result = await reqCategories(parentId)
    if(result.status === 0){
      const categories = result.data
      if(parentId === "0"){ // 如果是一级分类列表
        // 根据动态获取的分类列表数据去初始化 options 数组
        initOptions(categories)

      }else { // 如果是二级分类列表
        return categories // 返回二级列表 ==> 当前async函数返回的promise就会成功且value为categories
      }

    }else {
      message.error('列表数据获取失败')
    }
  }

  /* 跳转到商品管理的home界面 */
  const toProductPage = ()=>{
    navigate(`/system/product`)
  }

  /* 表单的布局设计 */
  const formItemLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 8,
    },
  };

  /* 对商品价格框进行自定义表单验证 */
  const validatorPrice = (_, value)=>{
    if(!value){
      return  Promise.reject(new Error('商品价格必须输入!'));
    } else if (value*1 <= 0) {
      return  Promise.reject(new Error('商品价格必须大于0!'));
    } else {
      return Promise.resolve();
    }
  }

  /* 用于加载下一级列表的回调函数 */
  const loadData = async (selectedOptions) => {
    // 得到选择的option对象
    // const targetOption = selectedOptions[0]; 等同于下方的方式获得
    const targetOption = selectedOptions[selectedOptions.length - 1]

    // 显示loading图标
    targetOption.loading = true

    /* 通过发送Ajax请求动态获取二级分类列表并添加对应的子options */
    /*// 根据选中的分类，请求获取二级分类列表
    const subCategories = await getCategories(targetOption.value)
    // 隐藏loading图标
    targetOption.loading = false
    // 二级分类数组有数据
    if(subCategories && subCategories.length>0){
      // 生成一个二级列表的options
      const cOptions = subCategories.map(sub => ({
        value:sub._id,
        label:sub.name,
        isLeaf:true, // 是叶子
      }))
      // 关联到当前option上
      targetOption.children = cOptions

    }else{ // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    setOptions([...options])
    */

    /* 模拟动态获取二级分类列表并添加对应的子options（其实是静态的） */
    setTimeout(() => {
      // 隐藏loading图标
      targetOption.loading = false
      targetOption.children = [
        {
          label: `笔记本`,
          value: '5ca9db74566',
        },
        {
          label: `台式电脑`,
          value: '5ca9db71233',
        },
      ]
      setOptions([...options]);
    }, 1000);

  }

  /* 进行表单提交时的表单验证, 只有通过了才处理 */
  const submit = ()=>{
    // 进行表单提交时的表单验证, 只有通过了才处理
    form.validateFields(["name","desc","price","categoryIds"]).then(async (values)=>{
      // console.log('submit()',values);

      /* 1. 收集数据, 并封装成product对象 */
      const {name , desc , price  , categoryIds} = values
      let pCategoryId,categoryId
      if(categoryIds.length===1){
        pCategoryId = '0'
        categoryId = categoryIds[0]
      }else {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      }
      const imgs = pwRef.current.getImgs()
      const detail = editorRef.current.getDetail()

      let product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
      // 如果是修改, 需要添加_id
      if(isUpdate){
        product._id = _id
      }

      /* 2. 调用接口请求函数去添加/更新 */
      const result = await reqAddOrUpdateProduct(product)

      /* 3. 根据结果提示 */
      if(result.status === 0){
        message.success(`${isUpdate ? '更新' : '添加'}商品成功!`)
        navigate(-1)
      }else {
        message.error(`${isUpdate ? '更新' : '添加'}商品失败!`)
      }

    }).catch(()=>{
      message.warn('提交失败！')
    })
  }

  /*
    执行异步任务: 发异步ajax请求
 */
  useEffect(()=>{ // 当组件加载完时
    // 发送请求动态获取一级所有商品的分类信息
    // getCategories("0")

    /* 使用静态数据去初始化 */
    // 如果是一个二级分类商品的更新
    if(isUpdate && pCategoryId !== "0"){
      // 静态获取
      const childOptions = [
        {
          label: `笔记本`,
          value: '5ca9db74566',
        },
        {
          label: `台式电脑`,
          value: '5ca9db71233',
        },
      ]

      // 找到当前商品对应的一级option对象
      const targetOption = optionLists.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    setOptions(optionLists)

    return ()=>{ // 返回函数

    }
  },options)

  let categoryIds = [] // 存储所有分类ID的值的数组（用于商品分类框取值）
  if(pCategoryId === "0"){ // 如果一级分类ID为 "0"
    categoryIds.push(categoryId)
  }else if(categoryId){ // 一级分类ID不为 "0"，并且二级分类ID有值
    categoryIds.push(pCategoryId)
    categoryIds.push(categoryId)
  }

  return (
    /*<div>
      <div className="addProduct">
        <Button className="btn" type="link" onClick={toProductPage}><ArrowLeftOutlined /></Button>
        <span className="add">添加商品</span>
      </div>
      <Divider style={{margin:"15px 0 20px 0"}}/>
      <div className="product">
        <span className="star">*</span>
        商品名称：<Input style={{width:350}} placeholder="请输入商品名称" />
      </div>
      <div className="product">
        <span className="star" style={{verticalAlign:"top",}}>*</span>
        <span style={{verticalAlign:"top",}}>商品描述：</span>
        <TextArea style={{width:350}} rows={2} placeholder="请输入商品描述" />
      </div>
      <div className="product">
        <span className="star">*</span>
        商品价格：<Input style={{width:350}} addonAfter="元" placeholder="请输入商品价格" />
      </div>
      <div className="product">
        <span className="star">*</span>
        商品分类：<Select
        placeholder="请指定商品分类"
        style={{width:350}}
        options={[
          {
            value: '一级分类',
            label: '一级分类',
          },
          {
            value: '二级分类',
            label: '二级分类',
          },
        ]}
      />
      </div>
      <div className="product">
          <span>&nbsp;&nbsp;&nbsp;商品图片：</span>
          <PicturesWall/>
      </div>
      <div className="product">
        &nbsp;&nbsp;&nbsp;商品详情：

      </div>
      <div className="product">
        <Button type="primary" onClick={submit}>提交</Button>
      </div>
    </div>*/
    <Card
      title={<span>
        <LinkButton onClick={toProductPage}><ArrowLeftOutlined className="detail-arrow"/></LinkButton>
        {/* 如果location.state有值，表示 修改。反之表示 添加 */}
        <span>{isUpdate ? '修改' : '添加'}商品</span>
      </span>}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="商品名称" name="name" initialValue={name} rules={[
          {
            required: true,
            message: '商品名称必须输入!',
          },
        ]}>
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item label="商品描述" name="desc" initialValue={desc} rules={[
          {
            required: true,
            message: '商品描述必须输入!',
          },
        ]}>
          <TextArea allowClear placeholder="请输入商品描述" autoSize={{minRows: 2, maxRows: 6}}/>
        </Form.Item>
        <Form.Item label="商品价格" name="price" initialValue={price} rules={[
          {
            required: true,
            validator: validatorPrice,
          },
        ]}>
          <Input type="number" addonAfter="元" placeholder="请输入商品价格" />
          {/*<InputNumber addonAfter="元" placeholder="请输入商品价格" />*/}
        </Form.Item>
        {/* 商品分类的值是根据商品的 一级分类ID 和 二级分类ID 确定的 */}
        <Form.Item label="商品分类" name="categoryIds" initialValue={categoryIds} rules={[
          {
            required: true,
            message: '商品分类必须输入!',
          },
        ]}>
          <Cascader
            options={options}
            changeOnSelect
            placeholder="请选择商品分类"
            loadData={loadData}
          />
        </Form.Item>
        <Form.Item label="商品图片">
          <PicturesWall ref={pwRef} imgs={imgs}/>
        </Form.Item>
        <Form.Item label="商品详情"  labelCol={{span: 2}} wrapperCol={{span: 20}}>
          <RichTextEditor ref={editorRef} detail={detail}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submit}>提交</Button>
        </Form.Item>
      </Form>
    </Card>
  )

}

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: pwRef = useRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={pwRef} />
3. 通过ref容器读取标签元素: pwRef.current
4. 重点：用forwardRef将子组件包含，并且使用useImperativeHandle hook函数去暴露父组件需要的子组件的方法
 */