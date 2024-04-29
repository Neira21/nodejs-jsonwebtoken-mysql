import connectDB from '../connection.js'

export const getAllUsers = async (req, res) => {
  try {
    const [result, ] = await connectDB.query('SELECT * FROM users')
    res.send(result)
    if(result.length === 0){
      res.json({error: 'users not found'})
    }
  }catch(err){
    console.error('Error al obtener todos los usuarios:', err);
    res.status(500).send('Error al obtener todos los usuarios');
  }
}

export const getUserById = async (req, res) => {
  const {id} = req.params
  console.log(id)
  try {
    const [result, ] = await connectDB.query('select * from users where id = ?', [id])
    if(result.length === 0){
      res.json({error: 'user not found'})
    } else{
      res.send(result)
    }
  } catch (error) {
    res.send(error)
  }
}