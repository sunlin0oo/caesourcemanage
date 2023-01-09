import React, { useEffect, useState } from 'react'
import { Space, Table, Button, Tag, Modal, Popover, Switch } from 'antd';
import axios from 'axios';
import moment from 'moment';

import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  CloudOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function ResultFile() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/simulationtasks?state=2&_expand=gridstask').then(res => {
      console.log('resultFile-res.data', res.data);
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
      render: (name, item) => <div>
        {item.gridstask.name}
      </div>,
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
      title: '材质',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: '结果控制',
      dataIndex: 'resultcontrol',
      key: 'resultcontrol',
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
        {finishtime === null ? "未完成" : moment(finishtime).format('YYYY/MM/DD HH:mm:ss')}
      </div>
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
          <Button type='primary' shape="circle" size={'large'} icon={<CloudOutlined />} />
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
    axios.delete(`/simulationtasks/${item.id}`)
  }
  return (
    <div>
      <Table rowKey={item => item.id} columns={columns} dataSource={dataSource} />
    </div>
  )
}
