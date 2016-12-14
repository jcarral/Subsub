import {validarUsuario} from './lib/validaciones.js'
import {errorModal} from './lib/modals.js'

const firstPass = document.getElementById('user_pass')
const repeatPass = document.getElementById('repeatPass')
const submitUser = document.getElementById('user_Confirmar')
const formUser = document.querySelector('.registro>form')
const nameUser = document.getElementById('user_name')
const mailUser = document.getElementById('user_mail')

const equalsPass = (e) => {
  if(firstPass.value !== repeatPass.value){
    repeatPass.style = 'border:1px solid red'
    return false
  }
  else {
    repeatPass.style = 'border:1px solid #DBDBDB'
    return true
  }
}

const submitNewUser = (e) => {
  if(!validarUsuario(nameUser, mailUser.value, firstPass.value) || !equalsPass()){
    e.preventDefault()
    errorModal('Los campos del registro no son validos')
  }
}

export const setLogin = () => {
  if(repeatPass !== null) repeatPass.addEventListener('keyup', equalsPass)
  if(formUser !== null) formUser.addEventListener('submit', submitNewUser)
}
