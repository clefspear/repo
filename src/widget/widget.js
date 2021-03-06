var buildfire = require('buildfire');

// This is the entry point of your plugin's widget.
// Feel free to require any local or npm modules you've installed.
/*
buildfire.notifications.alert({
  title: 'Hello from BuildFire!',
  message: 'This alert is being launched from the widget'
});
*/

/**
 * Cache variables
 */
var mask = document.createElement("div");
var defaultBackground = '';
var eleContainer = null;
var currentData = null;
document.addEventListener("DOMContentLoaded", function (event) {});
/**
 * Create mask
 */
mask.classList.add("c-mask");

document.body.appendChild(mask);

setTimeout(activateMenu, 3500);

var border_radius = window.innerWidth / 1.005;
var verticalrings = window.innerHeight / 1.005;
var ring_style = document.createElement('style');
var y;
if (border_radius <= verticalrings) {
  y = border_radius;
} else {
  y = verticalrings;
}

var logo_radius = window.innerWidth / 1.4;
var verticallogo = window.innerHeight / 1.4;


var logo_style = document.createElement('style');
var x;
if (logo_radius <= verticallogo) {
  x = logo_radius;
} else {
  x = verticallogo;
}
logo_style.innerHTML =
  '.logo{width: ' + x + 'px;height: ' + x + 'px;border-radius: ' + (x) + '%;top: 50%; margin-top: -' + (verticallogo / 1.73) + 'px; left: 50%; margin-left:-' + (logo_radius / 2) + 'px;}';
document.head.appendChild(logo_style);

var homeX = window.innerWidth * .004;
var home_style = document.createElement('style');
home_style.innerHTML = '#home{left: ' + (50) + '%;margin-left: -' + (homeX + 47) + 'px;}';
document.head.appendChild(home_style);

//var text = document.createTextNode(cauroselImage[title]);
//carousel.appendChild(text);


mask.addEventListener("click", function () {
  //deactivateMenu();
  console.log('click');


});

//setTimeout(() => {
//document.querySelector("#ringContainer").style.display='none';
ring_style.innerHTML =
  '.ring {width: ' + y + 'px;height: ' + y + 'px;border-radius: ' + (y) + '%;margin-top: -' + (verticalrings / 2) + 'px; top: 50%; margin-left: -' + (border_radius / 2) + 'px;left:50%;}';
document.head.appendChild(ring_style);
//}, 650);
/**
 * Activate the menu
 */
function activateMenu() {

  if ((typeof (currentData.showopacity) && currentData == 'undefined' || currentData.showopacity)) {
    document.querySelector("#container").classList.remove("fadefull");
    document.querySelector("#container").classList.add("fade");
  } else {
    document.querySelector("#container").classList.remove("fade");
    document.querySelector("#container").classList.add("fadefull");
  }
  if (!eleContainer) return;

  document.getElementById("name").style.visibility = 'hidden';
  document.getElementById("slogan").style.visibility = 'hidden';
  document.getElementById('home').style.display = 'inline';
  document.getElementById('home').style.zIndex = '1000';



  eleContainer.classList.add("container-active");
}

/**
 * Deactivate the menu
 */
function deactivateMenu() {
  if (!eleContainer) {
    eleContainer = document.getElementById("container");
  }
  eleContainer.classList.remove("container-active");
  document.getElementById('home').style.display = 'none';
  document.getElementById("name").style.visibility = 'visible';
  document.getElementById("slogan").style.visibility = 'visible';

}

document.getElementById("home").addEventListener('click', function () {
  deactivateMenu();
});

document.getElementById('title').addEventListener('click', function () {
  activateMenu();
  localStorage.setItem("notfirstvisit", true);
}, false);

document.getElementById('border').addEventListener('click', function () {
  activateMenu();
}, true);


function updateNameSloganWelcome(data) {

  if (data.name) {
    console.log(data.name);
    document.getElementById('name').innerHTML = data.name;
  }
  if (data.slogan) {
    console.log(data.slogan);
    document.getElementById('slogan').innerHTML = data.slogan;
  }
}

function changebackground(data) {
  var backgroundCSS = '';

  if (!data.backgroundcolor || !data.showbg) {
    if (defaultBackground) {
      document.getElementsByClassName('coloredbar')[0].style.background = defaultBackground;
      return;
    }
    document.getElementsByClassName('coloredbar')[0].style.background = null;
    return;
  }
  if (data.backgroundcolor.colorType == 'gradient') {
    backgroundCSS = data.backgroundcolor.gradient.backgroundCSS;
  } else {
    backgroundCSS = data.backgroundcolor.solid.backgroundCSS;
  }
  backgroundCSS = backgroundCSS.replace("background:", "");
  document.getElementsByClassName('coloredbar')[0].style.background = backgroundCSS;

  //document.getElementBy('coloredbar').innerHTML=data.coloredbar;
}

function loadImages(data) {

  var images = data.carouselItems;
  if (!images || images.length < 1) {
    return;
  }

  eleContainer = document.getElementById("container");
  eleContainer.innerHTML = '';

  function openImage(ele, item) {
    ele.addEventListener('click', function () {
      buildfire.actionItems.execute(item, function () {});
    });
  }
  var firstIndex = true;
  images.forEach(function (currentImage) {
    var ele = document.createElement("div");
    if (firstIndex) {
      ele.className = 'gallery-one';
      firstIndex = false;
    } else {
      ele.className = 'gallery';
    }

    openImage(ele, currentImage);

    eleContainer.appendChild(ele);
    setTimeout(function () {
      var _image = new Image();
      _image.onload = function () {

        ele.innerHTML = '<img src="' + buildfire.imageLib.resizeImage(currentImage.iconUrl, {
          width: 'full'
        }) + '" alt="' + currentImage.title + '"><div class="overlay"></div><h1 class="text gallerytext">' + currentImage.title + '</h1>';

      };
      _image.src = buildfire.imageLib.resizeImage(currentImage.iconUrl, {
        width: 10
      });
    }, 100);
  });

  /**
   * Darken the first gallery on scroll down
   * depends on IntersectionObserver being available
   */

  var eleFiller = document.createElement('div');
  eleFiller.className = 'filler';
  eleContainer.appendChild(eleFiller);

  let options = {
    threshold: [1, .95, .9, .8],
    rootMargin: '10px 0px 0px 0px'
  };
  let callback = function (entries, observer) {
    let target = entries[0].target;
    let ratio = entries[0].intersectionRatio;
    if (ratio <= .80) {
      if (target.querySelector('.overlay') && target.querySelector('.text')) {
        target.querySelector('.overlay').style.opacity = .5;
        target.querySelector('.text').style.transform = ("scale(1)");
      }
    } else {

      if (target.querySelector('.overlay') && target.querySelector('.text')) {
        target.querySelector('.overlay').style.opacity = 0;
        target.querySelector('.text').style.transform = ("scale(2)");
      }
    }
  };
  if ('IntersectionObserver' in window) {
    let observer = new IntersectionObserver(callback, options);
    let target = document.querySelector('.gallery-one');
    observer.observe(target);
  }


  /**
   * Expand and reduce galleries on scroll
   */
  let galleries = document.querySelectorAll('.gallery');
  let container = document.querySelector('.container');

  container.addEventListener('scroll', e => {
    galleries.forEach(gallery => {
      let clientY = gallery.getBoundingClientRect().bottom;
      // expandedGalleryHeight = 334px;
      // reducedGalleryHeight = 148px;
      let deltaY = (clientY - 334 - 148) * -1;
      if (deltaY >= 37 && deltaY < 180) {
        gallery.classList.add("grow");
        gallery.classList.remove("darken");
      }
      if (deltaY >= 180) {
        gallery.classList.add("darken");
      } else if (deltaY <= 1) {
        gallery.classList.remove("grow");
        gallery.classList.remove("darken");
      }
    });
  });

  /**
   * Create a rubber band effect on the first gallery
   */
  var _onload = function () {
    var lastY = 0;
    var initialY;
    let galleries = document.querySelectorAll('.gallery');
    let main = document.querySelector('.main');
    let firstPhoto = document.querySelector('.gallery-one img');
    let galleryOne = document.querySelector('.gallery-one');

    scrollable = document;
    window.addEventListener('touchstart', e => {
      initialY = e.touches[0].clientY;
      /**/
    });
    window.addEventListener('touchend', e => {
      initialY = 0;
      galleryOne.style.height = "334px";
      firstPhoto.style.transform = (`scale(1)`);
    });
    window.addEventListener('touchmove', e => {
      let currentY = e.touches[0].clientY;
      if (currentY > lastY && window.scrollY <= 0) {
        // moving down
        galleryOne.style.height = "400px";
      }
      lastY = currentY;
    });
  };
  _onload();
}

function showRings(data) {
  if (data.showRings) {
    document.getElementById("ring gray1").style.display = "inline";
    document.getElementById("ring gray2").style.display = "inline";
    document.getElementById("ring gray3").style.display = "inline";
    document.getElementById("ring gray4").style.display = "inline";
    document.getElementById("ring gray5").style.display = "inline";
  } else {
    document.getElementById("ring gray1").style.display = "none";
    document.getElementById("ring gray2").style.display = "none";
    document.getElementById("ring gray3").style.display = "none";
    document.getElementById("ring gray4").style.display = "none";
    document.getElementById("ring gray5").style.display = "none";
  }
}

function myawesomegallerytext(data) {
  var classColor = '';
  if (data && data.gallerycolor && data.gallerycolor.solid && data.gallerycolor.solid.color && data.showtextcolor) {
    classColor = '.gallerytext{ color:' + data.gallerycolor.solid.color + ' !important; }';
  }
    document.getElementById('customStylegallery').innerHTML = classColor;
  

}

function myawesometext(data) {
  var titleColor ='';
  if (data && data.titleColor && data.titleColor.solid && data.showtextcolor) {
    titleColor = '.customtitle{ color:' + data.titleColor.solid.color + ' !important; }';
  }
    document.getElementById('customStyleheader').innerHTML = titleColor;
  
}

function changecolors(data) {
  if (!data || !data.colors || data.colors.length < 0) {
    return;
  }
  var x = document.getElementById('ring gray1');

  if (data.colors[0] && data.colors[0].solid && data.colors[0].solid.color) {
    x.style.borderColor = data.colors[0].solid.color;
  } else {
    x.style.borderColor = '';
  }

  if (!data || !data.colors || data.colors.length < 1) {
    return;
  }

  var y = document.getElementById('ring gray2');

  if (data.colors[1] && data.colors[1].solid && data.colors[1].solid.color) {
    y.style.borderColor = data.colors[1].solid.color;
  } else {
    y.style.borderColor = '';
  }

  if (!data || !data.colors || data.colors.length < 2) {
    return;
  }

  var z = document.getElementById('ring gray3');
  if (data.colors[2] && data.colors[2].solid && data.colors[2].solid.color) {
    z.style.borderColor = data.colors[2].solid.color;
  } else {
    z.style.borderColor = '';
  }

  if (!data || !data.colors || data.colors.length < 3) {
    return;
  }

  var a = document.getElementById('ring gray4');

  if (data.colors[3] && data.colors[3].solid && data.colors[3].solid.color) {
    a.style.borderColor = data.colors[3].solid.color;
  } else {
    a.style.borderColor = '';
  }

  if (!data || !data.colors || data.colors.length < 4) {
    return;
  }

  var b = document.getElementById('ring gray5');

  if (data.colors[4] && data.colors[4].solid && data.colors[4].solid.color) {
    b.style.borderColor = data.colors[4].solid.color;
  } else {
    b.style.borderColor = '';
  }
}

function uploadbacksplash(data) {
  if (!data || !data.imagebg || !data.showbg) {
    document.getElementById("imagebg").src = '';
    document.getElementById("imagebg").style.display = 'none';
    return;
  }
  document.getElementById("imagebg").style.display = 'block';
  var _image = new Image();
  _image.onload = function (e) {
    var options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    document.getElementById("imagebg").src = buildfire.imageLib.cropImage(data.imagebg, options);
  };
  _image.src = buildfire.imageLib.cropImage(data.imagebg, {
    width: window.innerWidth,
    height: window.innerHeight
  });
}

function opacitybg(data) {
  if (data && data.opacitynumber) {
    document.getElementById("imagebg").style.opacity = parseInt(data.opacitynumber) / 100;
  }

}

function uploadimage(data) {
  if (data && !data.logo) {
    document.getElementById("logo").src = '';
    document.getElementById("logo").style.display = 'none';
    return;
  }
  var _image = new Image();
  _image.onload = function (e) {
    document.getElementById("logo").src = buildfire.imageLib.cropImage(data.logo, {
      width: logo_radius,
      height: logo_radius

    });
  };

  var _smallLogo = new Image();
  _smallLogo.onload = function () {
    document.getElementById("logo").src = buildfire.imageLib.cropImage(data.logo, {
      width: 10,
      height: 10
    });

    _image.src = buildfire.imageLib.cropImage(data.logo, {
      width: logo_radius,
      height: logo_radius
    });

    if (data.showLogo)
      document.getElementById("logo").style.display = 'block';
    else
      document.getElementById("logo").style.display = 'none';
    document.getElementById("ringContainer").style.display = 'inline';
  };
  _smallLogo.src = buildfire.imageLib.cropImage(data.logo, {
    width: 10,
    height: 10
  });
}

document.getElementById("ringContainer").style.display = 'none';

buildfire.datastore.onUpdate(function (obj) {
  console.log(obj.data);

  if (obj && obj.data) {
    currentData = obj.data;
    loadImages(obj.data);
    changecolors(obj.data);
    uploadimage(obj.data);
    uploadbacksplash(obj.data);
    opacitybg(obj.data);
    changebackground(obj.data);
    showRings(obj.data);
    deactivateMenu();
    updateNameSloganWelcome(obj.data);
    myawesomegallerytext(obj.data);
    myawesometext(obj.data);
  }
});

buildfire.appearance.getAppTheme(function (err, result) {
  if (result && result.colors && result.colors.backgroundColor) {
    defaultBackground = result.colors.backgroundColor;
  }
  buildfire.datastore.get(function (err, obj) {
    if (obj && obj.data) {
      currentData = obj.data;
      loadImages(obj.data);
      updateNameSloganWelcome(obj.data);
      changecolors(obj.data);
      uploadimage(obj.data);
      uploadbacksplash(obj.data);
      opacitybg(obj.data);
      changebackground(obj.data);
      showRings(obj.data);
      myawesomegallerytext(obj.data);
      myawesometext(obj.data);
    }
  });
});