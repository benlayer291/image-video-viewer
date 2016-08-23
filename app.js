window.onload = function() {
  app.init();
}

var app = {
  init: function() {

    // get initial window size
    helpers.getWindowSize()

    // set up event listeners
    helpers.createEventListeners();

    // Get background media
    helpers.getJSON('./media.json', function(data) {
      main.media = data.media;

      // set the initial image
      main.setMedia();
    })
  }


};

var main = {
  index: 0,

  windowSize: '',

  setMedia: function() {
    // select DOM elements
    var backgroundOverlay = document.querySelector('.main__background-overlay');
    var backgroundOverlayText = document.querySelector('.main__background-text');

    var backgroundVideo = document.querySelector('.main__background-video');
    var backgroundVideoNext = document.querySelector('.main__background-video--next');
    var backgroundVideoPrev = document.querySelector('.main__background-video--prev');

    var backgroundImage = document.querySelector('.main__background-image');
    var backgroundImageNext = document.querySelector('.main__background-image--next');
    var backgroundImagePrev = document.querySelector('.main__background-image--prev');

    // backgroundVideo.style.opacity = 0;
    // backgroundImage.style.opacity = 0;

    // Add Overlay
    backgroundOverlayText.innerHTML = (main.media.length - main.index);
    backgroundOverlayText.style.backgroundColor = '#fff'; // fallback for lack of image background
    backgroundOverlay.style.opacity = 1.5;

    // Add new media
    if (main.media[main.index]['type'] === 'image') {
      backgroundImage.style.display = 'block';
      backgroundVideo.style.display = 'none';

      backgroundImage.style.backgroundImage = 'url('+ main.media[main.index][main.windowSize] +')';
      backgroundOverlayText.style.backgroundImage = 'url('+ main.media[main.index][main.windowSize] +')';

    } else if (main.media[main.index]['type'] === 'video') {
      backgroundVideo.style.display = 'block';
      backgroundImage.style.display = 'none';

      backgroundVideo.src = main.media[main.index][main.windowSize];
      backgroundOverlayText.style.backgroundImage = '';
    }

    // Add previous media
    if (main.media[main.index-1] !== undefined && main.media[main.index-1]['type'] === 'image') {
      backgroundImagePrev.style.backgroundImage = 'url('+ main.media[main.index-1][main.windowSize] +')';
    } else if (main.media[main.index-1] !== undefined && main.media[main.index-1]['type'] === 'video') {
      backgroundVideoPrev.src = main.media[main.index-1][main.windowSize];
    }

    // Add next media
    if (main.media[main.index+1] !== undefined && main.media[main.index+1]['type'] === 'image') {
      backgroundImageNext.style.backgroundImage = 'url('+ main.media[main.index+1][main.windowSize] +')';
    } else if (main.media[main.index+1] !== undefined && main.media[main.index+1]['type'] === 'video') {
      backgroundVideoNext.src = main.media[main.index+1][main.windowSize];
    }

    // Fade overlay out
    setTimeout(function() {
      helpers.fadeOut(backgroundOverlay);
    }, 1000);

  },

  changeMedia: function(direction) {
    if (direction === 'down') {
      if (main.index === main.media.length-1) {
        return;
      } else {
        main.index++;
        return main.setMedia();
      }
    } else if (direction === 'up') {
      if (main.index === 0) {
        return;
      } else {
        main.index--;
        return main.setMedia();
      }
    }
  },

  onKeyup: function(event) {
    if (helpers.keyupFlag) {
      event.preventDefault();

      if (event.which === 40) {
        return main.changeMedia('down');
      }
      if (event.which === 38) {
        return main.changeMedia('up');
      }
    }
  },

  onScroll: function(event) {
    if (helpers.wheelFlag) {
      var eventInfo = event.wheelDeltaY;
      event.preventDefault();

      if (eventInfo < 0) {
        return main.changeMedia('down');
      } else {
        return main.changeMedia('up');
      }
    }
  },

  onResize: function() {
    var windowWidth = window.innerWidth;
    var backgroundImage = document.querySelector('.main__background-image');
    var backgroundVideo = document.querySelector('.main__background-video');

    (window.innerWidth < 600) ? main.windowSize = 'mobile' : main.windowSize = 'desktop';

    backgroundImage.style.backgroundImage = 'url('+ main.media[main.index][main.windowSize] +')';
    backgroundVideo.src = main.media[main.index][main.windowSize];
  } 
}

var menu = {

  toggleMenu: function(event) {
    event.preventDefault;

    var menuHead = document.querySelector('.menu');
    var menuHeadText = document.querySelector('.menu__head-text');
    var menuListItems = document.querySelector('.menu__list-items');

    (this.classList.contains('is-active') === true) ? this.classList.remove('is-active') : this.classList.add('is-active');
    (this.classList.contains('is-active') === true) ? this.parentElement.classList.add('is-active') : this.parentElement.classList.remove('is-active');
    helpers.toggleEventListeners();

    (menuHead.classList.contains('is-active') === true) ? menuHead.classList.remove('is-active') : menuHead.classList.add('is-active');
    menuHeadText.innerHTML= (main.media.length);
    
    if ( menuHead.classList.contains('is-active') === true ) {
      // create media items for the grid
      for (var i=0; i<main.media.length; i++) {
        var newItem = document.createElement('a');
        newItem.classList.add('menu__list-item');

        var newItemMedia = document.createElement('figure');
        newItemMedia.classList.add('menu__list-image');
        newItemMedia.style.backgroundImage = (main.media[i]['type'] === 'image') ? 'url('+ main.media[i].desktop +')' : 'url('+ main.media[i].image +')' ;

        // if (main.media[i]['type'] === 'image') {
        //   var newItemImg = document.createElement('figure');
        //   newItemImg.classList.add('menu__list-image');
        //   newItemImg.setAttribute('id', i);
        //   newItemImg.style.backgroundImage = 'url('+ main.media[i].desktop +')';

        //   newItem.appendChild(newItemImg);

        // } else {
        //   var newItemVideo = document.createElement('video');
        //   newItemVideo.classList.add('menu__list-video');
        //   newItemVideo.setAttribute('id', i);
        //   newItemVideo.src = main.media[i].desktop;

        //   newItem.appendChild(newItemVideo);
        // }

        // make grid items clickable
        newItem.setAttribute('id', i);
        newItem.addEventListener('click', menu.goToItem);

        // add media items to the grid
        newItem.appendChild(newItemMedia);
        menuListItems.appendChild(newItem);

      };
    } else {
      // remove images from the grid
      while(menuListItems.firstChild) {
        menuListItems.removeChild(menuListItems.firstChild);
      }
    }
  },

  goToItem: function() {
    // DOM manipulation
    var menuHead = document.querySelector('.menu');
    var mainButton = document.querySelector('.main__button');
    var menuListItems = document.querySelector('.menu__list-items');

    menuHead.classList.remove('is-active');
    mainButton.classList.remove('is-active');
    mainButton.parentElement.classList.remove('is-active');

    // remove images from the grid to prevent duplication
    while(menuListItems.firstChild) {
      menuListItems.removeChild(menuListItems.firstChild);
    }
    // change image background
    main.index = this.id;
    main.setMedia();

    // toggle event listeners again for main page
    helpers.toggleEventListeners();
  }
}

var helpers = {

  wheelFlag: true,
  keyupFlag: true,

  debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  fadeOut: function(element) {
    setInterval(function() {
      if (element.style.opacity <= 0) {
        element.style.opacity = 0;
      } else {
        element.style.opacity-=0.05;
      }
    }, 100);
  },

  fadeIn: function(element) {
    setInterval(function() {
      if (element.style.opacity >= 1) {
        element.style.opacity = 1;
      } else {
        element.style.opacity+=0.05;
      }
    }, 100);
  },

  createEventListeners: function() {
    // listen for window resize events
    window.addEventListener('resize', helpers.debounce(main.onResize, 200, false));

    // listen for keyup events on body
    document.body.addEventListener('keyup', main.onKeyup);

    // listen for wheel events on body
    document.body.addEventListener('wheel', helpers.debounce(main.onScroll, 200, true));

    // listen for menu-button being clicked
    var menuButton = document.querySelector('.main__button');
    menuButton.addEventListener('click', menu.toggleMenu);
  },

  toggleEventListeners: function() {

    // Add or remove flag to determine action of event listeners functions. Note, not removing event listeners.
    helpers.wheelFlag = (helpers.wheelFlag === false) ? true : false;
    helpers.keyupFlag = (helpers.keyupFlag === false) ? true : false;
  },

  getWindowSize: function() {
    (window.innerWidth < 600) ? main.windowSize = 'mobile' : main.windowSize = 'desktop';
  },

  getJSON: function(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
        }
      }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
  },
}
























