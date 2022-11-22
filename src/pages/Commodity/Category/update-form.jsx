// 更新分类组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form,Input } from 'antd';

export default class UpdateForm extends Component{

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
  }

  render() {
    const {categoryName} = this.props
    console.log(categoryName); // 输出的是变化后的值，为什么界面上的值没有改变？难道必须写在state中？这样其实也不行？
    return (
        <Form
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 17,
          }}
        >
          <Form.Item label="分类名称" name="categoryName" rules={[
            {
              required: true,
              message:'请输入新的分类名称'
            },
          ]}
           // initialValue={categoryName}
          >
            <Input placeholder="请输入新的分类名称" />
          </Form.Item>
        </Form>
    )
  }

}
