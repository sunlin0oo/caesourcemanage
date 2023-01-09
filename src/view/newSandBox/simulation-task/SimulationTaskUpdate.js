import React, { useState, useRef, useEffect } from 'react';
import { Button, Steps, PageHeader, Form, InputNumber, Select, Badge, Descriptions, notification } from 'antd';
import './css/SimulationTaskAdd.css';
import axios from 'axios';
import WithRouter from '../../../components/WithRouter';

const { Step } = Steps
const { Option } = Select

// 用于记录算法目录
const categories = ['GPU', 'CPU'];
// 用于记录材质目录
const materialCategories = ['ABS树脂', '铝', "铁", "铅", "聚丙烯", "聚氯乙烯", "钢", "木"];
// 用于记录结果控制目录
const resultControlCategories = ['位移'];
function SimulationTaskUpdate(props) {
  // 将内容填充到Form中
  useEffect(() => {
    axios.get(`/simulationtasks/${props.history.match.id}?_expand=gridstask`).then(res => {
      console.log('simulationtasksres', res);
      console.log('res.data', res.data);
      let { accuracy, algorithm, kernel, material, resultcontrol, gridstask} = res.data;
      const name = gridstask.name;
      setNameInfo(name);
      nameForm.current.setFieldsValue({
        name,
      });
      DetailForm.current.setFieldsValue({
        material,
        resultcontrol,
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
  // 记录网格的模型名称
  const [gridName, setGridName] = useState([]);
  // 用于记录当前步骤所在
  const [current, setCurrent] = useState(0);
  // 记录模型名称
  const [nameInfo, setNameInfo] = useState("");
  // 记录仿真细节
  const [detailInfo, setDetailInfo] = useState('');
  // cosnt 
  const nameForm = useRef(null);
  const DetailForm = useRef(null);
  // 用于记录网格的模型名称
  useEffect(() => {
    axios.get('/gridstasks').then(res => {
      const list = res.data;
      setGridName(list);
    })
  }, []);

  const next = () => {
    if (current === 0) {
      // 表单校验
      nameForm.current.validateFields().then(res => {
        setNameInfo(res.name);
        setCurrent(current + 1);
      }).catch(error => {
        console.log(error)
      })
    } else if ((current === 1)) {
      // 表单校验
      DetailForm.current.validateFields().then(res => {
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
      axios.patch(`/simulationtasks/${props.history.match.id}`, {
        "createtime": Date.now(),
        "state": auditState,
        "material": detailInfo.material,
        "resultcontrol": detailInfo.resultcontrol,
        "finishtime": null,
        "algorithm": detailInfo.algorithm,
        "kernel": detailInfo.kernel,
      }).then(res => {
        props.history.push('/simulation-task/category');
        notification.info({
          message: `通知`,
          description:
            `恭喜您，成功提交仿真任务`,
          placement: 'bottomRight',
        });
      })
    }
    return (
      <div>
        {/* 页头 */}
        <PageHeader
          className="site-page-header"
          title="仿真任务"
          subTitle="Simulation Task"
        />
        {/* 步骤条 */}
        <Steps current={current}>
          <Step title="模型名称" description={'模型名称'} />
          <Step title="内容选择" description={'仿真细节选择'} />
          <Step title="任务提交" description={'对仿真内容进行确认，提交'} />
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
              <Select disabled={true}>
                {
                  gridName.map(item => <Option key={item.id}>{item.name}</Option>)
                }
              </Select>
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
              label="材质"
              name="material"
              rules={[{ required: true, message: 'Please input your material!' }]}
            >
              <Select>
                {
                  materialCategories.map(item => <Option key={item} value={item}>{item}</Option>)
                }
              </Select>
            </Form.Item>
  
            <Form.Item
              label="核数"
              name="kernel"
              rules={[{ required: true, message: 'Please input your kernel!' }]}
            >
              <InputNumber min={1} max={10} />
            </Form.Item>
  
            <Form.Item
              label="仿真算法选择"
              name="algorithm"
              rules={[{ required: true, message: 'Please input your algorithm!' }]}
            >
              <Select>
                {
                  categories.map(item => <Option key={item} value={item}>{item}</Option>)
                }
              </Select>
            </Form.Item>
  
            <Form.Item
              label="结果控制"
              name="resultcontrol"
              rules={[{ required: true, message: 'Please input your resultcontrol!' }]}
            >
              <Select>
                {
                  resultControlCategories.map(item => <Option key={item} value={item}>{item}</Option>)
                }
              </Select>
            </Form.Item>
  
          </Form>
        </div>
        <div className={current === 2 ? '' : 'active'}>
  
          <Descriptions title="最终内容" bordered>
            <Descriptions.Item label="模型名称">{nameInfo}</Descriptions.Item>
            <Descriptions.Item label="材质">{detailInfo.material}</Descriptions.Item>
            <Descriptions.Item label="核数">{detailInfo.kernel}</Descriptions.Item>
            <Descriptions.Item label="算法">{detailInfo.algorithm}</Descriptions.Item>
            <Descriptions.Item label="结果控制">{detailInfo.resultcontrol}</Descriptions.Item>
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
              <Button danger onClick={() => handleSave(0)}>任务提交</Button>
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
export default WithRouter(SimulationTaskUpdate);