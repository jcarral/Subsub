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
const removableTags = document.getElementsByClassName('tag-remove')

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}


const removeTagFromDb = function(element){
  let config = {
    method: 'POST',
    url: `/tag/delete/${element.getAttribute('data-tag')}`
  }

  ajax(config)
    .then((data)=>{
      console.log(data);
    })

}

const removeTag = function() {
    this.remove()
    'debugger'
    removeTagFromDb(this)
}

const removeParent = function(){
  this.parentElement.remove()
  'debugger'
  removeTagFromDb(this.parentElement)
}

const addTagToList = (tag) => {
    let div = document.createElement('div')
    div.classList = 'tag'
    div.innerHTML = `${tag} <span class="tag-remove">&times;</span>`
    tagList.appendChild(div)
    div.addEventListener('click', removeTag)
}

const addTagHandler = (e) => {

    if (e.keyCode === 32 || e.keyCode === 13) {
        let currentTag = tagInput.value
        let config = {
            url: '/add/tag',
            method: 'POST',
            body: `id=${idHiddenInput.value}&tag=${currentTag}`
        }
        tagInput.value = ''
        ajax(config)
            .then((data) => {
                console.log(data);
                data = JSON.parse(data)
                if (data.message === 'OK#0') {
                    addTagToList(currentTag)
                } else if (data.message === 'ERROR#0') {
                    warningModal('El tag que intentas meter ya existe')
                } else {
                    errorModal('Los datos de la etiqueta no son correctos')
                }
            })
    }
}
export const setDetail = () => {
    if (tagInput === null) return false
    tagInput.addEventListener('keypress', addTagHandler)
    for (let i = removableTags.length - 1; i >= 0; i--) {
        removableTags[i].addEventListener('click', removeParent)
    }
}
