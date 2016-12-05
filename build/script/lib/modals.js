Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

const addIcon = (icon) => `<i class="fa fa-${icon}"></i>`

const headerTxt = (type) => {
    switch (type) {
        case 'error':
            return `${addIcon('ban')} Error`
        case 'warning':
            return `${addIcon('exclamation')} Warning`
        case 'success':
            return `${addIcon('check')} Success`
        default:
            return `${addIcon('ban')} Error`
    }
}
const createModal = (texto, type) => {
    let modal = document.createElement('div')
    modal.classList = 'modal-background'
    let headertxt = 'Error'
    let content = `
  <div class="modal-frame">
    <header class="modal-${type} modal-header">
      <h4> ${headerTxt(type)} </h4>
      <span id="closeModal">&times;</span>
    </header>
    <div class="modal-mssg"> ${texto} </div>
    <button id="btnAcceptModal" class="btn modal-btn modal-${type}">Aceptar</button>
  </div>
  `
    modal.innerHTML = content
    document.body.appendChild(modal)
    document.getElementById('btnAcceptModal').addEventListener('click', () => modal.remove())
    document.getElementById('closeModal').addEventListener('click', () => modal.remove())
}


export const errorModal = (message) => createModal(message, 'error')
export const successModal = (message) => createModal(message, 'success')
export const warningModal = (message) => createModal(message, 'warning')
