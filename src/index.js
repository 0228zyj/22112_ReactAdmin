/*
  入口文件
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
// import { HashRouter } from 'react-router-dom'
/* 最新版的React Route中的BrowserRouter和HashRouter，现在都可以传递state参数了。并且刷新界面时，
BrowserRouter和HashRouter 中还是有保存state参数*/ 

import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";
// 重点：刷新页面的时候，入口文件会重新执行，所有组件会重新渲染！！！
// 读取local中保存的user，保存到内存中
memoryUtils.user = storageUtils.getUser()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
