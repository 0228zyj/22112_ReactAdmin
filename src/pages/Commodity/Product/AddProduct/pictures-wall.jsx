/* 图片上传组件（这个其实只要写成类式组件就行（使用老师的）。因为写成函数式组件比较麻烦，并且有些小bug） */
import React, { useState , forwardRef, useImperativeHandle,useEffect } from 'react';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import {message, Modal, Upload} from 'antd';
import {reqDeleteImg} from '../../../../api'
import {BASE_IMG_URL} from "../../../../utils/constants";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/*
forwardRef((props, ref) => {
  // passing the ref to a DOM element,
  // so that the parent has a reference to the DOM node
  return <input style={{color: "red"}} {...props} ref={ref} />
});
*/

const PicturesWall = forwardRef((props, ref) => {

  const [previewOpen, setPreviewOpen] = useState(false); // 标识是否显示大图预览Modal
  const [previewImage, setPreviewImage] = useState(''); // 大图的url
  const [previewTitle, setPreviewTitle] = useState(''); // Modal的title标题
  // 图片数组
  const [fileList, setFileList] = useState([
    /*{
      uid: '-1', // 每个file都有自己唯一的id
      name: 'image.png', // 图片文件名
      status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
    },*/
  ]);

  /* 初始化图片数组 */
  const initImgs = ()=>{
    let fileListImgs = []
    if(props.imgs && props.imgs.length > 0){
      fileListImgs = props.imgs.map((img,index)=> (
        {
          uid: -index+'', // 每个file都有自己唯一的id
          name: img, // 图片文件名
          status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
          // url: BASE_IMG_URL + img, // 图片地址（这是后台服务器的）
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ))
    }

    setFileList(fileListImgs)
  }

  useImperativeHandle(ref, () => ({
    getImgs: getImgs,
  }))

  // 关闭Modal的回调
  const handleCancel = () => setPreviewOpen(false);

  // 点击眼睛，预览图片时：打开Modal，并预览图片（显示指定file对应的大图）
  const handlePreview = async (file) => { 
    console.log('handlePreview()',file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  /*
    上传中、完成、失败、移除图片都会调用这个函数。
      file: 当前操作的文件对象
      fileList: 当前的文件列表
      event: 上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持
  */
  const handleChange = async ({ file,fileList,event }) => {
    // console.log('handleChange()',file.status,file,event,file===fileList[fileList.length-1]);

    // 一旦上传成功, 将当前上传的file的信息修正(name，url)
    if(file.status === "done"){ // 标识上传图片成功
      const result = file.response // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      const {name,url} = result.data
      fileList[fileList.length-1].name = name
      fileList[fileList.length-1].url = url
      message.success('图片上传成功!')
    }else if(file.status === "error"){
      message.error('上传图片失败')
    }else if(file.status === "removed"){ // 删除图片（既要删除fileList上的图片对象（点击删除图标会自动删除更新），也要删除服务器端图片（需要手动删除））
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success('后台图片删除成功!')
      }else {
        message.error('后台图片删除失败!')
      }
    }

    // 在操作(上传/删除)过程中更新fileList状态
    setFileList(fileList)
  }

  /* 用于在组件加载完,初始化图片数组（最好的方式是：在组件初始化之前就应该指定好Imgs的状态，只是现在找不到对应的hook方法，后期在更改） */
  useEffect(()=>{ // 当组件加载完时
    initImgs()

    return ()=>{ // 返回函数
    }
  },[])

  /* 获取所有已上传图片文件名的数组 */
  const getImgs = ()=>{
    return fileList.map(file => file.name)
  }

  // 上传按钮样式的设置
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      <Upload
        action="/manage/img/upload" /* action表示 上传图片的接口地址 */
        accept='image/*'  /* 只接收任何的图片格式文件 */
        listType="picture-card"  /* 卡片样式 */
        name='image' /* 请求参数名（发到后台的文件参数名） */
        fileList={fileList} /* 已经上传的文件列表（受控） */
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {/* 限制图片最多上传7张 */}
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
})
PicturesWall.propTypes={
  imgs: PropTypes.array
}
export default PicturesWall;

