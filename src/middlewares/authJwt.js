//verifica si tiene token, si es moderador, user o admin
import jwt from 'jsonwebtoken';
import config from '../config';
import User from  '../models/User';
import Role from '../models/Role';

export const verifyToken = async (req, res, next) => {
    try{
        const token = req.headers["x-access-token"]; //recibimos un token

        if(!token) return res.status(403).json({message: "No token provided"}); //coprobamos si no existe

        const decoded = jwt.verify(token, config.SECRET); //si existe extraemos su contenido
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0}); //devuelve un id, buscamos a ese usuario
        if(!user) return res.status(404).json({message: 'No user found'}); //en caso de que no se encuentre
        
        next();//permite que continue con la siguiente ruta en routes
    }catch(error){
        return res.status(401).json({message: 'Unauthorized'});
    }
}

//las funciones que sigan aqui debajo van a contener el userId porque estan escritas debaj
//de su creacion

export const isModerator = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id:{$in: user.roles}});

    for(let i = 0; i < roles.length; i++){
        if(roles[i].name === "moderator"){
            next();
            return;
        }

    }

    return res.status(403).json({message: "Required Moderator role"});
}

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id:{$in: user.roles}});

    for(let i = 0; i < roles.length; i++){
        if(roles[i].name === "admin"){
            next();
            return;
        }
    }

    return res.status(403).json({message: "Required Admin role"});
}
