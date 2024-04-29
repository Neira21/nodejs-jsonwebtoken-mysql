import {config} from 'dotenv'; config()
import express from 'express'
import {userRouter} from './routes/userRouter.js'
import cookieParser from 'cookie-parser';

import router from './routes/router.js'

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.use('/', router )

// Solo de prueba
app.use('/users', userRouter )

//eliminar el cache y que no se pueda volver con el botón back del navegador luego de hacer un logout

// app.use(function(req, res, next) {
//   if(!req.user)
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   next();
// })


// Escuchando en el puerto PORT
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})



