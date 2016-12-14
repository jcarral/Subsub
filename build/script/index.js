import {
    errorModal
} from './lib/modals.js'
import {
    ajax
} from './lib/utils.js'

const body = document.body
const html = document.documentElement
const container = document.getElementById('listContainer')
const favBtns = document.getElementsByClassName('fav-btn')
const btnSearch = document.getElementById('btnSearch')
const inputSearch = document.getElementById('inputSearch')


const setContainerHeight = () => {
  let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )
  container.style.height = height - 100 + "px";
}

const favOrUnfav = (e) => {
  e.preventDefault()
  let config = {
    url : `/post/${e.target.getAttribute('data-id')}/fav`,
    method : 'POST'
  }

  ajax(config)
    .then(data => {
      data = JSON.parse(data)
      if(data.message === 'OK#0') e.target.classList = 'fa fa-heart fav-btn' //Fav añadido
      else if(data.message === 'OK#1') e.target.classList = 'fa fa-heart-o fav-btn' //Fav quitado
      else errorModal(`${data.message}: No se ha podido añadir/quitar el favorito.`)
    })
}

const toggleSearch = (e) => {
  let inputField = e.target.parentElement.children[0]
  inputField.classList = (inputField.classList.contains('expand'))?'input-search':'input-search expand'
}

const searchHandler = (e) => {
  if(e.keyCode === 13){
    let content = e.target.value
    if(content.trim().length < 3) return errorModal('Las búsquedas deben tener al menos 3 carácteres')
    window.location = `/post/list?q=${content}`
  }
}

export const setIndexPage = () => {
  //if(container !== null) setContainerHeight()
  for (let i = 0; i < favBtns.length; i++) {
    favBtns[i].addEventListener('click', favOrUnfav)
  }
  if(btnSearch !== null) btnSearch.addEventListener('click', toggleSearch)
  if(inputSearch !== null) inputSearch.addEventListener('keypress', searchHandler)
}
