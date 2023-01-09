import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  PageHeader,
  notification
} from 'antd';
import axios from 'axios';
import WithRputer from '../../components/WithRouter'
const { Option } = Select;
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register(props) {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    let {username, password, telephone, wechat, company, QQ} = values;
    axios.post(`/users`, {
      username, 
      password, 
      telephone, 
      wechat, 
      company, 
      QQ,
      "roleId": 1,
      "roleState": true,
      "default": true,
    }).then(res => {
      props.history.push('/login');
      notification.info({
        message: `通知`,
        description:
          `恭喜您，成功注册用户`,
        placement: 'bottomRight',
      });
    })
  };

  const onFinishFailed = (errorInfo) => {
    const error = errorInfo.errorFields.reduce((value,item,index)=>{
        return value + item.errors[0] + '\n'
      },"Failed:\n")
    console.log(error)
    alert(error);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      {/* 页头 */}
     <PageHeader
     className="site-page-header"
     title="用户注册"
     subTitle="Register"
   />
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      labelCol={{ span: 4 }} // label 会占4  
      wrapperCol={{ span: 16 }} // input 输入框会占 20
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      scrollToFirstError
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="username"
        label="Username"
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
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="telephone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="company"
        label="Company"
        rules={[
          {
            required: true,
            message: 'Please input your phone Company!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="QQ"
        label="QQ"
        rules={[
          {
            required: true,
            message: 'Please input your phone QQ!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="wechat"
        label="Wechat"
        rules={[
          {
            required: true,
            message: 'Please input your phone QQ!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have already comfirm message
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
    </div>
     
  );
}
export default WithRputer(Register)