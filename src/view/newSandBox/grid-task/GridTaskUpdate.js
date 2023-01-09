import React, { useState, useRef, useEffect } from 'react';
import { Button, Steps, PageHeader, Form, InputNumber, Input, Select, Badge, Descriptions, notification } from 'antd';
import './css/GridTaskAdd.css';
import axios from 'axios';
import WithRouter from '../../../components/WithRouter';

const { Step } = Steps
const { Option } = Select

// 用于记录算法目录
const categories = ['GPU', 'CPU'];
function GridTaskUpdate(props) {
  // 用于记录当前步骤所在
  const [current, setCurrent] = useState(0);
  // 记录模型名称
  const [nameInfo, setNameInfo] = useState('');
  // 记录网格细节
  const [detailInfo, setDetailInfo] = useState('');

  const nameForm = useRef(null);
  const DetailForm = useRef(null);
  // 将内容填充到Form中
  useEffect(() => {
    axios.get(`/gridstasks/${props.history.match.id}`).then(res => {
      console.log('res.data', res.data);
      let { accuracy, algorithm, kernel, name } = res.data;
      setNameInfo(name);
      nameForm.current.setFieldsValue({
        name
      });
      DetailForm.current.setFieldsValue({
        accuracy,
        algorithm,
        kernel
      });
      setDetailInfo({
        accuracy,
        algorithm,
        kernel
      });
    })
  }, [props.history.match.id])


  const next = () => {
    if (current === 0) {
      // 表单校验
      nameForm.current.validateFields().then(res => {
        setNameInfo(res);
        setCurrent(current + 1);
      }).catch(error => {
        console.log(error)
      })
    } else if ((current === 1)) {
      // 表单校验
      DetailForm.current.validateFields().then(res => {
        console.log(res);
        setDetailInfo(res);
        setCurrent(current + 1);
      }).catch(error => {
        console.log(error)
      })
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  // 保存表单内容
  const handleSave = (auditState) => {
    axios.patch(`/gridstasks/${props.history.match.id}`, {
      "name": nameInfo.name,
      "createtime": Date.now(),
      "state": auditState,
      "algorithm": detailInfo.algorithm,
      "kernel": detailInfo.kernel,
      "accuracy": detailInfo.accuracy,
      "finishtime": null
    }).then(res => {
      props.history.push('/grid-task/category');
      notification.info({
        message: `通知`,
        description:
          `恭喜您，成功提交网格任务`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      {/* 页头 */}
      <PageHeader
        className="site-page-header"
        title="网格任务"
        subTitle="Grid Task"
      />
      {/* 步骤条 */}
      <Steps current={current}>
        <Step title="模型名称" description={'模型名称'} />
        <Step title="内容选择" description={'网格化细节选择'} />
        <Step title="任务提交" description={'对网格内容进行确认，提交'} />
      </Steps>
      {/* 文本显示 */}
      <div className={current === 0 ? '' : 'active'}>
        <Form
          name="basic"
          // 一共是24份  
          labelCol={{ span: 0 }} // label 会占4  
          wrapperCol={{ span: 20 }} // input 输入框会占 20
          initialValues={{ remember: true }}
          ref={nameForm} // 校验功能
          autoComplete="off"
          className='form'
        >
          <Form.Item
            label="模型名称"
            name="name"
            rules={[{ required: true, message: 'Please input your modelName!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
      <div className={current === 1 ? '' : 'active'}>
        <Form
          name="basic"
          // 一共是24份  
          labelCol={{ span: 0 }} // label 会占4  
          wrapperCol={{ span: 20 }} // input 输入框会占 20
          initialValues={{ remember: true }}
          ref={DetailForm} // 校验功能
          autoComplete="off"
          className='form'
        >
          <Form.Item
            label="精细度"
            name="accuracy"
            rules={[{ required: true, message: 'Please input your accuracy!' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item
            label="核数"
            name="kernel"
            rules={[{ required: true, message: 'Please input your kernel!' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item
            label="网格算法选择"
            name="algorithm"
            rules={[{ required: true, message: 'Please input your algorithm!' }]}
          >
            <Select>
              {
                categories.map(item => <Option key={item} value={item}>{item}</Option>)
              }
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={current === 2 ? '' : 'active'}>

        <Descriptions title="最终内容" bordered>
          <Descriptions.Item label="模型名称">{nameInfo.name}</Descriptions.Item>
          <Descriptions.Item label="精细度">{detailInfo.accuracy}</Descriptions.Item>
          <Descriptions.Item label="核数">{detailInfo.kernel}</Descriptions.Item>
          <Descriptions.Item label="算法">{detailInfo.algorithm}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Badge status="processing" text="空闲" />
          </Descriptions.Item>
        </Descriptions>

      </div>

      {/* 推进按钮 */}
      <div className="steps-action">
        {current < 2 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {/* 提交按钮 */}
        {current === 2 && (
          <>
            <Button danger onClick={() => handleSave(1)}>任务提交</Button>
          </>
        )}
        {/* 返回按钮 */}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  )
}
export default WithRouter(GridTaskUpdate);