/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useNavigate,useParams,useLocation } from 'react-router-dom'

export default function WithRouter(Component) {
    // 将接收到的属性继续往下传
    return function (props) {
        const push = useNavigate();
        const match = useParams();
        const location = useLocation()
        // 接收原组件，返回原组件的值，然后再添加上自定义的属性
        return <Component {...props} history={{push,match,location}}></Component>
    }
}

