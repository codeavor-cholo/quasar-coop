import moment from 'moment'
import Vue from 'vue'

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$moment = moment
}
