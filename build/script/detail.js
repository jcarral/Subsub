import {
    ajax
} from './lib/utils.js'
import {
    warningModal,
    errorModal
} from './lib/modals.js'
const tagInput = document.getElementById('tagInput')
const idHiddenInput = document.getElementById('hiddenId')
const user = document.getElementById('hiddenUser')

const tagList = document.getElementById('tagList')
const removableTags = document.getElementsByClassName('tag-remove')
const stars = document.getElementsByClassName('rating-star')
const radioStars = document.getElementsByClassName('radio-star')

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
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
    'debugger'
    removeTagFromDb(this)
}

const removeParent = function() {
    this.parentElement.remove()
    'debugger'
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
export const setDetail = () => {
    if (tagInput === null) return false
    tagInput.addEventListener('keypress', addTagHandler)
    for (let i = removableTags.length - 1; i >= 0; i--) {
        removableTags[i].addEventListener('click', removeParent)
    }
    for (let i = 0; i < radioStars.length; i++) {
        radioStars[i].addEventListener('click', ratePost)
    }
    ratingCount()
}
