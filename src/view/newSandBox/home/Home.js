import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, List, Row, Avatar, Drawer } from 'antd';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import WithRouter from '../../../components/WithRouter';

import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
// 用于记录材质目录
const materialCategories = ["钢", '铝', 'ABS树脂', "铁", "铅", "聚丙烯", "聚氯乙烯", "木"];
function Home(props) { 
  const [dataGridSource, setDataGridSource] = useState([]);
  const [dataSimSource, setDataSimSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const barRef = useRef();
  const pieRef = useRef();
  
  // 获取到网格数量
  useEffect(() => {
    axios.get('/gridstasks?state=2&_sort=finishtime&_order=desc&_limit=6').then(res => {
      console.log('grid-res', res.data);
      setDataGridSource(res.data)
    })
  }, []); 

  // 获取到仿真数量
  useEffect(() => {
    axios.get('/simulationtasks?state=2&_expand=gridstask&_sort=finishtime&_order=desc&_limit=6').then(res => {
      console.log('sim-res', res.data);
      setDataSimSource(res.data)
    })
  }, []);


  // 柱状图
  useEffect(() => {
    // 所有发布的新闻
    axios.get('/simulationtasks').then(res => {
      // _.groupBy 可以对其进行分类处理
      renderBarView(_.groupBy((res.data), item => item.material));
    })

    return () => {
      window.onresize = null; // 清楚resize事件，防止频繁调用
    }
  }, []);

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);
    console.log('obj', obj);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '材质选择'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: materialCategories,
        axisLabel: {
          rotate: '60',
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    }
  }

  const onClose = () => {
    setVisible(false);
  };

  const handleEdit = () => {
    props.history.push('/user-manage');
  }

  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="近期已经完成的网格任务" bordered={true}>
            <List
              size="small"
              dataSource={dataGridSource}
              renderItem={item => <List.Item><a href={`#/grid-task/category`}>{item.name}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="近期已经完成的仿真任务" bordered={true}>
            <List
              size="small"
              dataSource={dataSimSource}
              renderItem={item => <List.Item><a href={`#/simulation-task/category`}>{item.name}</a></List.Item>}
            />
          </Card> 
        </Col>
        {/* 创建用户信息栏 */}
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                // DOM节点是异步创建，所以需要用定时器暂缓异步进行
                setVisible(true);
              }} />,
              <EditOutlined key="edit" onClick={()=>handleEdit()}/>,
            ]}
            bordered={true}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <span>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width={'500px'} title="消息通知" placement="right" closable={true} open={visible} onClose={onClose}  >
        <div ref={pieRef} id="main" style={{ width: '90%', height: '400px', marginTop: '30px' }}></div>
      </Drawer>
      <div ref={barRef} id="main" style={{ width: '90%', height: '400px', marginTop: '30px' }}></div>
    </div>
  )
}

export default WithRouter(Home)