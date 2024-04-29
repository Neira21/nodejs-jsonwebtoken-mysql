// Para pruebas, no es para la authentificación de usuarios
import { Router } from "express";
import connectDB from '../connection.js'
import { getAllUsers, getUserById } from '../controllers/UserController.js';

export const userRouter = Router()

userRouter.get('/', getAllUsers )

userRouter.get('/:id', getUserById )

userRouter.post('/signup', async (req, res) => {
  const {name, contact, email, password, status, role} = req.body
  const [result, ] = await connectDB.query('insert into users (name, contact, email, password, status, role) values (?,?,?,?,?,?)', [name, contact, email, password, status, role])
  console.log(result)
  if(result.affectedRows === 1){
    res.json({id: result.insertId, name, contact, email, status, role})
  }else{
    res.json({error: 'user not created'})
  }
})
