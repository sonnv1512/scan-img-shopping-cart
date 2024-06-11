import Cookies from 'js-cookie'

const TokenKey = 'token'
const userInfo = 'userInfo'
const userName = 'userName'
const version = 'version'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  const info = Cookies.get(userInfo)
  return info ? JSON.parse(info) : info
}

export function setUserInfo(token) {
  return Cookies.set(userInfo, token)
}

export function removeUserInfo() {
  return Cookies.remove(userInfo)
}

export function getUserName() {
  return Cookies.get(userName)
}

export function setUserName(token) {
  return Cookies.set(userName, token)
}

export function removeUserName() {
  return Cookies.remove(userName)
}

export function getVersion() {
  return Cookies.get(version)
}

export function setVersion(token) {
  return Cookies.set(version, token)
}

export function removeVersion() {
  return Cookies.remove(version)
}
