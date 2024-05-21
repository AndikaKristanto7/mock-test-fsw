const app = require("@forkjs/group-router");
const { getEnv } = require('../helpers/getEnv');
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = getEnv('SECRET')
const saltRounds = 10;
const prisma = new PrismaClient()

async function getUserByUsername(username){
    return await prisma.user.findUnique({
        where : {
            username
        }
    })
}
async function insertUser(data){
    bcrypt.hash(data.pin, saltRounds, async function(err, hash) {
        return await prisma.user.create({
            data : {
                username : data.username,
                pin : hash,
            }
        })
    });   
}

app.group("/api/v1",() =>{
    app.group('/user', () => {
        app.post('/register', async (req,res) => {
            const {username,pin,confirmPin} = req.body
            try{
                if(pin != confirmPin){
                    throw {code:400,error:true,msg:'Confirmation PIN is not match!'}
                }

                let getUserByUsernameResult = await getUserByUsername(username)
                if(getUserByUsernameResult){
                    throw {code:503,error:true,msg:'User/email exist!'}
                }

                await insertUser(req.body)
                return res.status(200).json({code:200,error:false,msg:`Create user with username ${username} success!`})
            }catch(e){
                return res.status(e.code).json(e)
            }
        })

        app.post('/login',async (req,res) => {
            const {username, pin} = req.body
            try{
                let getUserByUsernameResult = await getUserByUsername(username)
                if(!getUserByUsernameResult){
                    throw {code:500,error:true,msg:'User/email not found!'}
                }

                let hashedPin = getUserByUsernameResult.pin
                bcrypt.compare(pin, hashedPin, function(err, result) {
                    if(!result){
                        throw {code:500,error:true,msg:'User/email not found!'}
                    } 
                });

                var token = jwt.sign({ username,pin:hashedPin }, jwtSecret,{expiresIn: 30 * 60});
                return res.status(200).json({
                    error:false,code:200,msg:'Login Success',
                    data:{
                        username,
                        pin:hashedPin,
                        token
                    }
                })
            }catch(e){
                return res.status(e.code).json(e)
            }
        })
    })
})

module.exports = app.router;