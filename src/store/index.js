import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    courses: []
  },
  getters: {
  },
  mutations: {
    sendCourseEffReq(state, resp) {
      state.courses = resp.data.data;
    },
    sendCourseAllReq(state, resp) {
      state.courses = resp.data.data;
    }
  },
  actions: {
    async sendCourseEffReq(context, user) {
      try {
        const resp = await axios.post('http://127.0.0.1:8080/sched/eff', {
          uid: user.uid,
          termStartDate: user.termStartDate
        });
        if (resp.data.code === 20010) {
          Message.warning('获取课程信息失败, 请联系管理员处理');
          return;
        }
        context.commit('sendCourseEffReq', resp);
      } catch (error) {
        Message.error('Server Err');
      }
    },
    async sendCourseAllReq(context, user) {
      try {
        const resp = await axios.post('http://127.0.0.1:8080/sched/all', {
          uid: user.uid,
        });
        if (resp.data.code === 20010) {
          Message.warning('获取课程信息失败, 请联系管理员处理');
          return;
        }
        context.commit('sendCourseEffReq', resp);
      } catch (error) {
        Message.error('Server Err');
      }
    },
  },
  modules: {
  }
})
