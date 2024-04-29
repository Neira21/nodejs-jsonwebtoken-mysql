import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import connectDB from "../connection.js";

import { config } from "dotenv";
config();

import { promisify } from "util";

export const RegisterUser = async (req, res) => {
  try {
    const { name, user, pass } = req.body;

    if(!name || !user || !pass){
      res.render("register", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Todos los campos son obligatorios",
        alertIcon: "info",
        showConfirmButton: true,
        timer: 1000,
        ruta: "register",
      })
      return
    }

    let passHash = await bcryptjs.hash(pass, 8);

    const result = await connectDB.query(
      "INSERT INTO usuarios (name, user, pass) VALUES (?, ?, ?)",
      [name, user, passHash]
    );
    if (result[0].affectedRows > 0) {
      //console.log("Usuario creado con éxito:", result);
      res.redirect("/");
    } else {
      console.log("Error al crear usuario:", result);
    }
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).send("Error al crear usuario");
  }
};

export const LoginUser = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    if (!user || !pass) {
      res.render("login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: undefined,
        ruta: "login",
      });
    } else {
      try {
        const results = await connectDB.query(
          "SELECT * FROM usuarios WHERE user = ?",
          [user]
        );
        //console.log(results)
        if (
          results[0].length == 0 ||
          !(await bcryptjs.compare(pass, results[0][0].pass))
        ) {
          //console.log("Usuario y/o Password incorrectas")
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o Password incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: undefined,
            ruta: "login",
          });
        } else {
          //inicio de sesión OK
          //console.log("generacion de token ////////////////////")
          console.log("asdasdasd", results[0][0].id)

          const id = results[0][0].id;
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRACION,
          });
          //generamos el token SIN fecha de expiracion
          //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
          //console.log("TOKEN: " + token + " para el USUARIO : " + user);

          const cookiesOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookiesOptions);
          res.render("login", {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 800,
            ruta: "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//middleware para verificar si el usuario esta autenticado
export const isUserAuthenticated = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("inicia")
  if (token) {
    console.log("hay un token en la cookie")
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            res.redirect('/login');
          } else {
            console.log("Token decodificado:", decodedToken);
            const [result] = await connectDB.query("SELECT * FROM usuarios WHERE id = ?",[decodedToken.id])
            console.log()
            req.user = result[0];
            next();
          }
          });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/login");
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};
