const MAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASS_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const validarTitulo = (titulo) => titulo !== null && titulo.value.trim().length >= 3
const validarImg = (img) => img !== null && typeof img !== 'undefined' &&  typeof img.files[0] !== 'undefined'
const validarStatus = (status) => status !== null && (status.publico.checked || status.privado.checked)
const validarCanvas = (canvas) => {
  console.log(canvas.toDataURL("image/png"));
  return canvas.toDataURL("image/png") !== null
}

const validarRegex = (regex, mail) => {
  console.log(regex.test(mail));
  return regex.test(mail)
}


export const validarFormPost = (titulo, img, status) =>  validarStatus(status) && validarImg(img)  && validarTitulo(titulo)
export const validarFormAjax = (titulo, canvas, status) => validarStatus(status) && validarTitulo(titulo) && validarCanvas(canvas)
export const validarComentario = (titulo, contenido) => validarTitulo(titulo) && validarTitulo(contenido)
export const validarUsuario = (nombre, correo, password) => validarTitulo(nombre) && validarRegex(MAIL_REGEX, correo) && validarRegex(PASS_REGEX, password)
