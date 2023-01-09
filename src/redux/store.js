import { combineReducers, legacy_createStore as createStore } from "redux";
import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage: storage,
    // 不想要持久化的黑名单
    blacklist: ['LoadingReducer'] // navigation will not be persisted
}
// 将众多reducer进行切片，然后再合并到一个reducer里面进行操作
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)


const store = createStore(persistedReducer)
const persistor = persistStore(store)
export {
    store,
    persistor
}

/**
 * store.dispatch() 发送==>要求进行修改
 * 
 * store.subsribe() 订阅==>修改进行同步
 */