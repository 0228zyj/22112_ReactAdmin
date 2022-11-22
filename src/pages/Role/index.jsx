// 角色管理组件
import React, { useState , useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { Card,Button,Table,Divider,Modal,Input,Form,Tree,message } from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from '../../utils/dateUtild'
import {reqRoles,reqAddRole,reqRolePemissions} from '../../api'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";

let columns = [] // 定义表格头
const rolesData = [
  {
    "menus":[
      "home",
      "commodity",
      "category",
      "product",
      "role"
    ],
    "_id":"5ca9eac0b412",
    "name":"角色1",
    "create_time": 1554639552758,
    "__v":0,
    "auth_time": 1557630307021,
    "auth_name":"admin",
  },
  {
    "menus":[
      "home",
      "commodity",
      "category",
    ],
    "_id":"5ca9eac0b434",
    "name":"角色2",
    "create_time": 1554639536419,
    "__v":0,
    "auth_time": 1558410638946,
    "auth_name":"admin",
  },
  {
    "menus":[
      "home",
      "commodity",
      "product",
      "role"
    ],
    "_id":"5ca9eac0b456",
    "name":"测试",
    "create_time": 1554639552758,
    "__v":0,
    "auth_time": 1557630307021,
    "auth_name":"admin",
  },
]; // 表格静态角色数据

let treeData = [  // 定义树列表根节点数据
  {
    title: '平台权限',
    key: '平台权限',
  }
]
let newCheckedKeysValue = [] // 表示最新的选中的值的数组（最新的menus）

export default function Role (){

  const [roles,setRoles] = useState([]) // 所有角色的列表
  const [role,setRole] = useState({}) // 当前选中的role
  const [isShowAdd,setIsShowAdd] = useState(false) // 是否显示添加界面
  const [isShowAuth,setIsShowAuth] = useState(false) // 是否显示设置权限界面
  const [checkedKeys,setCheckedKeys] = useState([])
  const navigate = useNavigate()

  const [form] = Form.useForm()

  // 设置行属性
  const onRow = role => {
    {
      return {
        onClick: event => { // 点击行
          setRole(role)
          setCheckedKeys(role.menus)
          console.log(role.menus)
        } 
      }
    }
  }

  /* 添加角色功能 */
  const AddRole = async () => {
    
    form.validateFields(["roleName"]).then(async (values)=>{

      // 隐藏添加角色框
      setIsShowAdd(false)

      // 清除输入的数据
      form.resetFields()

      // 收集输入的数据
      const {roleName} = values
      console.log(roleName)

      // 请求添加
      const result = await reqAddRole(roleName)

      // 根据结果提示并更新列表显示
      if(result.status === 0){
        message.success('添加角色成功')
        // getRoles()

        // 新产生的角色
        const newRole = result.data
        console.log(newRole)

        /*roles.push(newRole)
        setRoles(roles)*/

        setRoles([...roles,newRole])

      }else{
        message.error('添加角色失败')
      }

    }).catch(()=>{
      // 清除输入的数据
      form.resetFields()
      message.warn('添加角色失败')
    })
   
  }

  /* 当选中某个node时的回调 */ 
  
  const onCheck = (checkedKeysValue) => {
    // console.log('onCheck', checkedKeysValue);
    newCheckedKeysValue = checkedKeysValue
    setCheckedKeys(checkedKeysValue)
  }

  /* 设置角色权限功能 */
  const SetRolePermissions = async ()=>{
    // setIsShowAuth(false)
    const updateRole = role
    updateRole.menus = newCheckedKeysValue
    updateRole.auth_time = Date.now()
    updateRole.auth_name = memoryUtils.user.username

    // 请求更新
    const result = await reqRolePemissions(updateRole)
    if(result.status === 0){
      // 隐藏设置角色权限框
      setIsShowAuth(false)
      // 如果更新的是当前用户的隶属于的角色的权限, 则强制退出
      if(role._id === memoryUtils.user.role_id){
        // 退出前先清空内存和本地的数据
        memoryUtils.user = {}
        storageUtils.removeUser()
        navigate('/login',{
          replace:true
        })
        message.success('当前登录的用户角色权限被修改,请重新登录')
      }else{
        message.success('设置角色权限成功')
        getRoles()
      }
    }else{
      message.success('设置角色权限失败')
    }

  }

  /* 异步获取roles数据 */ 
  const getRoles = async ()=>{
    const result = await reqRoles()
    if(result.status === 0){
      const roles = result.data
      setRoles(roles)
    }
  }

  /* 初始化表格头 */
  const initColumns = ()=>{
    columns = [  
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // 这里调用render函数可以对该列的数据进行加工处理在显示数据
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        // 这里调用render函数可以对该列的数据进行加工处理在显示数据
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  /* 得到树列表的完整数据 */
  const getTreeNodes = (menuList)=>{
    return menuList.reduce((pre,item)=>{
      pre.push({
        title:item.title,
        key:item.key,
        children: item.children? getTreeNodes(item.children) : null
      })
      return pre
    },[])
  }

  initColumns() // 初始化表头数据
  treeData[0].children = getTreeNodes(menuList) // 初始化树列表数据

  useEffect(()=>{
    // 发送Ajax请求动态获取角色列表数据
    getRoles()
    // console.log(roles)

    // 静态获取数据
    // setRoles(rolesData)
  },roles)

  // 指定Item布局的配置对象
  const formItemLayout = {
    labelCol: { span: 5 },  // 左侧label的宽度
    wrapperCol: { span: 15 }, // 右侧包裹的宽度
  }
    
  return (
    /*<div>
      <Button type="primary" style={{margin:"20px 0 0 30px"}} onClick={this.showModal}>创建角色</Button>
      <Button type="primary" disabled={this.state.isDisabled} style={{margin:"20px 0 0 30px"}} onClick={this.showModal}>设置角色权限</Button>
      <Divider style={{margin:"15px 0 20px 0"}}/>
      <Table
        rowSelection={{
        type: "radio",
        ...this.rowSelection,
        }} bordered columns={columns}
        dataSource={data}
        pagination={{
          defaultPageSize: 3,
        }}
        style={{width:'95%',margin:"0 auto"}}/>
      <Divider />
      <Modal title="添加角色" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
        <form>
          <div>
            <span style={{color:"red"}}>*</span>
            角色名称：<Input style={{ width: 320,}} placeholder="请输入角色名称" />
          </div>
        </form>
      </Modal>
    </div>*/
    <Card
      title={(
        <span>
          <Button type="primary" style={{marginRight:10}} onClick={()=> setIsShowAdd(true) }>创建角色</Button>
          <Button type="primary" disabled={role._id ? false : true} onClick={()=> setIsShowAuth(true) }>设置角色权限</Button>
        </span>
      )}
    >
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys: [role._id],
          onChange: (selectedRowKeys, selectedRows) => {
            setRole(selectedRows[0])
            setCheckedKeys(selectedRows[0].menus)
          }
        }}
        bordered
        rowKey="_id"
        columns={columns}
        dataSource={roles}
        pagination={{
          defaultPageSize: PAGE_SIZE,
        }}
        onRow={onRow}
        />
        {/* 添加角色框 */}
        <Modal title="添加角色" open={isShowAdd} onOk={AddRole} onCancel={()=>{setIsShowAdd(false) 
          form.resetFields()}}>
          <Form form={form}>
            <Form.Item label="角色名称" name="roleName" {...formItemLayout} rules={[
              {
                required: true,
                message:'角色名称必须输入！'
              },
            ]}>
              <Input placeholder="请输入角色名称" />
            </Form.Item>
          </Form>
        </Modal>
        {/* 设置角色权限框 */}
        <Modal title="设置角色权限" open={isShowAuth} onOk={SetRolePermissions} onCancel={()=>{setIsShowAuth(false)
        setCheckedKeys(role.menus)}}>
          <div style={{marginBottom:30}}>
            <span style={{marginLeft:30,marginRight:10}}>角色名称:</span>
            <Input style={{width:300}} value={role.name} disabled />
          </div>
          <Tree
            checkable
            defaultExpandAll={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
          />
        </Modal>
    </Card>
  )
  

  
}
