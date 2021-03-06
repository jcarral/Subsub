(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setDetail = undefined;

var _utils = require('./lib/utils.js');

var _modals = require('./lib/modals.js');

var _validaciones = require('./lib/validaciones.js');

var tagInput = document.getElementById('tagInput');
var idHiddenInput = document.getElementById('hiddenId');
var user = document.getElementById('hiddenUser');

var tagList = document.getElementById('tagList');
var removableTags = void 0;
var stars = document.getElementsByClassName('rating-star');
var radioStars = document.getElementsByClassName('radio-star');
var commentTitle = document.getElementById('commentTitle');
var commentContent = document.getElementById('commentContent');
var commentSubmit = document.getElementById('commentSubmit');
var commentList = document.getElementById('commentList');
var btnFollow = document.getElementById('btnFollow');
var draggableFrame = document.getElementById('draggable');
var editVisibility = document.getElementsByClassName('edit-visibility');
var btnDelete = document.getElementById('deletePost');
var favBtn = document.getElementById('favBtnDetail');

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
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
    removeTagFromDb(this);
};

var removeParent = function removeParent() {
    this.parentElement.remove();
    removeTagFromDb(this.parentElement);
};

var addTagToList = function addTagToList(tag, id) {
    var li = document.createElement('li');
    li.classList = 'tag';
    li.setAttribute('data-tag', id);
    li.innerHTML = '<a href="/post/list?tag=' + tag + '">' + tag + '</a> <span class="tag-remove">&times;</span>';
    tagList.appendChild(li);
    removableTagsHandler();
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

var addCommentToList = function addCommentToList(title, content, date, author) {
    var comment = document.createElement('li');
    date = date.date.split(' ')[0].replaceAll('-', '/');
    var body = '\n  <img src="/bundles/images/default_user.png" height="64px" width="64px" />\n  <div class="column comment-info">\n    <div class="comment-info-header row">\n      <a href="/user/' + author.id + '">' + author.name + '</a>\n      <h5 class="comment-title">' + title.value + '</h5>\n    </div>\n    <p>' + content.value + '</p>\n    <p class="comment-date">' + date + '</p>\n  </div>\n  ';
    comment.classList = 'comment row';
    comment.innerHTML = body;
    commentList.appendChild(comment);
};

var commentPost = function commentPost(e) {
    e.preventDefault();
    var title = commentTitle;
    var content = commentContent;

    if (!(0, _validaciones.validarComentario)(title, content)) return (0, _modals.errorModal)('El comentario debe de tener un titulo y un contenido');
    var config = {
        url: '/add/comment',
        method: 'POST',
        body: 'postId=' + idHiddenInput.value + '&title=' + title.value + '&content=' + content.value
    };
    (0, _utils.ajax)(config).then(function (data) {
        data = JSON.parse(data);
        console.log(data);
        if (data.message === 'OK#0') addCommentToList(title, content, data.date, data.author);else (0, _modals.errorModal)('No se ha podido añadir el comentario');
    });
};

var editPostVisibility = function editPostVisibility(e) {
    var radioTarget = document.getElementById(e.target.getAttribute('for'));
    var config = {
        url: '/post/' + idHiddenInput.value + '/visibility',
        method: 'POST',
        body: 'status=' + radioTarget.value
    };

    (0, _utils.ajax)(config).then(function (data) {
        return console.log(data);
    });
};

var deletePost = function deletePost() {
    var result = window.confirm('¿Estás seguro de que quieres borrar el post?');
    if (result) {
        (0, _utils.ajax)({ url: '/post/' + idHiddenInput.value + '/delete', method: 'POST' }).then(function (data) {
            data = JSON.parse(data);
            if (data.message === 'OK#0') window.location('/');else (0, _modals.errorModal)('No se ha podido borrar el post, es tu problema');
        });
    }
};

var removableTagsHandler = function removableTagsHandler() {
    removableTags = document.getElementsByClassName('tag-remove');
    for (var i = removableTags.length - 1; i >= 0; i--) {
        removableTags[i].addEventListener('click', removeParent);
    }
};
var setDetail = exports.setDetail = function setDetail() {
    if (idHiddenInput === null) return false;

    if (tagInput !== null) tagInput.addEventListener('keypress', addTagHandler);
    if (commentSubmit !== null) commentSubmit.addEventListener('click', commentPost);
    if (btnFollow !== null) btnFollow.addEventListener('click', function (e) {
        return (0, _utils.followUser)(e, e.target, null);
    });
    if (draggableFrame !== null) (0, _utils.draggable)(draggableFrame);
    if (btnDelete !== null) btnDelete.addEventListener('click', deletePost);
    if (favBtn !== null) favBtn.addEventListener('click', function (e) {
        return (0, _utils.favOrUnfav)(e, idHiddenInput.value, false);
    });
    for (var i = 0; i < radioStars.length; i++) {
        radioStars[i].addEventListener('click', ratePost);
    }

    for (var _i = 0; _i < editVisibility.length; _i++) {
        editVisibility[_i].addEventListener('click', editPostVisibility);
    }
    removableTagsHandler();
    ratingCount();
};

},{"./lib/modals.js":3,"./lib/utils.js":4,"./lib/validaciones.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIndexPage = undefined;

var _modals = require('./lib/modals.js');

var _utils = require('./lib/utils.js');

var body = document.body;
var html = document.documentElement;
var container = document.getElementById('listContainer');
var favBtns = document.getElementsByClassName('fav-btn');
var btnSearch = document.getElementById('btnSearch');
var inputSearch = document.getElementById('inputSearch');

var setContainerHeight = function setContainerHeight() {
  var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  container.style.height = height - 100 + "px";
};

var toggleSearch = function toggleSearch(e) {
  var inputField = e.target.parentElement.children[0];
  inputField.classList = inputField.classList.contains('expand') ? 'input-search' : 'input-search expand';
};

var searchHandler = function searchHandler(e) {
  if (e.keyCode === 13) {
    var content = e.target.value;
    if (content.trim().length < 3) return (0, _modals.errorModal)('Las búsquedas deben tener al menos 3 carácteres');
    window.location = '/post/list?q=' + content;
  }
};

var setIndexPage = exports.setIndexPage = function setIndexPage() {
  //if(container !== null) setContainerHeight()
  for (var i = 0; i < favBtns.length; i++) {
    favBtns[i].addEventListener('click', function (e) {
      return (0, _utils.favOrUnfav)(e, e.target.getAttribute('data-id'));
    });
  }
  if (btnSearch !== null) btnSearch.addEventListener('click', toggleSearch);
  if (inputSearch !== null) inputSearch.addEventListener('keypress', searchHandler);
};

},{"./lib/modals.js":3,"./lib/utils.js":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.favOrUnfav = exports.followUser = exports.follow = exports.ajax = exports.draggable = undefined;

var _modals = require("./modals.js");

var auxAjax = function auxAjax(config) {
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

var auxfollow = function auxfollow(id) {
  var config = {
    url: "/follow/" + id,
    method: 'POST'
  };
  return auxAjax(config);
};

var drag_start = function drag_start(event) {
  var style = window.getComputedStyle(event.target, null);
  event.dataTransfer.setData("text/plain", parseInt(style.getPropertyValue("left"), 10) - event.clientX + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
};

var drag_over = function drag_over(event) {
  event.preventDefault();
  return false;
};

var drop = function drop(event) {
  var offset = event.dataTransfer.getData("text/plain").split(',');
  var dm = document.getElementById('draggable');
  dm.style.left = event.clientX + parseInt(offset[0], 10) + 'px';
  dm.style.top = event.clientY + parseInt(offset[1], 10) + 'px';
  event.preventDefault();
  return false;
};

var draggable = exports.draggable = function draggable(dragItem) {
  dragItem.addEventListener('dragstart', drag_start, false);
  document.body.addEventListener('dragover', drag_over, false);
  document.body.addEventListener('drop', drop, false);
};

var ajax = exports.ajax = auxAjax;

var follow = exports.follow = auxfollow;

var followUser = exports.followUser = function followUser(e, btn, callback) {

  auxfollow(e.target.getAttribute('data-id')).then(function (data) {
    data = JSON.parse(data);
    if (data.message === 'OK#0') {
      console.log('A');
      btn.classList = 'btn btn-not-follow';
      btn.innerHTML = '<i class="fa fa-user-plus"></i>Unfollow';
    } else if (data.message === 'OK#1') {
      console.log('B');
      btn.classList = 'btn btn-follow';
      btn.innerHTML = '<i class="fa fa-user-plus"></i>Seguir';
      console.log(e.target);
    } else {
      return (0, _modals.errorModal)('No se ha podido ejecutar la operación, deja de acosar, pesado');
    }
    callback();
  });
};

var favOrUnfav = exports.favOrUnfav = function favOrUnfav(e, postId) {
  var defaultBtn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  e.preventDefault();
  var config = {
    url: "/post/" + postId + "/fav",
    method: 'POST'
  };

  auxAjax(config).then(function (data) {
    data = JSON.parse(data);
    if (data.message === 'OK#0') e.target.classList = "fa fa-heart " + (defaultBtn ? 'fav-btn' : 'fav-detail'); //Fav añadido
    else if (data.message === 'OK#1') e.target.classList = "fa fa-heart-o " + (defaultBtn ? 'fav-btn' : 'fav-detail'); //Fav quitado
      else (0, _modals.errorModal)(data.message + ": No se ha podido a\xF1adir/quitar el favorito.");
  });
};

},{"./modals.js":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var PASS_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

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

var validarRegex = function validarRegex(regex, mail) {
  console.log(regex.test(mail));
  return regex.test(mail);
};

var validarFormPost = exports.validarFormPost = function validarFormPost(titulo, img, status) {
  return validarStatus(status) && validarImg(img) && validarTitulo(titulo);
};
var validarFormAjax = exports.validarFormAjax = function validarFormAjax(titulo, canvas, status) {
  return validarStatus(status) && validarTitulo(titulo) && validarCanvas(canvas);
};
var validarComentario = exports.validarComentario = function validarComentario(titulo, contenido) {
  return validarTitulo(titulo) && validarTitulo(contenido);
};
var validarUsuario = exports.validarUsuario = function validarUsuario(nombre, correo, password) {
  return validarTitulo(nombre) && validarRegex(MAIL_REGEX, correo) && validarRegex(PASS_REGEX, password);
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLogin = undefined;

var _validaciones = require('./lib/validaciones.js');

var _modals = require('./lib/modals.js');

var firstPass = document.getElementById('user_pass');
var repeatPass = document.getElementById('repeatPass');
var submitUser = document.getElementById('user_Confirmar');
var formUser = document.querySelector('.registro>form');
var nameUser = document.getElementById('user_name');
var mailUser = document.getElementById('user_mail');

var equalsPass = function equalsPass(e) {
  if (firstPass.value !== repeatPass.value) {
    repeatPass.style = 'border:1px solid red';
    return false;
  } else {
    repeatPass.style = 'border:1px solid #DBDBDB';
    return true;
  }
};

var submitNewUser = function submitNewUser(e) {
  if (!(0, _validaciones.validarUsuario)(nameUser, mailUser.value, firstPass.value) || !equalsPass()) {
    e.preventDefault();
    (0, _modals.errorModal)('Los campos del registro no son validos');
  }
};

var setLogin = exports.setLogin = function setLogin() {
  if (repeatPass !== null) repeatPass.addEventListener('keyup', equalsPass);
  if (formUser !== null) formUser.addEventListener('submit', submitNewUser);
};

},{"./lib/modals.js":3,"./lib/validaciones.js":5}],7:[function(require,module,exports){
'use strict';

var _upload = require('./upload.js');

var _detail = require('./detail.js');

var _profile = require('./profile.js');

var _index = require('./index.js');

var _login = require('./login.js');

(0, _index.setIndexPage)();
(0, _detail.setDetail)();
(0, _upload.setUpload)();
(0, _profile.setProfile)();
(0, _login.setLogin)();

},{"./detail.js":1,"./index.js":2,"./login.js":6,"./profile.js":8,"./upload.js":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setProfile = undefined;

var _utils = require('./lib/utils.js');

var _modals = require('./lib/modals.js');

var separator = document.getElementById('footerSeparator');
var tabsLabel = document.getElementsByClassName('tab-label');
var btnFollow = document.getElementById('btnFollow');
var followerList = document.getElementById('followerList');
var followingList = document.getElementById('followingList');
var userId = document.getElementById('userId');
var username = document.getElementById('editUsername');
var editVisibility = document.getElementsByClassName('edit-visibility');

var followBtns = void 0;

var createListElement = function createListElement(id, name) {
    var content = '\n  <a href="/user/' + id + '"  class="user">\n      <i class="fa fa-user"></i>\n      ' + name + '\n    </a>\n  ';
    return content;
};

var loadFollowerList = function loadFollowerList(list, wrapper, addBtn) {
    wrapper.innerHTML = '';
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var data = JSON.parse(list[i]);
            var li = document.createElement('li');
            var btn = '<div class="btn btn-unfollow" data-id="' + data.id + '">Unfollow</div>';
            li.classList = 'follow-item row center-v space-bet-h';

            li.innerHTML = '' + createListElement(data.id, data.name) + (addBtn ? btn : '');
            wrapper.appendChild(li);
        }
    } else {
        var _li = document.createElement('li');
        _li.innerHTML = 'Vaya, parece que este tio es un solitario';
        wrapper.appendChild(_li);
    }
};

var reloadFollowerList = function reloadFollowerList() {
    var config = {
        url: '/follow/list/' + userId.getAttribute('data-id'),
        method: 'POST'
    };
    (0, _utils.ajax)(config).then(function (data) {
        data = JSON.parse(data);
        loadFollowerList(data.followers, followerList, false);
        loadFollowerList(data.following, followingList, data.owner);

        followBtnsHandler();
    });
};

var unfollow = function unfollow(e) {
    follow(e.target.getAttribute('data-id')).then(function (data) {
        data = JSON.parse(data);
        if (data.message === 'OK#0' || data.message === 'OK#1') location.reload();else (0, _modals.errorModal)('No se ha podido hacer unfollow, prueba más tarde. Sigue no funciona te jodes y dejas de acosar la próxima vez');
    });
};

var followBtnsHandler = function followBtnsHandler() {
    followBtns = document.getElementsByClassName('btn-unfollow');
    for (var i = 0; i < followBtns.length; i++) {
        followBtns[i].addEventListener('click', function (e) {
            return (0, _utils.followUser)(e, btnFollow, reloadFollowerList);
        });
    }
};

var editUsername = function editUsername(e) {
    var config = {
        url: '/user/name',
        method: 'POST',
        body: 'name=' + username.value
    };

    (0, _utils.ajax)(config).then(function (data) {
        data = JSON.parse(data);
        if (data.message === 'OK#0') location.reload();else (0, _modals.errorModal)('No se ha podido actualizar tu nombre ' + data.message);
    });
};

var editPostVisibility = function editPostVisibility(e) {
    var radioTarget = document.getElementById(e.target.getAttribute('for'));
    var config = {
        url: '/user/visibility',
        method: 'POST',
        body: 'status=' + radioTarget.value
    };

    (0, _utils.ajax)(config).then(function (data) {
        return console.log(data);
    });
};

var setProfile = exports.setProfile = function setProfile() {
    if (separator === null) return false;
    if (btnFollow !== null) {
        btnFollow.addEventListener('click', function (e) {
            return (0, _utils.followUser)(e, btnFollow, reloadFollowerList);
        });
        btnFollow.addEventListener('click', reloadFollowerList);
    }
    if (username !== null) {
        username.addEventListener('blur', function (e) {
            if (username.value.trim() >= 3) editUsername();
        });
        username.addEventListener('keypress', function (e) {
            if (e.keyCode == 13) editUsername();
        });
    }

    var _loop = function _loop(i) {
        tabsLabel[i].addEventListener('click', function () {
            return footerSeparator.classList = i === 0 ? '' : 'hidden';
        });
    };

    for (var i = 0; i < tabsLabel.length; i++) {
        _loop(i);
    }

    for (var _i = 0; _i < editVisibility.length; _i++) {
        editVisibility[_i].addEventListener('click', editPostVisibility);
    }

    followBtnsHandler();
};

},{"./lib/modals.js":3,"./lib/utils.js":4}],9:[function(require,module,exports){
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

},{"./lib/modals.js":3,"./lib/utils.js":4,"./lib/validaciones.js":5}]},{},[7]);
