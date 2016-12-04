const modalContent = `
  <div class="camera-frame">
    <header class="camera-frame--header">
      <h4> Quita esa cara de gilipollas </h4>
      <span id="closeModal">&times;</span>
    </header>
    <video width="600" height="440" id="video" autoplay></video>
    <button id="snap" class="btn btnSnap">Tomar foto</button>
  </div>`

const btnPhoto = document.getElementById('btnPhoto')
const imagePreview = document.getElementById('previewImage')
const uploadFile = document.getElementById("post_image")
const uploadWrapper = document.getElementById('uploadWrapper')
const btnSubmit = document.getElementById('post_Subir')
let tmpFile

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

const previewImage = () => {
    let oFReader = new FileReader();
    if(typeof uploadFile.files[0] === 'undefined'){
      imagePreview.classList = 'hidden'
      imagePreview.style = ''
      uploadWrapper.classList = 'upload-file-wrapper--dashed'
    }else{
      oFReader.readAsDataURL(uploadFile.files[0])
      imagePreview.className = ""
      imagePreview.style = 'display:block;'
      oFReader.onload = function(oFREvent) {
          imagePreview.src = oFREvent.target.result;
          uploadWrapper.classList = 'hidden'
      }
    }
}

const closeModalFrame = (modal, video, localstream) =>{
  modal.remove()
  video.pause();
  video.src = "";
  localstream.getTracks()[0].stop();
}

const camera = (modal) => {
    let video = document.getElementById('video')
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    let btnSnap = document.getElementById("snap")
    let closeModal = document.getElementById('closeModal')
    let localstream

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream)
            localstream = stream
            video.play()
        })
        btnSnap.addEventListener("click", () => context.drawImage(video, 0, 0, 640, 480))
        closeModal.addEventListener('click', () => closeModalFrame(modal, video, localstream))
    } else {
        // Camera not enabled
    }

}

const takePhoto = () => {
    let modal = document.createElement('div')
    modal.classList = 'modal-background'
    modal.innerHTML = modalContent
    document.body.appendChild(modal)
    camera(modal)
}

export const setUpload = () => {
    if (btnPhoto === null || uploadFile === null) return false
    btnPhoto.addEventListener('click', takePhoto)
    uploadFile.addEventListener('change', previewImage)
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault()
      console.log(uploadFile.files[0])
    })
}
