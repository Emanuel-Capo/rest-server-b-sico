const { request, response } = require('express');
const jwt=require('jsonwebtoken');

const Usuario=require('../models/usuarios')


const validarJWT=async (req=request,res=response,next)=>{

    const token=req.header('authorization');

    if(!token){
        return res.status(401).json({'msg':'no hay token'})
    }

    try {
        
        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario=await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({msg:'token no válido - usuario no existe'})
        }

        //verificar estado del usuario
        if(!usuario.estado){
            return res.status(401).json({msg:'token no válido - usuario false'})
        }

        req.usuario=usuario;
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({msg:'token no válido'})
    }
}


module.exports={
    validarJWT
}