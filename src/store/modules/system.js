
const getDefaultState = () => {
  return {
    editFlowRoute: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_EDIT_ROUTE: (state, value) => {
    state.editFlowRoute = value
  }
}

const actions = {
  // user login
  prepareEditFlowRoute({ commit }, item) {
    commit('SET_EDIT_ROUTE', item)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
