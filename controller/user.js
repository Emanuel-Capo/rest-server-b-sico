const {response, request}= require('express')

const getUsuario= (req, res=response)=> {

    const {nombre = 'no name', apikey}=req.query;

    res.json({
        msg:"get API - controlador",
        nombre,
        apikey
    })
  }

  const postUsuario=  (req, res=respose)=> {

    //const body = req.body
    const{nombre, id}=req.body
    res.json({
        msg:"post API - controlador",
        nombre,
        id
    })
  }

  const putUsuario= (req, res=response)=> {

    const id=req.params.id

    res.json({
        msg:"put API - controlador",
        id
    })
  }

  const deleteUsuario=(req, res=response)=> {
    res.json({
        msg:"delete API - controlador"
    })
  }


  module.exports={
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
  }