(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setDetail = undefined;

var _utils = require('./lib/utils.js');

var _modals = require('./lib/modals.js');

var tagInput = document.getElementById('tagInput');
var idHiddenInput = document.getElementById('hiddenId');
var user = document.getElementById('hiddenUser');

var tagList = document.getElementById('tagList');
var removableTags = document.getElementsByClassName('tag-remove');
var stars = document.getElementsByClassName('rating-star');
var radioStars = document.getElementsByClassName('radio-star');

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

var removeTagFromDb = function removeTagFromDb(element) {
    var config = {
        method: 'POST',
        url: '/tag/delete/' + element.getAttribute('data-tag')
    };

    (0, _utils.ajax)(config).then(function (data) {
        console.log(data);
    });
};

var removeTag = function removeTag() {
    this.remove();
    'debugger';
    removeTagFromDb(this);
};

var removeParent = function removeParent() {
    this.parentElement.remove();
    'debugger';
    removeTagFromDb(this.parentElement);
};

var addTagToList = function addTagToList(tag, id) {
    var li = document.createElement('li');
    li.classList = 'tag';
    li.setAttribute('data-tag', id);
    li.innerHTML = tag + ' <span class="tag-remove">&times;</span>';
    tagList.appendChild(li);
    li.addEventListener('click', removeTag);
};

var addTagHandler = function addTagHandler(e) {

    if (e.keyCode === 32 || e.keyCode === 13) {
        (function () {
            var currentTag = tagInput.value;
            var config = {
                url: '/add/tag',
                method: 'POST',
                body: 'id=' + idHiddenInput.value + '&tag=' + currentTag
            };
            tagInput.value = '';
            (0, _utils.ajax)(config).then(function (data) {
                console.log(data);
                data = JSON.parse(data);
                if (data.message === 'OK#0') {
                    addTagToList(currentTag, data.id);
                } else if (data.message === 'ERROR#0') {
                    (0, _modals.warningModal)('El tag que intentas meter ya existe');
                } else {
                    (0, _modals.errorModal)('Los datos de la etiqueta no son correctos');
                }
            });
        })();
    }
};

var updateRating = function updateRating(data) {
    data = JSON.parse(data);
    var rating = Math.round(parseInt(data.count));

    var _loop = function _loop(i) {
        setTimeout(function () {
            stars[i].children[0].classList = 'fa fa-star';
        }, 50 + i * 50);
    };

    for (var i = 0; i < rating; i++) {
        _loop(i);
    }
};

var ratingCount = function ratingCount() {
    var config = {
        method: 'POST',
        url: '/rating/count/' + idHiddenInput.value
    };
    for (var i = 0; i < 5; i++) {
        stars[i].children[0].classList = 'fa fa-star-o';
    }(0, _utils.ajax)(config).then(function (data) {
        return updateRating(data);
    });
};

var ratePost = function ratePost(e) {
    var rateValue = e.target.id.charAt(e.target.id.length - 1);
    rateValue = parseInt(rateValue);
    if (user === null || typeof user === 'undefined') return (0, _modals.warningModal)('Debes estar logeado para valorar una foto');
    var config = {
        method: 'POST',
        url: '/add/rating',
        body: 'postId=' + idHiddenInput.value + '&val=' + rateValue
    };
    (0, _utils.ajax)(config).then(function (data) {
        data = JSON.parse(data);
        if (data.message === 'OK#0') ratingCount();else (0, _modals.errorModal)('Un error muy raro, es tu culpa');
    });
};
var setDetail = exports.setDetail = function setDetail() {
    if (tagInput === null) return false;
    tagInput.addEventListener('keypress', addTagHandler);
    for (var i = removableTags.length - 1; i >= 0; i--) {
        removableTags[i].addEventListener('click', removeParent);
    }
    for (var _i = 0; _i < radioStars.length; _i++) {
        radioStars[_i].addEventListener('click', ratePost);
    }
    ratingCount();
};

},{"./lib/modals.js":2,"./lib/utils.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

var addIcon = function addIcon(icon) {
    return '<i class="fa fa-' + icon + '"></i>';
};

var headerTxt = function headerTxt(type) {
    switch (type) {
        case 'error':
            return addIcon('ban') + ' Error';
        case 'warning':
            return addIcon('exclamation') + ' Warning';
        case 'success':
            return addIcon('check') + ' Success';
        default:
            return addIcon('ban') + ' Error';
    }
};
var createModal = function createModal(texto, type) {
    var modal = document.createElement('div');
    modal.classList = 'modal-background';
    var headertxt = 'Error';
    var content = '\n  <div class="modal-frame">\n    <header class="modal-' + type + ' modal-header">\n      <h4> ' + headerTxt(type) + ' </h4>\n      <span id="closeModal">&times;</span>\n    </header>\n    <div class="modal-mssg"> ' + texto + ' </div>\n    <button id="btnAcceptModal" class="btn modal-btn modal-' + type + '">Aceptar</button>\n  </div>\n  ';
    modal.innerHTML = content;
    document.body.appendChild(modal);
    document.getElementById('btnAcceptModal').addEventListener('click', function () {
        return modal.remove();
    });
    document.getElementById('closeModal').addEventListener('click', function () {
        return modal.remove();
    });
};

var errorModal = exports.errorModal = function errorModal(message) {
    return createModal(message, 'error');
};
var successModal = exports.successModal = function successModal(message) {
    return createModal(message, 'success');
};
var warningModal = exports.warningModal = function warningModal(message) {
    return createModal(message, 'warning');
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ajax = exports.ajax = function ajax(config) {
    return new Promise(function (resolve, reject) {
        var http = new XMLHttpRequest();
        http.open(config.method, config.url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                resolve(http.responseText);
            } else if (http.status == 400) {
                reject(http.responseText);
            }
        };
        http.send(config.body);
    });
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validarTitulo = function validarTitulo(titulo) {
  return titulo !== null && titulo.value.trim().length >= 3;
};
var validarImg = function validarImg(img) {
  return img !== null && typeof img !== 'undefined' && typeof img.files[0] !== 'undefined';
};
var validarStatus = function validarStatus(status) {
  return status !== null && (status.publico.checked || status.privado.checked);
};
var validarCanvas = function validarCanvas(canvas) {
  console.log(canvas.toDataURL("image/png"));
  return canvas.toDataURL("image/png") !== null;
};

var validarFormPost = exports.validarFormPost = function validarFormPost(titulo, img, status) {
  return validarStatus(status) && validarImg(img) && validarTitulo(titulo);
};
var validarFormAjax = exports.validarFormAjax = function validarFormAjax(titulo, canvas, status) {
  return validarStatus(status) && validarTitulo(titulo) && validarCanvas(canvas);
};

},{}],5:[function(require,module,exports){
'use strict';

var _upload = require('./upload.js');

var _detail = require('./detail.js');

(0, _detail.setDetail)();
(0, _upload.setUpload)();

},{"./detail.js":1,"./upload.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setUpload = undefined;

var _modals = require('./lib/modals.js');

var _validaciones = require('./lib/validaciones.js');

var _utils = require('./lib/utils.js');

var modalContent = '\n  <div class="camera-frame">\n    <header class="camera-frame--header">\n      <h4> Quita esa cara de gilipollas </h4>\n      <span id="closeModal">&times;</span>\n    </header>\n    <video width="600" height="440" id="video" autoplay></video>\n    <button id="snap" class="btn btnSnap">Tomar foto</button>\n  </div>';

//UI Elements
var btnPhoto = document.getElementById('btnPhoto');
var imagePreview = document.getElementById('previewImage');
var uploadFile = document.getElementById("post_image");
var uploadWrapper = document.getElementById('uploadWrapper');
var btnSubmit = document.getElementById('post_Subir');
var canvas = document.getElementById('previewCanvas');
var titleInput = document.getElementById('post_title');
var descriptionInput = document.getElementById('post_description');
var statusInput = {
    publico: document.getElementById('post_status_0'),
    privado: document.getElementById('post_status_1')
};

var context = void 0;
var localstream = void 0;
var tmpFile = void 0;
var btnSnap = void 0;
var video = void 0;
var closeModal = void 0;
var useAjax = false;

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

var clearWrapper = function clearWrapper() {
    imagePreview.classList = 'hidden';
    imagePreview.style = '';
    uploadWrapper.classList = 'upload-file-wrapper--dashed';
    canvas.classList = 'hidden';
    canvas.style = '';
};

var previewFromGallery = function previewFromGallery(imageSource) {
    imagePreview.className = "";
    imagePreview.style = 'display:block;';
    imagePreview.src = imageSource;
    uploadWrapper.classList = 'hidden';
    canvas.classList = 'hidden';
    canvas.style = '';
    useAjax = false;
};

var previewImage = function previewImage() {
    var oFReader = new FileReader();
    if (typeof uploadFile.files[0] === 'undefined') {
        clearWrapper();
    } else {
        oFReader.readAsDataURL(uploadFile.files[0]);
        oFReader.onload = function (oFREvent) {
            return previewFromGallery(oFREvent.target.result);
        };
    }
    useAjax = false;
};

var previewFromCanvas = function previewFromCanvas() {
    context.drawImage(video, 0, 0, 300, 300);
    canvas.classList = "";
    canvas.style = 'display:block;margin: 0 auto;';
    imagePreview.classList = 'hidden';
    imagePreview.style = '';
    uploadWrapper.classList = 'hidden';
    useAjax = true;
};

var closeModalFrame = function closeModalFrame(modal, empty) {
    modal.remove();
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
    if (empty) clearWrapper();
};

var camera = function camera(modal) {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            localstream = stream;
            video.play();
        });
        btnSnap.addEventListener("click", function () {
            previewFromCanvas();
            closeModalFrame(modal, false);
        });
        closeModal.addEventListener('click', function () {
            return closeModalFrame(modal, true);
        });
    } else {
        // Camera not enabled
    }
};

var takePhoto = function takePhoto() {
    var modal = document.createElement('div');
    modal.classList = 'modal-background';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    btnSnap = document.getElementById('snap');
    video = document.getElementById('video');
    closeModal = document.getElementById('closeModal');
    camera(modal);
};

var configAjaxForm = function configAjaxForm() {
    var config = {
        url: '/add/ajax',
        method: 'POST',
        body: 'title=' + titleInput.value + '&status=' + (statusInput.publico.checked ? 'public' : 'private') + '&description=' + (descriptionInput.value.length > 0 ? descriptionInput.value : '') + '&image=' + canvas.toDataURL("image/png")
    };
    return config;
};

var ajaxResponseHandler = function ajaxResponseHandler(data) {
    data = JSON.parse(data);
    if (data.id !== null) return window.location = '/post/' + data.id;
    (0, _modals.errorModal)(data.error);
};

var submitHandler = function submitHandler(e) {
    if (useAjax) {
        e.preventDefault();
        if ((0, _validaciones.validarFormAjax)(titleInput, canvas, statusInput)) {
            (0, _utils.ajax)(configAjaxForm()).then(function (data) {
                ajaxResponseHandler(data);
            });
        } else {
            (0, _modals.errorModal)('¿Estás seguro de que has rellenado todos los campos?');
        }
    } else if (!(0, _validaciones.validarFormPost)(titleInput, uploadFile, statusInput)) {
        e.preventDefault();
        (0, _modals.errorModal)('¿Estás seguro de que has rellenado todos los campos?');
    }
};

var setUpload = exports.setUpload = function setUpload() {
    if (btnPhoto === null || uploadFile === null) return false;
    context = canvas.getContext('2d');
    btnPhoto.addEventListener('click', takePhoto);
    uploadFile.addEventListener('change', previewImage);
    btnSubmit.addEventListener('click', submitHandler);
};

},{"./lib/modals.js":2,"./lib/utils.js":3,"./lib/validaciones.js":4}]},{},[5]);
