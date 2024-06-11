const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  serverIp: state => state.user.serverIp,
  userLevel: state => state.userInfo && state.userInfo.user_system ? state.userInfo.user_system.userLevel : null
}
export default getters
