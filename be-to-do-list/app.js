const express = require('express')
const cors = require('cors')
const router = require('./routers/router')
const app = express()
const { getEnv } = require('./helpers/getEnv');
const jwt = require('jsonwebtoken');
const jwtSecret = getEnv('SECRET')
const port = 8080
function authenticateToken(req, res, next) {
  let reqPath = req.path
  console.log(typeof reqPath)
  if (req.method === 'GET') {
      // If it's a GET request, skip token verification and move to the next middleware
      next();
      return;
  }else if (reqPath.includes('/user')) {
      next();
      return;
  }
  if (!req.headers.authorization) {
      return res.status(403).send({ error: 'No credentials sent!' });
  }
  let token = req.headers.authorization;
  token = token.split(" ")
  try {
      const decoded = jwt.verify(token[1], jwtSecret);  
      req.user = decoded;
      next(); 
  } catch(err) {
      console.log('JWT verification failed', err);
      res.send(err)
  }
}

app.use(cors())
app.use(express.json())
app.use(authenticateToken)
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})