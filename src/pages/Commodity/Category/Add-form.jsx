// 添加分类组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select} from 'antd';

export default class AddForm extends Component{

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Form
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 17,
        }}
      >
        <Form.Item label="所属分类" name="category" rules={[
          {
            required: true,
          },
        ]}
                   initialValue="0"
        >
          <Select >
            <Select.Option value="0">一级分类</Select.Option>
            <Select.Option value="1">家用电器</Select.Option>
            <Select.Option value="2">电脑</Select.Option>
            <Select.Option value="3">图书</Select.Option>
            <Select.Option value="4">食品</Select.Option>
            <Select.Option value="5">服装</Select.Option>
          </Select>
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
    )
  }

}
