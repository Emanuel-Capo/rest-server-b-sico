
const Role=require('../models/role')
const Usuario=require('../models/usuarios')


const esRoleValido=async (rol='')=>{
    const existeRol=await Role.findOne({rol});
    if(!existeRol){
      throw new Error(`El rol ${rol} no existe en la BD`)
    }
  }

//verificar correo
  const emailExiste=async (correo)=>{
  const existeMail= await Usuario.findOne({correo});
  if (existeMail){
    throw new Error(`El email ${correo} ya existe en la BD`)
  }
  }

  //verificar id
  const existeUsuarioId=async (id)=>{
    const existeUsuario= await Usuario.findById(id);
    if (!existeUsuario){
      throw new Error(`El id ${id} no existe en la BD`)
    }
    }

  module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioId
  }