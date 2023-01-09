import React, { useEffect, useState, useRef } from 'react'
import { Space, Table, Button,Modal,Switch} from 'antd';
import axios from 'axios';
import moment from 'moment';
import PlugModelForm from '../../../components/Form/PlugModelForm';

import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function Plugmodel() {
  // 控制是否更新表单
  const updateForm = useRef(null);
  // 获取数据文件
  const [dataSource, setDataSource] = useState([])
  // 禁止更新状态
  const [isUpdateDisable, setIsUpdateDisable] = useState(false); //这里的作用是什么
  // 添加用户信息更新状态
  const [isUpdateVisible, setIsUpdateVisible] = useState(false); //这里的作用是什么
  // 获取当前选中的表单
  const [currentItem, setCurrentItem] = useState(null);
  const columns = [
    {
      title: '模块编号',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <h1>{id}</h1>,
    },
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      render: (state, item) => {
        return <div>
          <Switch checked={item.state} onChange={() => switchMethod(item)}></Switch>
        </div>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
          <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
        </Space>
      ),
    },
  ];
  useEffect(() => {
    axios.get('/plugmodel').then(res => {
      // console.log('NewsCategory-res.data', res.data);
      const list = res.data;
      setDataSource(list);
    })
  }, []);
  const switchMethod = (item) => {
    // 存在引用关系，则会一直受影响
    item.state = item.state === 1 ? 0 : 1;
    // 强制更新
    setDataSource([...dataSource]);
    if ((item.grade === 1)) {
      axios.patch(`/plugmodel/${item.id}`, {
        state: item.state,
      })
    } else {
      axios.patch(`/plugmodel/${item.id}`, {
        state: item.state,
      })
    }
  }
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
  // 打开编辑框
  const handleUpdate = (item) => {
    setIsUpdateVisible(true);//异步
    setCurrentItem(item);
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setIsUpdateVisible(false);
      // 这里res是你表单的格式，要注意表单格式匹配后端格式
      setDataSource(dataSource.map(item => {
        // 从dataSource中找到与当前表单同步的id
        if (item.id === currentItem.id) {
          return {
            ...item,
            ...value,
          }
        }
        return item
      }))
      axios.patch(`/plugmodel/${currentItem.id}`, {
        'name': value.name,
      });
    })
  }

  // 删除方法
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
    // 在处理后端
    axios.delete(`/plugmodel/${item.id}`)
  }
  
  return (
    <div>
      <Table rowKey={item => item.id} columns={columns} dataSource={dataSource} />

      {/* 更新用户弹窗 */}
      <Modal
        open={isUpdateVisible}
        title="更新用户信息"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setIsUpdateVisible(false);
          setIsUpdateDisable(!isUpdateDisable);
        }}
        onOk={() => {
          // console.log('add',addForm);
          updateFormOk()
        }}
      >
        {/* 这里的ref像是回调函数 */}
        <PlugModelForm ref={updateForm} isUpdateDisable={isUpdateDisable}></PlugModelForm>
      </Modal>
    </div>
  )
}
