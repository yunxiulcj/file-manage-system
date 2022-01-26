const state = {
  symSetting: {},
  capacity: {},
}
const getters = {
  symSetting: (state) => {
    return state.symSetting
  },
  capacity: (state) => {
    return state.capacity
  },
}
const mutations = {
  SET_SYM_SETTING(state, symSetting) {
    state.symSetting = symSetting
  },
  SET_CAPACITY(state, capacity) {
    state.capacity = capacity
  },
}
const actions = {}
export default {
  state,
  mutations,
  getters,
  actions,
}
