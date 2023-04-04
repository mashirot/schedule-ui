import Vue from 'vue'
import Vuex from 'vuex'
import authAxios from '@/util/authAxios.js';
import { Message } from 'element-ui'
import router from '@/router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    courses: [],
    authToken: ''
  },
  getters: {
  },
  mutations: {
    sendCourseEffReq(state, resp) {
      state.courses = resp.data.data;
    },
    sendCourseAllReq(state, resp) {
      state.courses = resp.data.data;
    },
    sendCourseSelReq(state, resp) {
      state.courses = resp.data.data;
    },
    updateAuthToken(state, authToken) {
      state.authToken = authToken;
    }
  },
  actions: {
    async sendCourseEffReq(context, user) {
      try {
        const resp = await authAxios.post('https://api.schedule.mashiro.ski/sched/eff', {
          uid: user.uid,
          termStartDate: user.termStartDate
        });
        if (resp.data.code === 20010) {
          Message.warning('获取课程信息失败, 请联系管理员处理');
          return;
        } else if (resp.data.code === 10000) {
          Message.warning('登录过期，请重新登陆');
          context.dispatch('jumpToLogin');
          return;
        }
        context.commit('sendCourseEffReq', resp);
      } catch (error) {
        Message.error('Server Err');
      }
    },
    async sendCourseAllReq(context, user) {
      try {
        const resp = await authAxios.post('https://api.schedule.mashiro.ski/sched/all', {
          uid: user.uid,
        });
        if (resp.data.code === 20010) {
          Message.warning('获取课程信息失败, 请联系管理员处理');
          return;
        } else if (resp.data.code === 10000) {
          Message.warning('登录过期，请重新登陆');
          context.dispatch('jumpToLogin');
          return;
        }
        context.commit('sendCourseEffReq', resp);
      } catch (error) {
        Message.error('Server Err');
      }
    },
    async sendCourseSelReq(context, { user, conditionSelForm }) {
      try {
        const selData = {
          uid: user.uid
        };
        if (conditionSelForm.isEff === "true") {
          selData.termStartDate = user.termStartDate;
        }
        selData.dayOfWeek = conditionSelForm.dayOfWeek;
        const resp = await authAxios.post('https://api.schedule.mashiro.ski/sched/sel', selData);
        if (resp.data.code === 20010) {
          Message.warning('获取课程信息失败, 请联系管理员处理');
          return;
        } else if (resp.data.code === 10000) {
          Message.warning('登录过期，请重新登陆');
          context.dispatch('jumpToLogin');
          return;
        }
        context.commit('sendCourseEffReq', resp);
      } catch (error) {
        Message.error('Server Err');
      }
    },
    jumpToLogin() {
      router.push('/');
    },
    updateAuthToken(context, authToken) {
      context.commit('updateAuthToken', authToken);
    }
  },
  modules: {
  }
})
