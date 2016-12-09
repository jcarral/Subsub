import {
    errorModal
} from './modals.js'

const auxAjax = (config) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest()
        http.open(config.method, config.url, true)
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                resolve(http.responseText)
            } else if (http.status == 400) {
                reject(http.responseText)
            }
        }
        http.send(config.body)
    })
}

const auxfollow = (id) => {
  let config = {
    url: `/follow/${id}`,
    method: 'POST',
  }
  return auxAjax(config)
}

export const ajax = auxAjax

export const follow = auxfollow

export const followUser = (e, btn, callback) => {

  auxfollow(e.target.getAttribute('data-id'))
  .then((data)=>{
    data = JSON.parse(data)
    if(data.message === 'OK#0'){
      console.log('A');
      btn.classList ='btn btn-not-follow'
      btn.innerHTML = '<i class="fa fa-user-plus"></i>Unfollow'
    }else if(data.message === 'OK#1'){
      console.log('B');
      btn.classList = 'btn btn-follow'
      btn.innerHTML = '<i class="fa fa-user-plus"></i>Seguir'
      console.log(e.target);
    }else{
      return errorModal('No se ha podido ejecutar la operación, deja de acosar, pesado')
    }
    callback()
  })
}
