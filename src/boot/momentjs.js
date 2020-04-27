import moment from 'moment'

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$moment = moment
}
