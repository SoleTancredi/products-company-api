import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role'

//registro de un usuario
export const signUp = async (req, res) => {
    const {username, email, password, roles} = req.body;

    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password) //guardo la contraseña cifrada
    })

    //verificacion de roles
    if(roles){
        const foundRoles = await Role.find({name: {$in: roles}}); //si tiene busca cual
        newUser.roles = foundRoles.map(roles => roles._id) //lo mapea y le asigna el id
    }else{ //sino
        const roles = await Role.findOne({name: "user"}); //busca user
        newUser.roles = [roles._id] //le asigna su id
    }

    const savedUser = await newUser.save();
    console.log(savedUser)
    
    //creacion de un token 
    //primer param q dato guardo dentro del token, second palabraSecreta utilizada para generar
    //el token, tercero objeto de configuracion
    const token = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400 //24hrs
    })

    res.status(200).json({token});
}

export const signIn = async (req, res) => {
   const userFound = await User.findOne({email: req.body.email}).populate("roles"); //buscamos si existe el email

   if(!userFound) return res.status(400).json({message: 'User Not Found'}); //si no existe 

   const matchPassword = await User.comparePassword(req.body.password, userFound.password); //si existe compara la contraseña

   if(!matchPassword) return res.status(401).json({token: null, message: 'Invalid Password'}); //rechaza si es invalida

   const token = jwt.sign({id: userFound._id}, config.SECRET, { //busco el token correspondiente
    expiresIn: 86400
   })

   res.json({token}) //devuelve el token

}