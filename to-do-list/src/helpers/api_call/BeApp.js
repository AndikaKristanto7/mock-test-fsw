import httpCall from '../../helpers/Http'

const Env = require('../../helpers/Env')

const env = new Env()

class BeApp {
  constructor() {
    this.baseUrl = `${env.getEnv('API_URL')}`
    this.v1Url = `${this.baseUrl}/api/v1`
  }

  userRegister(data){
    return httpCall.post(`${this.v1Url}/user/register`,data)
  }

  userLogin(data){
    return httpCall.post(`${this.v1Url}/user/login`,data)
  }

  refreshToken(data){
    return httpCall.post(`${this.baseUrl}/refresh-token`,data)
  }

  getTodoByUsername(username){
    return httpCall.get(`${this.v1Url}/todo`,username)
  }

  insertTodo(data){
    return httpCall.post(`${this.v1Url}/todo`,data)
  }

  editTodo(data){
    return httpCall.put(`${this.v1Url}/todo`,data)
  }

  deleteTodo(data){
    return httpCall.delete(`${this.v1Url}/todo/${data.id}`)
  }

}
export default new BeApp()