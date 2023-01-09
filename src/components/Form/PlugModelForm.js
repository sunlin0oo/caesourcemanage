import React, { forwardRef} from 'react'
import { Form, Input, } from 'antd'
// 可以通过forwardRef在父组件所创建的ref对象透传到子组件的对象上，相当于把子的函数方法给了父亲，回调函数进行处理
const PlugModelForm = forwardRef((props, ref) => {

    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="模块名称"
                    rules={[{ required: true, message: 'Please input the username of collection!' }]}
                >
                    <Input></Input>
                </Form.Item>
            </Form>
        </div>
    )
})
export default PlugModelForm