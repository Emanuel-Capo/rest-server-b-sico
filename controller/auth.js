const {response, request}= require('express')
const bcrypt=require('bcryptjs')

const Usuario= require('../models/usuarios');
const generarJWT = require('../helpers/generar-jwt');
const googleVerify = require('../helpers/google-verify');


const login=async (req,res=response)=>{

    const {correo,password}=req.body;

    try {
        //verificar si email existe
        const usuario= await Usuario.findOne({correo})
        if (!usuario){
            return res.status(400).json({'msg':'Correo/Contraseña incorrectos - correo'})
        }

        //es usuario activo?
        if(!usuario.estado){
            return res.status(400).json({'msg':'Correo/Contraseña incorrectos - estado:false'})
        }

        //verificar contraseña
        const validPassword=bcrypt.compareSync(password,usuario.password)
        if (!validPassword){
            return res.status(400).json({'msg':'Correo/Contraseña incorrectos - contraseña'})
        }

        //generar JWT
        const token= await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({'msg':'Hable con el administrador'})
    }    
}

const googleSignIn=async(req,res=response)=>{
    const{id_token}=req.body

    try {
        const {nombre,img,correo}=await googleVerify(id_token);

        let usuario=await Usuario.findOne({correo})
        if(!usuario){
            const data={
                nombre,
                correo,
                password:':)',
                img,
                google:true
            }

            usuario=new Usuario(data)
            await usuario.save()
        }

        if(!usuario.estado){
            return res.status(401).json({msg:'Usuario bloqueado'})
        }

        const token= await generarJWT(usuario.id)
        

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({msg: 'Token de google no valido'})
    }



}


module.exports={
    login,
    googleSignIn
}