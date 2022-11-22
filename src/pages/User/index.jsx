// 用户管理组件
import React, { useState , useEffect} from 'react'
import {Button, Table, Divider, Modal, Input, Select, message, Popconfirm, Form, Card} from 'antd';
import './user.css'
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from '../../utils/dateUtild'
import LinkButton from "../../components/LinkButton"
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api'

const usersData = [ // 列表静态数据
  {
    _id: '1',
    username: 'test2',
    email: "sd9",
    phone: '12345678912',
    create_time:'2022-11-5',
    role_id:'测试',
  },
  {
    _id: '2',
    username: 'Jim Green',
    email: "123@qq.com",
    phone: '13107968629',
    create_time:'2022-11-5',
    role_id:'经理',
  },
]
let columns = [] // 定义表头数据
let oneUser = {} // 指定的修改的用户
let AllroleNames = {} // 包含所有角色名的对象(属性名用角色id值)

export default function User (){

  const [isModalOpen,setIsModalOpen] = useState(false)
  const [users,setUsers] = useState([]) 
  const [roles,setRoles] = useState([]) 

  const [form] = Form.useForm()

  /* 初始化Form表单值 */
  const initForm = ()=>{
    form.setFieldValue("username",oneUser.username)
    form.setFieldValue("phone",oneUser.phone)
    form.setFieldValue("email",oneUser.email)
    form.setFieldValue("role_id",oneUser.role_id)
  } 

  /* 添加/修改用户 */ 
  const AddOrUpdateUser = () => {
    form.validateFields(["username","password","phone","email","role_id"]).then(async (values)=>{

      // 隐藏添加/修改用户框
      setIsModalOpen(false)

      // 清除输入的数据
      form.resetFields()

      // 1. 收集输入的数据
      const user = values

      if(oneUser._id){ // 如果是更新, 需要给user指定_id属性
        user._id = oneUser._id
      }
      // 2. 发布添加/更新的请求
      const result = await reqAddOrUpdateUser(user)

      // 3.  根据结果提示并更新列表显示
      if(result.status === 0){
        message.success(`${oneUser._id ? '修改' : '添加'}用户成功`)
        getUsers()
      }else{
        message.success(`${oneUser._id ? '修改' : '添加'}用户失败`)
      }

    }).catch(()=>{
      // 清除输入的数据
      form.resetFields()
      message.warn('请求失败,请重新请求')
    })
  }

  /* 删除指定用户 */ 
  const deleteUser = async (user) => {
    // console.log(user)
    const result = await reqDeleteUser(user._id)
    if(result.status === 0){
      message.success('删除用户成功')
      getUsers()
    }else{
      message.success('删除用户失败')
    }
    
  }

  /* 初始化表头数据 */ 
  const initColumns = ()=>{
    columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        /* 第一种的获取方式,需要多次遍历,效率不高. 采用第二种 */ 
        // render:(role_id) => roles.find(role => role.id === role_id).name
        render:(role_id) => AllroleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={()=> {oneUser = user
              setIsModalOpen(true)
              initForm()}}>修改</LinkButton>
            <Popconfirm
              title={`是否要删除${user.username}?`}
              onConfirm={()=> deleteUser(user) }
              onCancel={() => message.warn('取消删除成功') }
              okText="Yes"
              cancelText="No"
            >
              <LinkButton >删除</LinkButton>
            </Popconfirm>
          </span>
        ),
      },
    ]
  }
  initColumns()

  /* 发送Ajax请求获取用户列表数据 */ 
  const getUsers = async ()=>{
    const result = await reqUsers()
    if(result.status === 0){
      const {users,roles} = result.data
      initRoleNames(roles)
      setUsers(users)
      setRoles(roles)
    }else{

    }
  }

  /*
    根据roles的数组, 生成包含所有角色名的对象(属性名用角色id值)
  */
  const initRoleNames = (roles)=>{
    const roleNames = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
    AllroleNames = roleNames
  }
  
  
  /* 指定Item布局的配置对象 */ 
  const formItemLayout = {
    labelCol: { span: 5 },  // 左侧label的宽度
    wrapperCol: { span: 15 }, // 右侧包裹的宽度
  }

  useEffect(()=>{
    // 动态获取用户数据
    getUsers()

    // 静态获取数据
    // setUsers(usersData)
  },users)

  return (
    /*<div>
      <Button type="primary" style={{margin:"20px 0 0 30px"}} onClick={this.showModal}>创建用户</Button>
      <Divider style={{margin:"15px 0 20px 0"}}/>
      <Table
        pagination={{
        defaultPageSize: 2,}}
        bordered columns={columns} dataSource={data} style={{width:'95%',margin:"0 auto"}}/>
      <Divider style={{margin:"15px 0"}}/>
      <Modal title="添加用户" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
        <form className="form">
          <div>用户名：<Input style={{ width: 320,}} placeholder="请输入用户名" /></div>
          <div>密码：<Input.Password visibilityToggle={false} style={{ width: 320,}} placeholder="请输入密码" /> </div>
          <div>手机号：<Input style={{ width: 320,}} placeholder="请输入手机号" /></div>
          <div>邮箱：<Input style={{ width: 320,}} placeholder="请输入邮箱" /></div>
          <div>
              角色：<Select
              defaultValue="lucy"
              style={{
                width: 320,
              }}
              onChange={this.handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>*/
  <Card
    title={(
      <Button type="primary" style={{marginRight:10}} onClick={()=> {oneUser = {}  // 去除前面保存的user
      setIsModalOpen(true) 
      initForm()}}>创建用户</Button>
    )}
  >
    <Table
      rowKey="_id"
      pagination={{
        defaultPageSize: PAGE_SIZE,}}
      bordered columns={columns} dataSource={users} />
    <Modal title={oneUser._id ? "修改用户" :"添加用户"} open={isModalOpen} onOk={AddOrUpdateUser} onCancel={()=>{setIsModalOpen(false)}}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="用户名" name="username" rules={[
          {
            required: true,
            message:'用户名必须输入！'
          },
        ]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {/* 不让修改密码 */}
        {
          oneUser._id ? null : (
            <Form.Item label="密码" name="password" rules={[
              {
                required: true,
                message:'密码必须输入！'
              },
            ]}>
              <Input type='password' placeholder="请输入密码" />
            </Form.Item>
          )
        }
        <Form.Item label="手机号" name="phone" rules={[
          {
            required: true,
            message:'手机号必须输入！'
          },
        ]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[
          {
            required: true,
            message:'邮箱必须输入！'
          },
        ]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item label="角色" name="role_id" wrapperCol={{ span: 10 }} rules={[
          {
            required: true,
            message:'角色必须选择！'
          },
        ]}>
          <Select placeholder="请选择角色">
            {
              roles.map(role =>
                <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
              )
              
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </Card>
  )

  

}
