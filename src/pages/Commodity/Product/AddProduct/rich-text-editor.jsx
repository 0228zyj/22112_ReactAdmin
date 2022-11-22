/* 富文本编辑器 组件 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
// 引入富文本编辑器的样式
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {

  static propTypes = {
    detail: PropTypes.string
  }

  state = {
    editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
      }
    }

  }

  /*
    输入修改内容过程中的实时的回调
  */
  onEditorStateChange = (editorState) => {
    console.log('onEditorStateChange()')
    this.setState({
      editorState,
    })
  }

  /* 返回输入的文本数据对应的html格式的文本 */
  getDetail = () => {
    // 返回输入的文本数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  /* 添加本地图片的功能的回调 */
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          resolve({data: {link: url}})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }

  render() {
    const {editorState} = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
        onEditorStateChange={this.onEditorStateChange}
        // 添加本地图片的功能需要的属性toolbar（配置对象），以及配置对象中的属性image
        // 富文本编辑框的 上传图片、添加表情等功能不能使用（应该是因为我用的版本和老师不一样的区别，到时候在该官网上在看看）
        toolbar={{
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      />
    )
  }
}



