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

  refreshToken(email){
    return httpCall.post(`${env.getEnv('API_URL')}/refresh-token`,email)
  }

}
export default new BeApp()