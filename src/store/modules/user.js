import { logout } from '@/api/user'
import {
  getToken, setToken, removeToken,
  getUserInfo, setUserInfo, removeUserInfo,
  getUserName, setUserName, removeUserName } from '@/utils/auth'
import { resetRouter } from '@/router'
import axios from 'axios'
import StatusType from '@/class/StatusType'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUserName(),
    avatar: '',
    userInfo: {
      user_system: {
        ID: 1,
        userLevel: 1,
        departmentId: 1,
        departmentName: 'abc'
      }
    }, //getUserInfo()
    serverIp: StatusType.serverIp
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER_INFO: (state, info) => {
    state.userInfo = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password} = userInfo
    const params = {
      username: username.trim(),
      password: password,
      // captchaId: captchaId,
      // verifyValue: verifyValue
    }
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: StatusType.serverIp + 'crm/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: params
      })
        .then(function(res) {
          const data = res.data

          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          const userInfo = {
            user_system: {
              ID: 1,
              userLevel: 1,
              departmentId: 1,
              departmentName: 'abc'
            }
          }
          commit('SET_USER_INFO', userInfo)
          setUserInfo(userInfo)

          resolve()
        })
        .catch(function(err) {
          reject(err)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const user_system = state.userInfo.user_system
      const data = {
        name: user_system.userName,
        avatar: ''
      }
      commit('SET_NAME', 'Xin chào')
      setUserName('Xin chào')
      // commit('SET_AVATAR', data.avatar)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          removeUserInfo()
          removeUserName()
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUserInfo()
      removeUserName()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
