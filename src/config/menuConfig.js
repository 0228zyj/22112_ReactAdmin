import { AppstoreOutlined, WindowsOutlined, AreaChartOutlined,
  HomeOutlined,UserOutlined,SafetyOutlined,
  UnorderedListOutlined,ToolOutlined,BarChartOutlined,
  LineChartOutlined,PieChartOutlined} from '@ant-design/icons';

const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: 'home', // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的 (表示对任何用户都是可见的)
  },

  {
    title: '商品',
    key: 'commodity',
    icon: <AppstoreOutlined />,
    children: [ // 子菜单列表
      {
        title: '品类管理',
        key: 'category',
        icon: <UnorderedListOutlined />
      },
      {
        title: '商品管理',
        key: 'product',
        icon: <ToolOutlined />
      },
    ]
  },

  {
    title: '用户管理',
    key: 'user',
    icon: <UserOutlined />
  },

  {
    title: '角色管理',
    key: 'role',
    icon: <SafetyOutlined />,
  },

  {
    title: '图形图表',
    key: 'charts',
    icon: <AreaChartOutlined />,
    children: [
      {
        title: '柱形图',
        key: 'charts/column_chart',
        icon: <BarChartOutlined />
      },
      {
        title: '折线图',
        key: 'charts/line_chart',
        icon: <LineChartOutlined />
      },
      {
        title: '饼图',
        key: 'charts/pie_chart',
        icon: <PieChartOutlined />
      },
    ]
  },

  {
    title: '订单管理',
    key: 'order',
    icon: <WindowsOutlined />,
  },
]

export default menuList