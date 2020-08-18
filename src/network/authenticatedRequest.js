import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

export function authenticatedRequest (config) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://localhost:9090',
      timeout: 5000
    })
    instance.interceptors.request.use(
      config => {
        if (store.state.tokenData != null) {
          config.headers.authorization = 'bearer ' + store.state.tokenData.access_token
        }
        return config
      },
      err => {
        return Promise.reject(err)
      })
    instance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response.status === 400 || error.response.status === 401 || error.response.status === 403) {
          console.log(11)
          Message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
        } else {
          Message({
            showClose: true,
            message: error,
            type: 'error'
          })
        }
        return Promise.reject(error)
      })
    instance(config)
      .then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
  })
}
