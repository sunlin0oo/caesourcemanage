import React, { useEffect, useState } from 'react'
import { Layout, Menu, Button } from 'antd';
import { connect } from 'react-redux';
import {
  VideoCameraOutlined,
  ZoomInOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import './css/index.css'
import withRouter from '../../components/WithRouter';
import axios from 'axios'
const { Sider } = Layout;
function SideMenu(props) {
  const [items, setItems] = useState(null);
  // 图标映射表
  const IconMap = {
    '/home': <PieChartOutlined />,
    '/plug-model': <VideoCameraOutlined />,
    '/grid-task': <AppstoreOutlined />,
    '/simulation-task': <ContainerOutlined />,
    '/resultfile': <ZoomInOutlined />,
  }
  
  // const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  
    // 权限判断
    const checkPagePermission = (item) => {
      // item 是所有的侧边栏==>pagepermisson是否有展现权限，rights(当前的登录用户的权限列表).includes(侧边栏的router)==> 当前的登录用户的权限列表是有侧边栏的权限
      return item.pagepermisson
    }
  // 创建树结构
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const MakemenuTree = (menuList) => {
    const tree = [];
    // eslint-disable-next-line array-callback-return
    menuList.map((item, index) => {
      if (checkPagePermission(item)) {
      // 权限设置
        const note = {
          key: item.key,
          icon: IconMap[item.key],
          label: item.title
        }
        if (item.children && item.children.length !== 0 && checkPagePermission(item)) {
          note.children = MakemenuTree(item.children)// 重新调用函数 创建一个子树进行使用
        }
        tree.push(note);
      }
    })
    return tree;
  }

  const toggleCollapsed = () => {
    // setCollapsed(!collapsed);
    props.changeCollapsed();
  };

  useEffect(() => {
    // _embed=comments(数组名字)==>进行表关联的功能==>向下关联
    axios.get('/rights?_embed=children ').then(res => {
      console.log('侧边栏', res.data);
      setItems(MakemenuTree(res.data));
    })
  }, [])

  function click(e) {
    props.history.push(e.key);
  }

  return (
    // 不知道的去看文档
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} reverseArrow={true} >
      <div className="logo" >CAE资源管理平台</div>
      <div style={{ width: '100%' }}>
        {/* 控制缩进侧边栏 */}
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={['']}
          defaultOpenKeys={['']}
          mode="inline"
          theme="dark"
          items={items}
          // onOpenChange={() => openChange()}
          onClick={click}
        />
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  // 拿取到CollapsedReducer 中的初始值
  return {
    isCollapsed
  }
}

const mapDispatchToPros = {
  // 这就是发送到store中交给reducer==>寻找对应的action中进行处理(action中需要type属性)
  changeCollapsed(){
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps,mapDispatchToPros)(withRouter(SideMenu))
