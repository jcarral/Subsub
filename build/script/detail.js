import {
    ajax,
    follow,
    followUser
} from './lib/utils.js'
import {
    warningModal,
    errorModal
} from './lib/modals.js'
import {validarComentario} from './lib/validaciones.js'

const tagInput = document.getElementById('tagInput')
const idHiddenInput = document.getElementById('hiddenId')
const user = document.getElementById('hiddenUser')

const tagList = document.getElementById('tagList')
const removableTags = document.getElementsByClassName('tag-remove')
const stars = document.getElementsByClassName('rating-star')
const radioStars = document.getElementsByClassName('radio-star')
const commentTitle = document.getElementById('commentTitle')
const commentContent = document.getElementById('commentContent')
const commentSubmit = document.getElementById('commentSubmit')
const commentList = document.getElementById('commentList')
const btnFollow = document.getElementById('btnFollow')

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

String.prototype.replaceAll = function(search, replacement) {
    let target = this
    return target.split(search).join(replacement)
}
const removeTagFromDb = function(element) {
    let config = {
        method: 'POST',
        url: `/tag/delete/${element.getAttribute('data-tag')}`
    }

    ajax(config)
        .then((data) => {
            console.log(data);
        })

}

const removeTag = function() {
    this.remove()
    removeTagFromDb(this)
}

const removeParent = function() {
    this.parentElement.remove()
    removeTagFromDb(this.parentElement)
}

const addTagToList = (tag, id) => {
    let li = document.createElement('li')
    li.classList = `tag`
    li.setAttribute('data-tag', id)
    li.innerHTML = `${tag} <span class="tag-remove">&times;</span>`
    tagList.appendChild(li)
    li.addEventListener('click', removeTag)
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
                    addTagToList(currentTag, data.id)
                } else if (data.message === 'ERROR#0') {
                    warningModal('El tag que intentas meter ya existe')
                } else {
                    errorModal('Los datos de la etiqueta no son correctos')
                }
            })
    }
}

const updateRating = (data) => {
    data = JSON.parse(data)
    let rating = Math.round(parseInt(data.count))
    for (let i = 0; i < rating; i++) {
        setTimeout(() => {
            stars[i].children[0].classList = 'fa fa-star'
        }, 50+(i*50))
    }

}

const ratingCount = () => {
    let config = {
        method: 'POST',
        url: `/rating/count/${idHiddenInput.value}`
    }
    for (let i = 0; i < 5; i++) stars[i].children[0].classList = 'fa fa-star-o'
    ajax(config)
        .then((data) => updateRating(data))
}

const ratePost = (e) => {
    let rateValue = e.target.id.charAt(e.target.id.length - 1)
    rateValue = parseInt(rateValue)
    if (user === null || typeof user === 'undefined') return warningModal('Debes estar logeado para valorar una foto')
    let config = {
        method: 'POST',
        url: '/add/rating',
        body: `postId=${idHiddenInput.value}&val=${rateValue}`
    }
    ajax(config)
        .then((data) => {
            data = JSON.parse(data)
            if (data.message === 'OK#0') ratingCount()
            else errorModal('Un error muy raro, es tu culpa')
        })
}

const addCommentToList = (title, content, date, author) => {
  let comment = document.createElement('li')
  date = date.date.split(' ')[0].replaceAll('-', '/')
  let body = `
  <img src="/bundles/images/default_user.png" height="64px" width="64px" />
  <div class="column comment-info">
    <div class="comment-info-header row">
      <a href="/user/${author.id}">${author.name}</a>
      <h5 class="comment-title">${title.value}</h5>
    </div>
    <p>${content.value}</p>
    <p class="comment-date">${date}</p>
  </div>
  `
  comment.classList = 'comment row'
  comment.innerHTML = body
  commentList.appendChild(comment)
}

const commentPost = (e) => {
  e.preventDefault()
  let title = commentTitle
  let content = commentContent

  if(!validarComentario(title, content)) return errorModal('El comentario debe de tener un titulo y un contenido')
  let config = {
    url: '/add/comment',
    method: 'POST',
    body: `postId=${idHiddenInput.value}&title=${title.value}&content=${content.value}`
  }
  ajax(config)
    .then((data)=>{
      data = JSON.parse(data)
      console.log(data);
      if(data.message === 'OK#0') addCommentToList(title, content, data.date, data.author)
      else errorModal('No se ha podido añadir el comentario')
    })
}



export const setDetail = () => {
    if(idHiddenInput === null) return false

    if (tagInput !== null) tagInput.addEventListener('keypress', addTagHandler)
    if(commentSubmit !== null) commentSubmit.addEventListener('click', commentPost)
    if(btnFollow !== null) btnFollow.addEventListener('click', followUser)

    for (let i = removableTags.length - 1; i >= 0; i--) {
        removableTags[i].addEventListener('click', removeParent)
    }
    for (let i = 0; i < radioStars.length; i++) {
        radioStars[i].addEventListener('click', ratePost)
    }

    ratingCount()
}
