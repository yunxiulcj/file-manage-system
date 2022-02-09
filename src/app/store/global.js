const state = {
  symSetting: {},
  capacity: {},
  downloadForm: {},
  approvalForm: {},
}
const getters = {
  symSetting: (state) => {
    return state.symSetting
  },
  capacity: (state) => {
    return state.capacity
  },
  downloadForm: (state) => {
    return state.downloadForm
  },
  approvalForm: (state) => {
    return state.approvalForm
  },
}
const mutations = {
  SET_SYM_SETTING(state, symSetting) {
    state.symSetting = symSetting
  },
  SET_CAPACITY(state, capacity) {
    state.capacity = capacity
  },
  SET_DOWNLOADFORM(state, downloadForm) {
    state.capacity = downloadForm
  },
  SET_APPROVALFORM(state, approvalForm) {
    state.approvalForm = approvalForm
  },
}
const actions = {}
export default {
  state,
  mutations,
  getters,
  actions,
}
