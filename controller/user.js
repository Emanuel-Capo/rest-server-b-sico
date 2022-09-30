const {response, request}= require('express')
const bcrypt=require('bcryptjs')

const Usuario= require('../models/usuarios');

const getUsuario= async(req=request, res=response)=> {

    const {limite=5, desde=0}=req.query
    const query= {estado:true}

    //const usuarios = await Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    //const total = await Usuario.countDocuments(query)

    //lo mismo que arriba, pero respuestas simultaneas
    const [total,usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
  }

  const postUsuario= async (req, res=response)=> {

    

    const {nombre, correo, password, rol} = req.body
    const usuario=new Usuario({nombre, correo, password, rol})

   

    //encriptar contraseña
    const salt=bcrypt.genSaltSync();
    usuario.password=bcrypt.hashSync(password,salt)

    //guardar en Base de Datos
    await usuario.save();


    res.json({
        msg:"post API - controlador",
        usuario
    })
  }

  const putUsuario= async (req, res=response)=> {

    const {id}=req.params
    const{_id, password, google, correo, ...resto}=req.body

    if(password){
      const salt=bcrypt.genSaltSync();
      resto.password=bcrypt.hashSync(password,salt)
    }

    const usuario=await Usuario.findByIdAndUpdate(id,resto)

    res.json(usuario)
  }

  const deleteUsuario=async (req=request, res=response)=> {

    const {id}=req.params;

    const usuarioAutenticado=req.usuario

    //borrar fisicamente (no recomendado)
    //const usuario= await Usuario.findByIdAndDelete(id);

    //cambiar estado a false
    const usuario= await Usuario.findByIdAndUpdate(id, {estado:false})

    res.json({usuario,usuarioAutenticado})
  }


  module.exports={
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
  }