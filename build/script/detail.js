import {
    ajax
} from './lib/utils.js'
import {
    warningModal,
    errorModal
} from './lib/modals.js'
const tagInput = document.getElementById('tagInput')
const idHiddenInput = document.getElementById('hiddenId')
const tagList = document.getElementById('tagList')

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

const removeTag = function() {
  this.remove()
  //TODO: Eliminar de la DB la etiqueta
}

const addTagToList = (tag) => {
  let div = document.createElement('div')
  div.classList = 'tag'
  div.innerHTML = `${tag} <span class="tag-remove">&times;</span>`
  tagList.appendChild(div)
  div.addEventListener('click', removeTag)
}

const addTagHandler = (e) => {

  if(e.keyCode === 32){
    let currentTag = tagInput.value
    let config = {
      url: '/add/tag',
      method: 'POST',
      body: `id=${idHiddenInput.value}&tag=${currentTag}`
    }
    tagInput.value = ''
    ajax(config)
      .then((data)=>{
        console.log(data);
        data = JSON.parse(data)
        if(data.message === 'OK#0'){
          addTagToList(currentTag)
        }else if(data.message === 'ERROR#0'){
          warningModal('El tag que intentas meter ya existe')
        }else{
          errorModal('Los datos de la etiqueta no son correctos')
        }
      })
  }
}
export const setDetail = () => {
  if(tagInput === null) return false
  tagInput.addEventListener('keypress', addTagHandler)
}
