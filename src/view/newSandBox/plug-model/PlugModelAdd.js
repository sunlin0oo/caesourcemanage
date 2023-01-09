import React, { useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  PageHeader,
  notification
} from 'antd';
import axios from 'axios';

export default function PlugModelAdd() {
    // 控制是否更新表单
    const addForm = useRef(null);
    const handleAddForm = (item) =>{
      addForm.current.validateFields().then(value => {
        axios.post(`/plugmodel`, {
          ...value,
          "createtime" : Date.now()
        }).then(res => {
          notification.info({
            message: `通知`,
            description:
              `恭喜您，成功您，成功添加${value.name}模块`,
            placement: 'bottomRight',
          });
        })
      })
    }
  return (
    <>
      <PageHeader
        className="site-page-header"
        title="插件模块添加"
      />
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        ref={addForm}
      >
        {/* 需要加上name */}
        <Form.Item label="模块名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Radio" name="state">
          <Radio.Group>
            <Radio value={1}> 开启 </Radio>
            <Radio value={0}> 停用 </Radio>
          </Radio.Group>
        </Form.Item>
          <Button type="primary" onClick={()=> handleAddForm()}>提交</Button>
      </Form>
    </>
  )
}
