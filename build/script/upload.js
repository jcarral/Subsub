import {
    errorModal,
    successModal
} from './lib/modals.js'
import {
    validarFormPost,
    validarFormAjax
} from './lib/validaciones.js'
import {
    ajax
} from './lib/utils.js'

const modalContent = `
  <div class="camera-frame">
    <header class="camera-frame--header">
      <h4> Quita esa cara de gilipollas </h4>
      <span id="closeModal">&times;</span>
    </header>
    <video width="600" height="440" id="video" autoplay></video>
    <button id="snap" class="btn btnSnap">Tomar foto</button>
  </div>`


//UI Elements
const btnPhoto = document.getElementById('btnPhoto')
const imagePreview = document.getElementById('previewImage')
const uploadFile = document.getElementById("post_image")
const uploadWrapper = document.getElementById('uploadWrapper')
const btnSubmit = document.getElementById('post_Subir')
const canvas = document.getElementById('previewCanvas')
const titleInput = document.getElementById('post_title')
const descriptionInput = document.getElementById('post_description')
const statusInput = {
    publico: document.getElementById('post_status_0'),
    privado: document.getElementById('post_status_1')
}

let localstream
let tmpFile
let btnSnap
let video
let closeModal
let useAjax = false


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

const clearWrapper = () => {
    imagePreview.classList = 'hidden'
    imagePreview.style = ''
    uploadWrapper.classList = 'upload-file-wrapper--dashed'
    canvas.classList = 'hidden'
    canvas.style = ''
}

const previewFromGallery = (imageSource) => {
    imagePreview.className = ""
    imagePreview.style = 'display:block;'
    imagePreview.src = imageSource;
    uploadWrapper.classList = 'hidden'
    canvas.classList = 'hidden'
    canvas.style = ''
    useAjax = false
}

const previewImage = () => {
    let oFReader = new FileReader();
    if (typeof uploadFile.files[0] === 'undefined') {
        clearWrapper()
    } else {
        oFReader.readAsDataURL(uploadFile.files[0])
        oFReader.onload = (oFREvent) => previewFromGallery(oFREvent.target.result)
    }
    useAjax = false
}

const previewFromCanvas = () => {
    context.drawImage(video, 0, 0, 300, 300)
    canvas.classList = ""
    canvas.style = 'display:block;margin: 0 auto;'
    imagePreview.classList = 'hidden'
    imagePreview.style = ''
    uploadWrapper.classList = 'hidden'
    useAjax = true
}

const closeModalFrame = (modal, empty) => {
    modal.remove()
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
    if (empty) clearWrapper()
}

const camera = (modal) => {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream)
            localstream = stream
            video.play()
        })
        btnSnap.addEventListener("click", () => {
            previewFromCanvas()
            closeModalFrame(modal, false)
        })
        closeModal.addEventListener('click', () => closeModalFrame(modal, true))
    } else {
        // Camera not enabled
    }

}

const takePhoto = () => {
    let modal = document.createElement('div')
    modal.classList = 'modal-background'
    modal.innerHTML = modalContent
    document.body.appendChild(modal)
    btnSnap = document.getElementById('snap')
    video = document.getElementById('video')
    closeModal = document.getElementById('closeModal')
    camera(modal)
}

const configAjaxForm = () => {
    let config = {
        url: '/add/ajax',
        method: 'POST',
        body: `title=${titleInput.value}&status=${(statusInput.publico.checked)?'public':'private'}&description=${(descriptionInput.value.length>0)?descriptionInput.value:''}&image=${canvas.toDataURL("image/png")}`
    }
    return config
}

const ajaxResponseHandler = (data) => {
  data = JSON.parse(data)
  if(data.id !== null) return window.location = `/post/${data.id}`
  errorModal(data.error)
}

const submitHandler = (e) => {
    if (useAjax) {
        e.preventDefault()
        if(validarFormAjax(titleInput, canvas, statusInput)){
          ajax(configAjaxForm())
              .then(data => {
                ajaxResponseHandler(data)
              })
        }else{
          errorModal('¿Estás seguro de que has rellenado todos los campos?')
        }
    } else if (!validarFormPost(titleInput, uploadFile, statusInput)) {
        e.preventDefault()
        errorModal('¿Estás seguro de que has rellenado todos los campos?')
    }
}

export const setUpload = () => {
    if (btnPhoto === null || uploadFile === null) return false
    const context = canvas.getContext('2d')
    btnPhoto.addEventListener('click', takePhoto)
    uploadFile.addEventListener('change', previewImage)
    btnSubmit.addEventListener('click', submitHandler)
}
