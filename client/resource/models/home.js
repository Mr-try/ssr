// import { add, getHomeInfo } from 'services/home'

export default {
  namespace: 'home',
  state: {
    count: 0,
    homeInfo: {name: 'try', age: 18}
  },
  effects: {
    getHomeInfo() {
      return {text: 1}
    },
    * add({count}, { put }) {
      yield put({
        type: 'putData',
        payload: {count: count++} 
      })
      return 2
    }
  },
  reducers: {
    putData(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
