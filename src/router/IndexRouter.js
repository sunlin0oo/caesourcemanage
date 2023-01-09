/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../view/login/Login'
import NewsSandBox from '../view/newSandBox/NewsSandBox'
import Redirect from '../components/Redirect';
import NotFound from '../view/nopermission/NotFound'
import axios from 'axios';
import PlugModel from '../view/newSandBox/plug-model/Plug-model'
import PlugModelAdd from '../view/newSandBox/plug-model/PlugModelAdd'
import GridTask from '../view/newSandBox/grid-task/GridTask'
import SimulationTask from '../view/newSandBox/simulation-task/SimulationTask'
import Home from '../view/newSandBox/home/Home'
import SimulationTaskAdd from '../view/newSandBox/simulation-task/SimulationTaskAdd';
import GridTaskAdd from '../view/newSandBox/grid-task/GridTaskAdd';
import ResultFile from '../view/newSandBox/resultFile/resultFile';
import GridTaskUpdate from '../view/newSandBox/grid-task/GridTaskUpdate';
import SimulationTaskUpdate from '../view/newSandBox/simulation-task/SimulationTaskUpdate';
import UserManage from '../view/newSandBox/user/UserManage';
import Register from '../view/register/Register';

const LocalRouterMap = {
    "/plug-model/category": <PlugModel />,
    "/grid-task/category": <GridTask />,
    "/simulation-task/category": <SimulationTask />,
    "/simulation-task/create": <SimulationTaskAdd></SimulationTaskAdd>,
    "/grid-task/create": <GridTaskAdd></GridTaskAdd>,
    "/grid-task/update/:id": <GridTaskUpdate></GridTaskUpdate>,
    "/simulation-task/update/:id":<SimulationTaskUpdate></SimulationTaskUpdate>,
    "/plug-model/create": <PlugModelAdd></PlugModelAdd>,
    "/resultfile": <ResultFile></ResultFile>,
    "/user-manage": <UserManage></UserManage>,
    "/home": <Home />,
}
export default function IndexRouter() {
    const [backrouteList, setBackRouteList] = useState([]);
    const checkRoute = (item) => {
        // 判断送进来路由是否有对应组件存在 且 路由是打开状态  才可以进行访问 item.pagepermisson过滤是否有页面的权限  item.routepermisson是否路由权限
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    useEffect(() => {
        // promise.all()成功时，在then（result）中result是个数组
        Promise.all([
            axios.get(`/rights`),
            axios.get(`/children`),
        ]).then(res => {
            // console.log(res);
            // 将所有的权限放在一块，扁平化处理
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    return (
        <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<AuthComponent>{<NewsSandBox />}</AuthComponent>}>
                {
                    backrouteList.map(item => {
                        if (checkRoute(item)) {
                            return <Route path={item.key.slice(1)} key={item.key.slice(1)} element={LocalRouterMap[item.key]}></Route>
                        }
                    }
                    )
                }
                <Route path='' element={<Redirect to='/home'></Redirect>}></Route>
                {
                    // 解决数据没有传输过来导致路由无法渲染的问题(会短暂的存在Notfound的图标)
                    backrouteList.length > 0 && <Route path='*' element={<NotFound></NotFound>}></Route>
                }
            </Route>
            <Route path='/register' element={<Register />}></Route>
        </Routes>
    )
}

// 路由拦截组件的封装
function AuthComponent({ children }) {
    const isLogin = localStorage.getItem('token');
    return isLogin ? children : <Redirect to='/login'></Redirect>;
}
