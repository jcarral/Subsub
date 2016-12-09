import {
    followUser,
    ajax
} from './lib/utils.js'

import {
    errorModal,
    successModal
} from './lib/modals.js'

const separator = document.getElementById('footerSeparator')
const tabsLabel = document.getElementsByClassName('tab-label')
const btnFollow = document.getElementById('btnFollow')
const followerList = document.getElementById('followerList')
const followingList = document.getElementById('followingList')
const userId = document.getElementById('userId')
let followBtns

const createListElement = (id, name) => {
    let content = `
  <a href="/user/${id}"  class="user">
      <i class="fa fa-user"></i>
      ${name}
    </a>
  `
    return content
}

const loadFollowerList = (list, wrapper, addBtn) => {
    wrapper.innerHTML = ''
    if(list.length > 0){
      for (let i = 0; i < list.length; i++) {
          let data = JSON.parse(list[i])
          let li = document.createElement('li')
          let btn = `<div class="btn btn-unfollow" data-id="${data.id}">Unfollow</div>`
          li.classList = 'follow-item row center-v space-bet-h'

          li.innerHTML = `${createListElement(data.id, data.name)}${(addBtn)?btn:''}`
          wrapper.appendChild(li)
      }
    }else{
      let li = document.createElement('li')
      li.innerHTML = 'Vaya, parece que este tio es un solitario'
      wrapper.appendChild(li)
    }

}

const reloadFollowerList = () => {
    let config = {
        url: `/follow/list/${userId.getAttribute('data-id')}`,
        method: 'POST'
    }
    ajax(config)
        .then((data) => {
            data = JSON.parse(data)
            loadFollowerList(data.followers, followerList, false)
            loadFollowerList(data.following, followingList, data.owner)

            followBtnsHandler()
        })
}


const unfollow = (e) => {
    follow(e.target.getAttribute('data-id'))
        .then((data) => {
            data = JSON.parse(data)
            if (data.message === 'OK#0' || data.message === 'OK#1') location.reload()
            else errorModal('No se ha podido hacer unfollow, prueba más tarde. Sigue no funciona te jodes y dejas de acosar la próxima vez')
        })
}

const followBtnsHandler = () => {
  followBtns = document.getElementsByClassName('btn-unfollow')
  for (let i = 0; i < followBtns.length; i++) {
      followBtns[i].addEventListener('click', (e) => followUser(e, btnFollow, reloadFollowerList))
  }
}

export const setProfile = () => {
    if (separator === null) return false
    if (btnFollow !== null){
      btnFollow.addEventListener('click', (e) => followUser(e, btnFollow, reloadFollowerList))
      btnFollow.addEventListener('click', reloadFollowerList)
    }

    for (let i = 0; i < tabsLabel.length; i++) {
        tabsLabel[i].addEventListener('click', () => footerSeparator.classList = (i === 0) ? '' : 'hidden')
    }

    followBtnsHandler()
}
