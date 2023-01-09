import React, { useEffect, useState } from 'react'
import { Space, Table, Button, Tag, Modal} from 'antd';
import axios from 'axios';
import moment from 'moment';
import WithRouter from '../../../components/WithRouter';

import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
const maskList = [ '进行中', '失败', '已完成'];
const colorList = ['orange', 'green', 'red'];
function GridTask(props) {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/gridstasks').then(res => {
      // console.log('NewsCategory-res.data', res.data);
      const list = res.data;
      setDataSource(list);
    })
  }, []);
  const columns = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <h1>{id}</h1>,
    },
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '精细度',
      dataIndex: 'accuracy',
      key: 'accuracy',
    },
    {
      title: '核数',
      dataIndex: 'kernel',
      key: 'kernel',
    },
    {
      title: '算法',
      dataIndex: 'algorithm',
      key: 'algorithm',
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
      render: (createtime) => <div>
        {moment(createtime).format('YYYY/MM/DD HH:mm:ss')}
      </div>
    },
    {
      title: '完成时间',
      dataIndex: 'finishtime',
      key: 'finishtime',
      render: (finishtime) => <div>
        {finishtime === null?"未完成": moment(finishtime).format('YYYY/MM/DD HH:mm:ss')}
      </div>
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      render: (state, item) => {
        return <Tag color={colorList[state]} key={item}>{maskList[state]}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
          <Button shape="circle" size={'large'} icon={<EditOutlined />} onClick={() => props.history.push(`/grid-task/update/${item.id}`)}/>
        </Space>
      ),
    },
  ];
  // 确认删除框==>对话框
  const delConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 删除方法
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
    // 在处理后端
    axios.delete(`/gridstasks/${item.id}`)
  }
  return (
    <div>
      <Table rowKey={item => item.id} columns={columns} dataSource={dataSource} 
      pagination={{
          pageSize: 4
        }} />
    </div>
  )
}
export default WithRouter(GridTask)