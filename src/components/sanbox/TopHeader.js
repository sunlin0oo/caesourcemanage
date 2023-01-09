/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { connect } from 'react-redux';
import {
  UserOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Space, Menu, Avatar } from 'antd';
import WithRouter from '../WithRouter'
const { Header } = Layout;
function TopHeader(props) {
  // console.log('TopHeader-props', props)
  // const [collapsed, setCollapsed] = useState(false);
  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          {roleName}
        </a>
      ),
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ]
  const click = (e) => {
    console.log('e', e);
    console.log('props', props);
    //注意this指向问题，采用箭头函数this就指向当前组件
    if (e.key === '2') {
      localStorage.removeItem('token');
      props.history.push('/login');
    }

  }

  const menu = (
    <Menu
      items={items}
      onClick={click}
    />
  );



  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    // 改变Store中isCollapsed
    props.changeCollapsed();
  }
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: () => setCollapsed(!collapsed),
    })} */}
      {
        // 头导航栏是否收起
        props.isCollapsed ? <MenuUnfoldOutlined onClick={() => changeCollapsed()}></MenuUnfoldOutlined> :
          <MenuFoldOutlined onClick={() => changeCollapsed()}></MenuFoldOutlined>
      }
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}
/**
 * connect(
 *    mapStateToProps 将redux中的状态映射成属性==>可以自定义属性
 *    mapDispatchToPros 将dispatch中的方法映射成属性
 * )(被包装的组件)
 * eg:
  const mapStateToProps = () =>{
    return {
      a:1
    }
}
// 在TopHeader中会新增一个属性a
export default connect(mapStateToProps)(WithRouter(TopHeader))
 */

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
// 在TopHeader中会新增一个属性a
export default connect(mapStateToProps,mapDispatchToPros)(WithRouter(TopHeader))
