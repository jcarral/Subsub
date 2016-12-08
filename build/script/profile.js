import {
    followUser
} from './lib/utils.js'

import {
    errorModal,
    successModal
} from './lib/modals.js'

const separator = document.getElementById('footerSeparator')
const tabsLabel = document.getElementsByClassName('tab-label')
const followBtns = document.getElementsByClassName('btn-unfollow')
const btnFollow = document.getElementById('btnFollow')

const unfollow = (e) => {
  follow(e.target.getAttribute('data-id'))
  .then((data) => {
    data = JSON.parse(data)
    if(data.message === 'OK#0' || data.message === 'OK#1') location.reload()
    else errorModal('No se ha podido hacer unfollow, prueba más tarde. Sigue no funciona te jodes y dejas de acosar la próxima vez')
  })
}
export const setProfile = () => {
  if(separator === null) return false
  if(btnFollow !== null) btnFollow.addEventListener('click', followUser)

  for (let i = 0; i < tabsLabel.length; i++) {
    tabsLabel[i].addEventListener('click', () => footerSeparator.classList = (i === 0)?'':'hidden')
  }

  for (let i = 0; i < followBtns.length; i++) {
    followBtns[i].addEventListener('click', followUser)
  }


}
