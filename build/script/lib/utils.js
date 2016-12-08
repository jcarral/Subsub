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

export const followUser = (e) => {

  auxfollow(e.target.getAttribute('data-id'))
  .then((data)=>{
    console.log(data);
    data = JSON.parse(data)
    if(data.message === 'OK#0'){
      e.target.classList ='btn btn-not-follow'
      e.target.innerHTML = '<i class="fa fa-user-plus"></i>Unfollow'
    }else if(data.message === 'OK#1'){
      e.target.classList = 'btn btn-follow'
      e.target.innerHTML = '<i class="fa fa-user-plus"></i>Seguir'
    }else{
      errorModal('No se ha podido ejecutar la operación, deja de acosar, pesado')
    }
  })
}
