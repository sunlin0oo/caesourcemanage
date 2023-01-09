// 管理侧边栏伸缩的状态
// 需要定义初始状态
export const LoadingReducer = (prevState = {
    isLoading: true
}, action) => {
    console.log(action)
    let { type, payload} = action;

    switch (type) {
        case 'change_loading':
            let newState = { ...prevState }
            newState.isLoading = payload
            return newState
        default:
            return prevState

    }
}