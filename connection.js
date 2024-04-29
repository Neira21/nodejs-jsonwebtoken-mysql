import { config } from 'dotenv';
config();

import mysql from 'mysql2/promise';

let connectDB;

try {
  connectDB = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  });
  console.log('Conectado a la base de datos');
} catch (err) {
  console.error('Error al conectar a la base de datos:', err);
}

export default connectDB;