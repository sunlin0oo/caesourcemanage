// 管理侧边栏伸缩的状态
// 需要定义初始状态
export const CollapsedReducer = (prevState = {
    isCollapsed: false
}, action) => {
    let { type } = action;

    switch (type) {
        case 'change_collapsed':
            let newState = { ...prevState }
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState

    }
}