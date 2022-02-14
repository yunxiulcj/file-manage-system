import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './locales/en'
import usLocal from './locales/zh-CN'
import locale from 'element-ui/lib/locale'
import enEle from 'element-ui/lib/locale/lang/en'
import zhEle from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)
const messages = {
  en: {
    ...enLocale,
    ...enEle,
  },
  zh: {
    ...usLocal,
    ...zhEle,
  },
}
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh',
  messages,
})
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
