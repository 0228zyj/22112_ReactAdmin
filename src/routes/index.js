import { Navigate } from 'react-router-dom'
import Login from "../pages/Login";
import System from "../pages/System";
import Home from "../pages/Home";
import Category from "../pages/Commodity/Category";
import Product from "../pages/Commodity/Product/Home";
import AddProduct from "../pages/Commodity/Product/AddProduct";
import Detail from "../pages/Commodity/Product/Detail";
import User from "../pages/User";
import Role from "../pages/Role";
import ColumnChart from "../pages/Charts/ColumnChart";
import LineChart from "../pages/Charts/LineChart";
import PieChart from "../pages/Charts/PieChart";
import Order from "../pages/Order";
import NotFound from '../pages/not-found/NotFound';

// 函数式组件才能使用路由表
export default [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/system',
    element: <Navigate to="/system/home" />
  },
  {
    path: '/system',
    element: <System />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'category',
        element: <Category />
      },
      {
        path: 'product',
        element: <Product />,
      },
      {
        path: 'product_add',
        element: <AddProduct />
      },
      {
        path: 'product_detail',
        element: <Detail />
      },
      {
        path: 'user',
        element: <User />
      },
      {
        path: 'role',
        element: <Role />
      },
      {
        path: 'charts',
        children: [
          {
            path: 'column_chart',
            element: <ColumnChart />
          },
          {
            path: 'line_chart',
            element: <LineChart />
          },
          {
            path: 'pie_chart',
            element: <PieChart />
          },
        ]
      },
      {
        path: 'order',
        element: <Order />
      },
      {
        // path: '*' 表示为如果不是路由表中路由，则跳转到NotFound组件的界面
        path: '*', 
        element: <NotFound />
      }
    ]
  },
  {
    // path: '*' 表示为如果不是路由表中路由，则跳转到NotFound组件的界面
    path: '*', 
    element: <NotFound />
  }
]