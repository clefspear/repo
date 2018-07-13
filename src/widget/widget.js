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
var activeClass = "is-active";
var eleContainer;
var currentData = null;
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
});
/**
 * Create mask
 */
mask.classList.add("c-mask");
document.body.appendChild(mask);

setTimeout(activateMenu, 3000);

var border_radius = window.innerWidth/1.005;
var verticalrings = window.innerHeight/1.005;
var ring_style = document.createElement('style');
var y;
if(border_radius <= verticalrings)
{
  y = border_radius;
}
else {
  y = verticalrings;
}
ring_style.innerHTML =
  '.ring {width: ' + y + 'px;height: ' + y + 'px;border-radius: ' + (y) + '%;margin-top: -' + (verticalrings/2.4) + 'px; top: 50%; margin-left: -' + (border_radius / 2) + 'px;left:50%;}';
document.head.appendChild(ring_style);


var logo_radius = window.innerWidth/1.4;
var verticallogo = window.innerHeight/1.4;
var logo_style = document.createElement('style');
var x;
if(logo_radius <= verticallogo)
{
  x = logo_radius;
}
else {
  x = verticallogo;
}
logo_style.innerHTML =
  '.logo{width: ' + x + 'px;height: ' + x + 'px;border-radius: ' + (x) + '%;top: 50%; margin-top: -' + (verticallogo / 2.2) + 'px; left: 50%; margin-left:-' + (logo_radius / 2) + 'px;}';
document.head.appendChild(logo_style);

var homeX = window.innerWidth*.004;
var home_style = document.createElement('style');
home_style.innerHTML = '#home{left: ' + (50) + '%;margin-left: -' + (homeX+47) + 'px;}';
document.head.appendChild(home_style);

//var text = document.createTextNode(cauroselImage[title]);
//carousel.appendChild(text);

/**
 * Listen for clicks on the toggle


toggle.addEventListener("click", function(e) {
  e.preventDefault();
  toggle.classList.contains(activeClass) ? deactivateMenu() : activateMenu();
});
 */

/**
 * Listen for clicks on the mask, which should close the menu
 */
mask.addEventListener("click", function() {
  //deactivateMenu();
  console.log('click');
});

/**
 * Activate the menu
 */
function activateMenu() {
  //menu.classList.add(activeClass);
  //toggle.classList.add(activeClass);
  //mask.classList.add(activeClass);

  eleContainer.classList.add("container-active");

  var opacity = 1;
  if (currentData && (typeof(currentData.showopacity) == 'undefined' || currentData.showopacity)) {
    opacity = 0.8;
  }
  eleContainer.style.opacity = opacity;

  document.getElementById("name").style.visibility = 'hidden';
  document.getElementById("slogan").style.visibility = 'hidden';
  document.getElementById('home').style.display = 'inline';
  document.getElementById('home').style.zIndex = '1000';
}

/**
 * Deactivate the menu
 */
function deactivateMenu() {
  eleContainer.classList.remove("container-active");
  document.getElementById('home').style.display = 'none';
  document.getElementById("name").style.visibility = 'visible';
  document.getElementById("slogan").style.visibility = 'visible';

}

document.getElementById("home").addEventListener('click', function() {
  deactivateMenu();
});

document.getElementById('title').addEventListener('click', function() {
  activateMenu();
  localStorage.setItem("notfirstvisit", true);
}, false);

document.getElementById('border').addEventListener('click', function() {
  activateMenu();
}, true);


function updateNameSloganWelcome(data) {
  document.getElementById('name').innerHTML = data.name;
  document.getElementById('slogan').innerHTML = data.slogan;
}

function changebackground(data) {
  var backgroundCSS = '';
  if (!data.backgroundcolor)
    return;
  if (data.backgroundcolor.colorType == 'gradient') {
    backgroundCSS = data.backgroundcolor.gradient.backgroundCSS;
  } else {
    backgroundCSS = data.backgroundcolor.solid.backgroundCSS;
  }
  backgroundCSS = backgroundCSS.replace("background:", "");
  document.getElementsByClassName('coloredbar')[0].style.background = backgroundCSS;
  //document.getElementBy('coloredbar').innerHTML=data.coloredbar;
}

function changecolors(data) {
  if (!data || !data.colors || data.colors.length < 0) {
    return;
  }
  var x = document.getElementById('ring gray1');

  if (data.colors[0] && data.colors[0].solid && data.colors[0].solid.color) {
    x.style.borderColor = data.colors[0].solid.color;
  }
  else{
    x.style.borderColor ='';
  }

  if (!data || !data.colors || data.colors.length < 1) {
    return;
  }

  var y = document.getElementById('ring gray2');

  if (data.colors[1] && data.colors[1].solid && data.colors[1].solid.color) {
    y.style.borderColor = data.colors[1].solid.color;
  }
  else{
    y.style.borderColor ='';
  }

  if (!data || !data.colors || data.colors.length < 2) {
    return;
  }

  var z = document.getElementById('ring gray3');
  if (data.colors[2] && data.colors[2].solid && data.colors[2].solid.color) {
    z.style.borderColor = data.colors[2].solid.color;
  }
  else{
    z.style.borderColor ='';
  }

  if (!data || !data.colors || data.colors.length < 3) {
    return;
  }

  var a = document.getElementById('ring gray4');

  if (data.colors[3] && data.colors[3].solid && data.colors[3].solid.color) {
    a.style.borderColor = data.colors[3].solid.color;
  }
  else{
    a.style.borderColor ='';
  }

  if (!data || !data.colors || data.colors.length < 4) {
    return;
  }

  var b = document.getElementById('ring gray5');

  if (data.colors[4] && data.colors[4].solid && data.colors[4].solid.color) {
    b.style.borderColor = data.colors[4].solid.color;
  }
  else{
    b.style.borderColor ='';
  }
}

function showLogo(data) {
  if (data.showLogo) {
    document.getElementById("logo").style.display = "inline";
  } else {
    document.getElementById("logo").style.display = "none";
  }
}

if (logo) {
  document.getElementById("logo").style.display = "inline";
} else {
  document.getElementById("logo").style.display = "none";
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

function uploadimage(data) {
  document.getElementById("logo").src = data.logo;
}

function loadImages(data) {

  var images = data.carouselItems;
  if (!images || images.length < 1) {
    return;
  }

  eleContainer = document.getElementById("container");
  eleContainer.innerHTML = '';

  function openImage(ele, item) {
    ele.addEventListener('click', function() {
      buildfire.actionItems.execute(item, function() {});
    });
  }

  for (var i = 0; i < images.length; i++) {

    var ele = document.createElement("div");
    if (i == 0) {
      ele.className = 'gallery-one';
    } else {
      ele.className = 'gallery';
    }
    ele.innerHTML = '<img src="' + images[i].iconUrl + '" alt="' + images[i].title + '"><div class="overlay"></div><h1 class="text">' + images[i].title + '</h1>';
    openImage(ele, images[i]);

    eleContainer.appendChild(ele);
  }
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
  let callback = function(entries, observer) {
    let target = entries[0].target;
    let ratio = entries[0].intersectionRatio;
    if (ratio <= .80) {
      target.querySelector('.overlay').style.opacity = .5;
      target.querySelector('.text').style.transform = ("scale(1)");
    } else {
      target.querySelector('.overlay').style.opacity = 0;
      target.querySelector('.text').style.transform = ("scale(2)");
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
  var _onload = function() {
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

buildfire.datastore.onUpdate(function(obj) {
  //debugger;
  if (obj && obj.data) {
    currentData = obj.data;
    loadImages(obj.data);
    updateNameSloganWelcome(obj.data);
    changecolors(obj.data);
    uploadimage(obj.data);
    changebackground(obj.data);
    showLogo(obj.data);
    showRings(obj.data);
    deactivateMenu();

  }
});

buildfire.datastore.get(function(err, obj) {
  //debugger;
  if (obj && obj.data) {
    currentData = obj.data;
    loadImages(obj.data);
    updateNameSloganWelcome(obj.data);
    changecolors(obj.data);
    uploadimage(obj.data);
    changebackground(obj.data);
    showLogo(obj.data);
    showRings(obj.data);
  }
});
