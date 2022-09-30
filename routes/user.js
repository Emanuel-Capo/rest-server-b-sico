const {Router}=require('express')
const { check } = require('express-validator')

const { 
  getUsuario, 
  postUsuario, 
  putUsuario, 
  deleteUsuario } = require('../controller/user')

  const {
    esRoleValido, 
    emailExiste, 
    existeUsuarioId} = require('../helpers/dbValidators')

// const{validarCampos}= require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { esAdminRole, tieneRole } = require('../middlewares/validar-rol')
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole}=require('../middlewares')

const router = Router()

router.get('/', getUsuario)

  router.post('/',[
    check('nombre', 'Nombre requerido').not().isEmpty(),
    check('password', 'La contraseña debe de tener un mínimo de 6 caracteres').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'El rol no existe').isIn(["ADMIN_ROLE","USER_ROLE"]),
    check('rol').custom(esRoleValido),
    validarCampos
  ], postUsuario)

  router.put('/:id',[
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos
  ], putUsuario)

  router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
  ], deleteUsuario)



  module.exports=router