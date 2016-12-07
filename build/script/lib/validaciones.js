const validarTitulo = (titulo) => titulo !== null && titulo.value.trim().length >= 3
const validarImg = (img) => img !== null && typeof img !== 'undefined' &&  typeof img.files[0] !== 'undefined'
const validarStatus = (status) => status !== null && (status.publico.checked || status.privado.checked)
const validarCanvas = (canvas) => {
  console.log(canvas.toDataURL("image/png"));
  return canvas.toDataURL("image/png") !== null
}


export const validarFormPost = (titulo, img, status) =>  validarStatus(status) && validarImg(img)  && validarTitulo(titulo)
export const validarFormAjax = (titulo, canvas, status) => validarStatus(status) && validarTitulo(titulo) && validarCanvas(canvas)
export const validarComentario = (titulo, contenido) => validarTitulo(titulo) && validarTitulo(contenido)
