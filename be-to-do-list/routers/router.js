const app = require("@forkjs/group-router");
const { getEnv } = require('../helpers/getEnv');
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = getEnv('SECRET')
const saltRounds = 10;
const moment = require('moment')
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

async function getTodosByUsername(username){
    const todos = await prisma.todoList.findMany({
        select : {
            id : true,
            todo : true,
            createdAt : true,
            updatedAt : true
        },
        where : {
            deletedAt : null,
            user : {
                username
            }
        }
    })
    return todos
}


async function insertTodo(data){
    return await prisma.todoList.create({
        data : {
            todo : data.todo,
            updatedAt : null,
            user : {
                connect : {
                    id : data.userId
                }
            }
        }
    })
}
async function getTodoById(id){
    const todo = await prisma.todoList.findUnique({
        select : {
            id : true,
            todo : true,
            createdAt : true,
            updatedAt : true
        },
        where : {
            id,
            deletedAt : null,
        }
    })
    return todo
}

async function updateTodoById(data){
    return await prisma.todoList.update({
        where : {
            id : Number(data.id),
            user : {
                id : data.userId
            }
        },
        data : {
            todo : data.todo,
            user : {
                connect : {
                    id : data.userId
                }
            }
        }
    })
}

async function deleteTodoById(data){
    return await prisma.todoList.update({
        where : {
            id : Number(data.id),
            user : {
                id : data.userId
            }
        },
        data : {
            deletedAt : moment().format()
        }
    })
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
                    throw {code:503,error:true,msg:'User/email not found!'}
                }

                let hashedPin = getUserByUsernameResult.pin
                bcrypt.compare(pin, hashedPin, function(err, result) {
                    if(!result){
                        throw {code:503,error:true,msg:'User/email not found!'}
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
    app.group('/todo', () => {
        app.get('/',async (req,res) => {
            try{
                let getTodosByUsernameResult = await getTodosByUsername(req.query.username)
                return res.send(
                    {
                        code:200,error:false,msg : 'success get data',
                        data : getTodosByUsernameResult
                    }
                )
            }catch(e){
               console.log(e) 
            }
        })
        app.post('/',async (req,res) => {
            const {todo} = req.body
            try{
                let getUserByUsernameResult = await getUserByUsername(req.user.username)
                if(!getUserByUsernameResult){
                    throw {code:503,error:true,msg:'User/email not found!'}
                }
                
                let data = {
                    todo,
                    userId : getUserByUsernameResult.id
                }
                let insertTodoResult = await insertTodo(data)
                if(!insertTodoResult){
                    throw {code:503,error:true,message:'Cannot insert todo!'}
                }
                return res.status(200).json({
                    code:200,
                    error : false,
                    message : 'Success insert todo',
                    data : insertTodoResult
                })
            }catch(e){
                console.log(e)
                return res.status(e.code).json(e)
            }  
        })
        app.put('/',async (req,res) => {
            const {id,todo} = req.body
            try{
                let getUserByUsernameResult = await getUserByUsername(req.user.username)
                if(!getUserByUsernameResult){
                    throw {code:503,error:true,msg:'User/email not found!'}
                }
                                
                let findTodo = await getTodoById(id)
                if(!findTodo){
                    throw {code:503,error:true,msg:'Data not found!'}
                }

                let data = {
                    id,
                    todo,
                    userId : getUserByUsernameResult.id
                }

                let updateTodo = await updateTodoById(data)
                if(!updateTodo){
                    throw {code:503,error:true,message:'Cannot update todo!'}
                }
                return res.status(200).json({
                    code:200,
                    error : false,
                    message : 'Success update todo',
                    data : updateTodo
                })
            }catch(e){  
                console.log(e)
            }
        })
        app.delete('/',async (req,res) => {
            const {id,todo} = req.body
            try{
                let getUserByUsernameResult = await getUserByUsername(req.user.username)
                if(!getUserByUsernameResult){
                    throw {code:503,error:true,msg:'User/email not found!'}
                }
                
                let findTodo = await getTodoById(id)
                if(!findTodo){
                    throw {code:503,error:true,msg:'Data not found!'}
                }

                let data = {
                    id,
                    todo,
                    userId : getUserByUsernameResult.id
                }
                let deleteTodo = await deleteTodoById(data)
                if(!deleteTodo){
                    throw {code:503,error:true,message:'Cannot delete todo!'}
                }
                return res.status(200).json({
                    code:200,
                    error : false,
                    message : `Success delete todo with id ${id}`,
                })
            }catch(e){  
                console.log(e)
                return res.status(e.code).json(e)
            }
        })
    })
})

module.exports = app.router;