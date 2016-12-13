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

export const setIndexPage = () => {
  //if(container !== null) setContainerHeight()
  for (let i = 0; i < favBtns.length; i++) {
    favBtns[i].addEventListener('click', favOrUnfav)
  }
}
