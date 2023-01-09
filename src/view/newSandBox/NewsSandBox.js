import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
//components
import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
// antd
import { Layout, Spin } from 'antd';
// css
import './newSandBox.css'
// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { connect } from 'react-redux';
const { Content } = Layout;
function NewsSandBox(props) {
  // console.log(props);
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            {/* 孩子*/}
            <Outlet></Outlet>
          </Spin>
        </Content>
      </Layout>

    </Layout>

  )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  // 拿取到CollapsedReducer 中的初始值
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsSandBox)