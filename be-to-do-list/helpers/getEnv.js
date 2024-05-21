require('dotenv').config()
function getEnv(param){
  return process.env[param]
}
module.exports = { getEnv }
