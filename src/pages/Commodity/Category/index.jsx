// 用户管理组件
import React, { useState,useEffect } from 'react'
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons';
import { Button,Space, Table,Divider,Modal,Form,Input,Select,Card,message, } from 'antd';
import UpdateForm from "./update-form";
import {reqCategories,reqAddCategory,reqUpdateCategory} from '../../../api'
import LinkButton from "../../../components/LinkButton";

const categoriesData = [
  {
    parentId:'0',
    _id:"5ca9d685",
    name: '家用电器',
    __v:0,
  },
  {
    parentId:'0',
    _id:"5ca9d6c0",
    name: '电脑',
    __v:0,
  },
  {
    parentId:'0',
    _id:"5ca9d6c9",
    name: '图书',
    __v:0,
  },
  {
    parentId:'0',
    _id:"5ca9d6e9",
    name: '服装',
    __v:0,
  },
  {
    parentId:'0',
    _id:"5ca9d70c",
    name: '食品',
    __v:0,
  },
  {
    parentId:'0',
    _id:"5ca9d727",
    name: '食品',
    __v:0,
  },
];
const subCategoriesData = [
  {
    parentId:'5ca9d685',
    _id:"5ca9d312",
    name: '电视',
    __v:0,
  },
  {
    parentId:'5ca9d685',
    _id:"冰箱",
    name: '电脑',
    __v:0,
  },
  {
    parentId:'5ca9d685',
    _id:"5ca9d334",
    name: '洗衣机',
    __v:0,
  },
  {
    parentId:'5ca9d685',
    _id:"5ca9d345",
    name: '空调',
    __v:0,
  },
  {
    parentId:'5ca9d685',
    _id:"5ca9d356",
    name: '厨卫电器',
    __v:0,
  },
  {
    parentId:'5ca9d685',
    _id:"5ca9d367",
    name: '吸尘器',
    __v:0,
  },
]
let columns = [] // 定义表格头
let categoryData = {} // 初始化指定的分类

export default function Category (){

    const [categories,setCategories] = useState([]) // 一级分类列表的数据
    const [loading,setLoading] = useState(false) // 是否正在获取数据中（在发请求前，显示loading）
    const [subCategories,setSubCategories] = useState([]) // 二级分类列表
    const [parentId,setParentId] = useState('0') // 当前需要显示的分类列表的父分类ID（初始值是一级分类的id：'0'）
    const [parentName,setParentName] = useState('') // 当前需要显示的分类列表的父分类名称
    const [isModalOpen,setIsModalOpen] = useState(0) // 标识 添加/更新 的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新,
    // categoryName:'',

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    /*
        初始化Table所有列的数组
      */
    const initColumns = () => {
      columns = [
        {
          title: '分类的名称',
          dataIndex: 'name',
          key: 'name',
          width:800,
        },
        {
          title: '操作',
          key: 'action',
          // 默认会传递列表中对应行的数据对象
          render: (category) => (
            <Space size="middle">
              <LinkButton onClick={()=>{showUpdateModal(category)}}>修改分类</LinkButton>
              {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数中调用 处理的函数并传入数据*/}
              { parentId === '0'? <LinkButton onClick={()=> showSubCategories(category) }>查看子分类</LinkButton> : null }
            </Space>
          ),
        },
      ];
    }
    initColumns()


    /*
        异步获取一级/二级分类列表显示
        parentId: 如果没有指定，则根据状态中的parentId去请求； 如果指定了，则根据指定的请求
    */
    const getCategories = async () => {

      // 发异步Ajax请求，获取数据
      const result = await reqCategories(parentId)
      console.log(result);
      // 在请求完成后，隐藏loading
      setLoading(false)
      if(result.status === 0){
        // 取出分类数组(可能是一级也可能二级的)
        const categories = result.data

        if(parentId === "0"){ // 更新一级分类数据
          setCategories(categories)
        }else{ // 更新二级分类数据
          setSubCategories(categories)
        }
      }else {
        message.error('获取分类列表失败')
      }
    }

    /*
        显示指定的一级分类对象的二级列表
    */
    const showSubCategories = (category)=>{
      // 更新状态（在函数式组件中，更新状态的方法中没有更新状态后执行的回调函数这样的参数？那么该怎么去定义这样的函数）
      setParentId(category._id)
      setParentName(category.name)

      // ？？？（如何在函数式组件中，使用更新状态后会执行的函数）。 可以使用延迟定时器来实现该函数的功能
      console.log('parentId', parentId) // 不是'0'
      // 获取对应parentId的二级分类列表显示
      // getCategories()

      // 使用静态数据去初始化
      setSubCategories(subCategoriesData)

      // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
      // console.log('parentId', this.state.parentId) // '0'
    }

    /*
      显示指定的一级分类列表
    */
    const showCategories = ()=>{
      // 更新为显示一级列表的状态
      setParentId('0')
      setParentName('')
      setSubCategories([])
    }

    // 显示添加分类框
    const showAddModal = () => {
      // 初始化所属分类 输入框 的值
      if(parentId === "0"){
        form1.setFieldValue('category','一级分类')
      }else{
        form1.setFieldValue('category',parentName)
      }
      // 更新状态
      setIsModalOpen(1)
    };
    // 确认 添加分类
    const addCategory = async () => {
      // 进行表单提交时的表单验证, 只有通过了才处理
      form1.validateFields(["categoryName"]).then(()=>{
        // 更新状态（隐藏添加框）
        setIsModalOpen(0)

        console.log(parentId,form1.getFieldValue('categoryName'));
        // 收集数据
        const categoryName = form1.getFieldValue('categoryName')
        // 清除输入的数据
        form1.resetFields()

        // 发送添加分类的请求（动态的）
        /*const result = await reqAddCategory(categoryName,parentId)
        if(result.status === 0) { // 表示添加分类成功
          //  重新获取分类列表显示
          getCategories()
        }else {
          message.error('添加分类失败')
        }*/

        // 静态添加(因为没有数据库)
        setCategories([...categoriesData,{
          parentId:parentId,
          _id:"123456789",
          name: categoryName,
          __v:0,
        }])
      }).catch(()=>{
        message.warn('输入框必须输入值')
      })

      /*
          注意：
      */

    };
    // 显示更新分类框
    const showUpdateModal = (category) => {
      /* 老师利用了调用该方法时，有更新状态，所以会重新渲染组件，进而可以获取新的categoryData的值 */
      // console.log(category.name);
      categoryData = category

      /* 我这里不使用initialValue属性去初始化更新框的Input组件的初始值，因为初始值不能改变？也不知道是啥问题？ */
      form2.setFieldValue('categoryNewName',categoryData.name)

      // 更新状态
      setIsModalOpen(2);
    };
    // 确认 更新分类
    const updateCategory = /*async*/ () => {
      // 进行表单提交时的表单验证, 只有通过了才处理
      form2.validateFields(["categoryNewName"]).then(()=>{
        // 1. 隐藏修改框
        setIsModalOpen(0)

        // 准备数据
        const categoryId = categoryData._id
        const categoryName = form2.getFieldValue('categoryNewName')
        console.log(categoryId,categoryName);

        // 2. 发请求更新分类（动态的）
        /*const result = await reqUpdateCategory({categoryId, categoryName})
        if(result.status === 0){
          // 3. 重新显示列表
          // getCategories()

        }else {
          message.error('更新分类失败')
        }*/
      }).catch(()=>{
        message.warn('输入框必须输入值')
      })

    }
    // 关闭 添加/更新 分类框
    const handleCancel = () => {
      // 清除输入的数据
      form1.resetFields()
      form2.resetFields()

      setIsModalOpen(0)
    };

    /*
      为第一次render()准备数据
    */
    /*UNSAFE_componentWillMount() {
      this.initColumns()
      // const [form] = Form.useForm();
    }*/

    /*
        执行异步任务: 发异步ajax请求
    */
    useEffect(()=>{ // 当组件加载完时
      // 发送请求动态获取一级分类列表显示
      // getCategories()

      // 使用静态数据去初始化
      setCategories(categoriesData)

      return ()=>{ // 返回函数

      }
    },categories)

    // console.log(categoryName);
    const title = parentId === '0' ? "一级分类列表" : (
      <span>
        <LinkButton onClick={showCategories}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{marginRight:5}}/>
        <span>{parentName}</span>
      </span>
    )

    // 读取指定的分类
    // const category = this.category || {}
    // 输出的是变化后的值，为什么界面上的值没有改变？难道必须写在state中？写在state属性上也不行。那估计是组件的initialValue属性的问题
    // console.log(categoryData);

    return (
      /*
          这里使用Card组件，会让我们觉得，Content组件的高度被Card组件的高度撑开。其实Content组件的高度是由一个范围的。
            不论是我自己设计的div还是引用Card组件，其都会在父元素Content组件内溢出。
      */
      /*<div>
        <div style={{float:"left",margin:"20px 0 0px 13px"}}>
          <Button style={{float:"left"}} type="link">一级分类列表</Button>
          <div style={{float:"left",paddingTop:5,display:'none'}}>
            <ArrowRightOutlined style={{marginRight:12}}/>
            <span>{}</span>
          </div>
        </div>
        <Button type="primary" style={{float:"right",margin:"20px 30px 20px 0"}} onClick={this.showModal} icon={<PlusOutlined />}>添加</Button>
        <Divider style={{margin:"15px 0 20px 0"}}/>
        <Table
          pagination={{
            defaultPageSize: 5,showQuickJumper:true}}
          bordered columns={columns} dataSource={data} style={{width:'95%',margin:"0 auto"}}/>
        <Divider style={{margin:"15px 0"}}/>
        <Modal title="更新分类" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
          <form className="form">
            <div>
              <Select
              defaultValue="一级分类"
              style={{
                width: 350,
              }}
              onChange={this.handleChange}
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
            <div><Input style={{ width: 350,}} placeholder="请输入分类名称" /></div>
          </form>
        </Modal>
      </div>*/

      /* Card组件的宽度默认是父元素宽度的100% */
      <Card
        title={title}
        extra={
          <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />}>添加</Button>
        }
      >
        {/* 如果表格的数据的每个对象中有key属性，则默认会作为rowKey的属性值。如果没有，则必须指定rowKey的对应属性。是为了对表格的每行进行唯一标识 */}
        <Table
          pagination={{
            defaultPageSize: 5,showQuickJumper:true}}
          bordered columns={columns} dataSource={ parentId==="0" ? categories : subCategories} loading={loading} rowKey="_id"/>
        <Modal title="添加分类" open={isModalOpen === 1} onOk={addCategory} onCancel={handleCancel}>
          <Form
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 17,
            }}
            form={form1}
            >
            <Form.Item label="所属分类" name="category"
                       /*initialValue={ parentId === "0" ? "一级分类" : parentName}*/>
              {/*<Select >
                <Select.Option value="0">一级分类</Select.Option>
                <Select.Option value="1">家用电器</Select.Option>
                <Select.Option value="2">电脑</Select.Option>
                <Select.Option value="3">图书</Select.Option>
                <Select.Option value="4">食品</Select.Option>
                <Select.Option value="5">服装</Select.Option>
              </Select>*/}
              <Input  disabled={true} style={{backgroundColor: '#fff',color:"#000"}}/>
            </Form.Item>
            <Form.Item label="分类名称" name="categoryName" rules={[
                {
                  required: true,
                  message:'请输入分类名称'
                },
              ]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal title="更新分类" open={isModalOpen === 2} onOk={updateCategory} onCancel={handleCancel}>
          {/* 我的写法是直接写在父组件里面 */}
          <Form
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 17,
            }}
            form={form2}
          >
            <Form.Item label="分类名称" name="categoryNewName" rules={[
                {
                  required: true,
                  message:'分类名称必须输入！'
                },
              ]}
              /*initialValue={categoryData.name}*/
            >
              <Input placeholder="请输入新的分类名称" />
            </Form.Item>
          </Form>
          {/* 老师对于表单写法是：写一个form组件，然后通过props传递参数。 */}
          {/*<UpdateForm categoryName={category.name}/>*/}
        </Modal>

      </Card>
    )

}
