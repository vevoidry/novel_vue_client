import axios from 'axios'
import { Message } from 'element-ui'

export function anonymousRequest (config) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://localhost:9090',
      timeout: 5000
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
