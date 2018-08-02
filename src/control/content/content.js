// This is the entry point of your plugin's content control.
// Feel free to require any local or npm modules you've installed.
//
// import Buildfire from 'buildfire';
let buildfire = window.buildfire;
var colorRings = [];
var mylogo = '';
var mybg = '';
var editor;
var coloredbar;
var rings = {};
var ringbox = {};

var start = Date.now();

let tmr = null;

function save() {

  if (!tmr) {
    tmr = setTimeout(() => {

      buildfire.datastore.save({
        colors: colorRings,
        logo: mylogo,
        imagebg: mybg,
        backgroundcolor: coloredbar,
        opacitynumber: document.querySelector("#number").value,
        carouselItems: editor.items,
        showLogo: document.getElementById('chkSwitchLogo').checked,
        showRings: document.getElementById('chkSwitchRings').checked,
        showopacity: document.getElementById('transparent').checked,
        name: document.getElementById("name").value,
        slogan: document.getElementById("slogan").value,
      }, function (err, result) {
        if (err)
          console.error(err);
        else
          console.log("saved");
        console.log(result);

      });

    }, 500);
    tmr = null;
  }
}

function sliderupdate() {
  var value = document.querySelector("#number");
  var slider = document.querySelector("#range");
  value.oninput = function () {
    if (this.value.length > 3) {
      this.value = this.value.slice(0, 3);
    }
  };
  slider.oninput = function (e) {
    console.log(e);
    slider.value = isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10);
    value.value = isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10);
    save();
  };
  value.oninput = function (e) {
    console.log(e);
    value.value = isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10);
    slider.value = isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10);
    save();
  };

}
sliderupdate();




function backgroundupload() {
  document.getElementById("backgroundupload").onclick = function () {

    var options = {
      multiSelection: false,
      showIcons: false
    };
    var callback = function (error, result) {
      if (result && result.selectedFiles && result.selectedFiles[0]) {
        document.getElementById("backgroundscreen").src = buildfire.imageLib.cropImage(result.selectedFiles[0], {
          width: 80,
          height: 80
        });
        document.getElementById("backgroundscreen").style.display = 'block';
        mybg = result.selectedFiles[0];
        save();
      }
    };

    buildfire.imageLib.showDialog(options, callback);
  };
}
backgroundupload();


function imageupload() {
  document.getElementById('logobox').onclick = function () {

    var options ={
      multiSelection: false,
      showIcons: false
    };
    var callback = function (error, result) {
      if (result && result.selectedFiles && result.selectedFiles[0]) {
        document.getElementById('logobox_img').src = result.selectedFiles[0];
        document.getElementById('logobox_img').style.display = 'block';
        mylogo = result.selectedFiles[0];
        save();
      }
    };

    buildfire.imageLib.showDialog(options, callback);
  };
}
imageupload();


document.getElementById("deletekeybackground").onclick = function () {
  mybg = null;
  document.getElementById("backgroundscreen").style.display = 'none';
  document.getElementById("backgroundscreen").src = null;
  save();
};

document.getElementById('deletekeylogo').onclick = function () {
  mylogo = null;
  document.getElementById('logobox_img').style.display = 'none';
  document.getElementById('logobox_img').src = null;
  save();
};

document.getElementById('deletekeybg').onclick = function () {
  document.getElementById('dvShowSelectedColorBar').style.background = '';
  coloredbar = null;
  save();
};

function deleterings() {
  let x = document.getElementsByClassName("deletering");
  var y = [].slice.call(x);
  y.forEach(deletering => {
    deletering.onclick = function (e) {
      //debugger;
      let index = document.getElementById(e.target.id).getAttribute("index");
      colorRings[index] = null;
      document.getElementById('ringbox' + index).style.background = '';
      save();
      e.stopPropagation();
    };

  });
}
deleterings();

document.getElementById('dvShowSelectedColorBar').onclick = function (err, result) {
  buildfire.colorLib.showDialog(coloredbar, {}, function (err, result) {
    coloredbar = result;
    save();
  }, function (err, result) {
    coloredbar = result;

    var background = '';
    if (result && result.colorType == 'gradient') {
      background = result.gradient.backgroundCSS;
    } else {
      background = result.solid.backgroundCSS;
    }
    background = background.replace("background:", "");
    document.getElementById('dvShowSelectedColorBar').style.background = background;
    save();
  });
};

function changering() {
  var i = 0;

  function ringboxonclick(index) {
    return function () {
      if (!colorRings)
        colorRings = [];
      var options = {
        hideGradient: true
      };
      buildfire.colorLib.showDialog(colorRings[index], options, function (err, result) {
        colorRings[index] = result;
        save();
      }, function (err, result) {
        colorRings[index] = result;
        rings[index] = '';
        if (result && result.colorType == 'gradient') {
          rings[index] = result.gradient.backgroundCSS;
        } else {
          rings[index] = result.solid.backgroundCSS;
        }
        rings[index] = rings[index].replace("background:", "");

        document.getElementById(`ringbox${index}`).style.background = rings[index];
        save();
      });
    };
  }
  for (i = 0; i < 5; i++) {
    document.getElementById('ringbox' + i + 'ColorPopup').onclick = ringboxonclick(i);
  }
}
changering();

/// create a new instance of the buildfire carousel editor
editor = new buildfire.components.carousel.editor("#carouselImages");
var imageEditorContainer = document.querySelector('#carouselImages .pull-right.col-md-9');
imageEditorContainer.classList.replace("col-md-9", "col-md-12");
var addgallerybutton = document.querySelector('#carouselImages .btn.btn-success.pull-left.add-new-carousel');
addgallerybutton.classList.replace("btn-success", "btn-primary");
document.querySelector("#carouselImages .btn.btn-primary.pull-left.add-new-carousel").style = "margin-top: 10px";
document.querySelector("#carouselImages span").innerHTML = "Image Gallery";
/// handle the loading
function loadImages(carouselItems) {
  // create an instance and pass it the items if you don't have items yet just pass []
  editor.loadItems(carouselItems);

}

function load() {
  buildfire.datastore.get(function (err, obj) {
    if (err) {
      throw err;
    }
    if (obj && obj.data) {
      colorRings = obj.data.colors;
      coloredbar = obj.data.backgroundcolor;
      mylogo = obj.data.logo;
      mybg = obj.data.imagebg;
      document.getElementById('chkSwitchLogo').checked = obj.data.showLogo;
      document.getElementById('chkSwitchRings').checked = obj.data.showRings;
      document.getElementById('transparent').checked = obj.data.showopacity;
      document.querySelector("#number").value = obj.data.opacitynumber;
      document.querySelector("#range").value = obj.data.opacityslider;

      if (obj.data.showRings) {
        document.getElementById('ringArea').style.display = "flex";
      } else {
        document.getElementById('ringArea').style.display = "none";
      }
      if (obj.data.showLogo) {
        document.getElementById('image_holder').style.display = '';
      } else {
        document.getElementById('image_holder').style.display = 'none';
      }

      if (mybg) {
        document.getElementById("backgroundscreen").src = buildfire.imageLib.cropImage(mybg, {
          width: 80,
          height: 80
        });
        document.getElementById("backgroundscreen").style.display = 'block';
      } else {
        document.getElementById("backgroundscreen").style.display = 'none';
      }

      if (mylogo) {
        document.getElementById('logobox_img').src = mylogo;
        document.getElementById('logobox_img').style.display = 'block';
      } else {
        document.getElementById('logobox_img').style.display = 'none';
      }

      if (obj.data.opacitynumber) {
        document.getElementById("number").value = obj.data.opacitynumber;
        document.getElementById("range").value = obj.data.opacitynumber;
      } else {
        document.getElementById("number").value = 100;
        document.getElementById("range").value = 100;
      }

      if (obj.data.name || obj.data.slogan) {
        document.getElementById("name").value = obj.data.name;
        document.getElementById("slogan").value = obj.data.slogan;
      } else {
        return;
      }
      document.getElementById("dvShowSelectedColorBar").value = obj.data.welcome;
      colorRings = obj.data.colors || [];

      loadImages(obj.data.carouselItems);

      if (coloredbar) {
        var background = '';
        if (coloredbar.colorType == 'gradient') {
          background = coloredbar.gradient.backgroundCSS;
        } else {
          background = coloredbar.solid.backgroundCSS;
        }
        background = background.replace("background:", "");
        document.getElementById('dvShowSelectedColorBar').style.background = background;
      }

      var ring0 = '';
      if (colorRings && colorRings[0]) {
        if (colorRings[0].colorType == 'gradient') {
          ring0 = colorRings[0].gradient.backgroundCSS;
        } else {
          ring0 = colorRings[0].solid.backgroundCSS;
        }
      }
      ring0 = ring0.replace("background:", "");
      document.getElementById('ringbox0').style.background = ring0;




      var ring1 = '';
      if (colorRings && colorRings[1]) {
        if (colorRings[1].colorType == 'gradient') {
          ring1 = colorRings[1].gradient.backgroundCSS;
        } else {
          ring1 = colorRings[1].solid.backgroundCSS;
        }
      }
      ring1 = ring1.replace("background:", "");
      document.getElementById('ringbox1').style.background = ring1;



      var ring2 = '';
      if (colorRings && colorRings[2]) {
        if (colorRings[2].colorType == 'gradient') {
          ring2 = colorRings[2].gradient.backgroundCSS;
        } else {
          ring2 = colorRings[2].solid.backgroundCSS;
        }
      }
      ring2 = ring2.replace("background:", "");
      document.getElementById('ringbox2').style.background = ring2;



      var ring3 = '';
      if (colorRings && colorRings[3]) {
        if (colorRings[3].colorType == 'gradient') {
          ring3 = colorRings[3].gradient.backgroundCSS;
        } else {
          ring3 = colorRings[3].solid.backgroundCSS;
        }
      }
      ring3 = ring3.replace("background:", "");
      document.getElementById('ringbox3').style.background = ring3;



      var ring4 = '';
      if (colorRings && colorRings[4]) {
        if (colorRings[4].colorType == 'gradient') {
          ring4 = colorRings[4].gradient.backgroundCSS;
        } else {
          ring4 = colorRings[4].solid.backgroundCSS;
        }
      }
      ring4 = ring4.replace("background:", "");
      document.getElementById('ringbox4').style.background = ring4;
    }
  });
}
load();

function autosave() {
  document.getElementById("name").oninput = function () {
    save();
  };

  document.getElementById("slogan").oninput = function () {
    save();
  };
  document.getElementById('chkSwitchLogo').oninput = function () {
    var value = document.getElementById('chkSwitchLogo').checked;

    function viewlogo() {
      if (value) {
        document.getElementById('image_holder').style.display = '';
      } else {
        document.getElementById('image_holder').style.display = 'none';
      }
    }
    viewlogo();
    save();
  };

  document.getElementById('chkSwitchRings').oninput = function () {

    var _value = document.getElementById('chkSwitchRings').checked;

    function viewrings() {
      if (_value) {
        document.getElementById('ringArea').style.display = 'flex';
      } else {
        document.getElementById('ringArea').style.display = 'none';
      }
    }
    viewrings();
    save();
  };
  document.getElementById('transparent').oninput = function () {
    save();
  };

}
autosave();

function autosavecarousel() {
  // this method will be called when a new item added to the list
  editor.onAddItems = function (items) {

    save(editor.items);

    var alllinks = document.querySelectorAll("#carouselImages .d-item a");
    for (var i = editor.items.length - 1; i < editor.items.length; i--) {
      alllinks[i].click();
    }
  };
  // this method will be called when an item deleted from the list
  editor.onDeleteItem = function (item, index) {
    save(editor.items);
  };
  // this method will be called when you edit item details
  editor.onItemChange = function (item) {
    save(editor.items);
  };
  // this method will be called when you change the order of items
  editor.onOrderChange = function (item, oldIndex, newIndex) {
    save(editor.items);
  };
}
autosavecarousel();

console.log("Page load took " + (Date.now() - start) + " milliseconds");