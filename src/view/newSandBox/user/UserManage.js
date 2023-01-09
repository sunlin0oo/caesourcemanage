import React, { useEffect } from 'react'
import { Button, Form, Input, PageHeader, notification} from 'antd';
import axios from 'axios';
import { useRef } from 'react';
import WithRouter from '../../../components/WithRouter';

function UserManage(props) {
  const { id } = JSON.parse(localStorage.getItem('token'));
  const formRef = useRef(null);
  useEffect(()=>{
    axios.get(`/users/${id}`).then(res=>{
      let {username, password, telephone, wechat, company, QQ} = res.data;
      formRef.current.setFieldsValue({
        QQ,
        username,
        password,
        telephone,
        wechat,
        company
      });
    })
  },[id])
  const onFinish = (values) => {
    let {username, password, telephone, wechat, company, QQ} = values;
    axios.patch(`/users/${id}`,{
      username, 
      password, 
      telephone, 
      wechat, 
      company, 
      QQ
    }).then(res => {
      props.history.push('/home');
      notification.info({
        message: `通知`,
        description:
          `恭喜您，成功修改信息`,
        placement: 'bottomRight',
      });
    })
  }
  const onFinishFailed = (errorInfo) => {
    const error = errorInfo.errorFields.reduce((value,item,index)=>{
        return value + item.errors[0] + '\n'
      },"Failed:\n")
    console.log(error)
    alert(error);
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="用户管理"
        subTitle="User Manage"
      />
      <Form
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        ref={formRef}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Telephone"
          name="telephone"
          rules={[
            {
              required: true,
              message: 'Please input your telephone!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Wechat"
          name="wechat"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Company"
          name="company"
          rules={[
            {
              required: false,
              message: 'Please input your company!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="QQ"
          name="QQ"
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>

  );
}
export default WithRouter(UserManage)