import React from 'react'
import './link-button.css'

/*
    外形像链接的按钮
      注意：在定义函数式组件的时候，如果该组件想要使用props属性，可以直接在该组件的形参处定义props形参。
            因为在渲染函数式组件的时候，默认会向该组件传递props属性
*/
export default function LinkButton(props){

  return <button {...props} className="link-button"></button>

}