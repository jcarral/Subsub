(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _upload = require('./upload.js');

(0, _upload.setUpload)();

},{"./upload.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var modalContent = '\n  <div class="camera-frame">\n    <header class="camera-frame--header">\n      <h4> Quita esa cara de gilipollas </h4>\n      <span id="closeModal">&times;</span>\n    </header>\n    <video width="600" height="440" id="video" autoplay></video>\n    <button id="snap" class="btn btnSnap">Tomar foto</button>\n  </div>';

var btnPhoto = document.getElementById('btnPhoto');
var imagePreview = document.getElementById('previewImage');
var uploadFile = document.getElementById("post_image");
var uploadWrapper = document.getElementById('uploadWrapper');
var btnSubmit = document.getElementById('post_Subir');
var tmpFile = void 0;

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

var previewImage = function previewImage() {
    var oFReader = new FileReader();
    if (typeof uploadFile.files[0] === 'undefined') {
        imagePreview.classList = 'hidden';
        imagePreview.style = '';
        uploadWrapper.classList = 'upload-file-wrapper--dashed';
    } else {
        oFReader.readAsDataURL(uploadFile.files[0]);
        imagePreview.className = "";
        imagePreview.style = 'display:block;';
        oFReader.onload = function (oFREvent) {
            imagePreview.src = oFREvent.target.result;
            uploadWrapper.classList = 'hidden';
        };
    }
};

var closeModalFrame = function closeModalFrame(modal, video, localstream) {
    modal.remove();
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
};

var camera = function camera(modal) {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var btnSnap = document.getElementById("snap");
    var closeModal = document.getElementById('closeModal');
    var localstream = void 0;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            localstream = stream;
            video.play();
        });
        btnSnap.addEventListener("click", function () {
            return context.drawImage(video, 0, 0, 640, 480);
        });
        closeModal.addEventListener('click', function () {
            return closeModalFrame(modal, video, localstream);
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
    camera(modal);
};

var setUpload = exports.setUpload = function setUpload() {
    if (btnPhoto === null || uploadFile === null) return false;
    btnPhoto.addEventListener('click', takePhoto);
    uploadFile.addEventListener('change', previewImage);
    btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(uploadFile.files[0]);
    });
};

},{}]},{},[1]);
