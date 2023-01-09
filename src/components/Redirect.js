import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// 方案二：Redirect组件
export default function Redirect({to}) {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(to,{replace:true})
    })
  return (
    null
  )
}
