import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user') || 'null') // 当前用户登录状态
  },
  mutations: {
    // 设置用户登录状态
    setUser(state, payload) {
      state.user = JSON.parse(payload)
      localStorage.setItem('user', payload)
    }
  },
  actions: {},
  modules: {}
});
