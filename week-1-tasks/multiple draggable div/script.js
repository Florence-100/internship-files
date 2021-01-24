    var container = document.querySelector(".container");

    var activeItem = null;
    var active = false;

    container.addEventListener("mousedown", dragStart, false); //event mousedown detected launch dragStart function
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    var elONE = document.querySelector(".box #box1");
    var elTWO = document.querySelector(".box #box2");
    var elTHREE = document.querySelector(".box #box3");

    function storePositions() {
      var positionONE = elONE.style.transform;
      localStorage.setItem('positionONE', positionONE); //set positionONE = positionONE
      localStorage.setItem('positionONE_x', elONE.xOffset);
      localStorage.setItem('positionONE_y', elONE.yOffset);

      var positionTWO = elTWO.style.transform;
      localStorage.setItem('positionTWO', positionTWO);
      localStorage.setItem('positionTWO_x', elTWO.xOffset);
      localStorage.setItem('positionTWO_y', elTWO.yOffset);

      var positionTHREE = elTHREE.style.transform;
      localStorage.setItem('positionTHREE', positionTHREE);
      localStorage.setItem('positionTHREE_x', elTHREE.xOffset);
      localStorage.setItem('positionTHREE_y', elTHREE.yOffset);
    };

    function retrievePositions() {
      var positionONEsaved = localStorage.getItem('positionONE');
      var positionTWOsaved = localStorage.getItem('positionTWO');
      var positionTHREEsaved = localStorage.getItem('positionTHREE');

      if (positionONEsaved) {
        elONE.style.transform = positionONEsaved;
        elONE.xOffset = localStorage.getItem('positionONE_x');
        elONE.yOffset = localStorage.getItem('positionONE_y');
      }
      if (positionTWOsaved) {
        elTWO.style.transform = positionTWOsaved;
        elTWO.xOffset = localStorage.getItem('positionTWO_x');
        elTWO.yOffset = localStorage.getItem('positionTWO_y');
      }
      if (positionTHREEsaved) {
        elTHREE.style.transform = positionTHREEsaved;
        elTHREE.xOffset = localStorage.getItem('positionTHREE_x');
        elTHREE.yOffset = localStorage.getItem('positionTHREE_y');
      }
    };

    function dragStart(e) {
      if (e.target !== e.currentTarget) {
        active = true;

        // this is the item we are interacting with
        activeItem = e.target;

        if (activeItem !== null) {
          if (!activeItem.xOffset) {
            activeItem.xOffset = 0;
          }

          if (!activeItem.yOffset) {
            activeItem.yOffset = 0;
          }
            
          activeItem.initialX = e.clientX - activeItem.xOffset;
          activeItem.initialY = e.clientY - activeItem.yOffset;
        }
      }
    }

    function dragEnd(e) {
      if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
      }

      //MY ADD Store Info to Local Storage
      setTimeout(storePositions, 111);

      active = false;
      activeItem = null;
    }

    function drag(e) {
        if (active) {
          activeItem.currentX = e.clientX - activeItem.initialX;
          activeItem.currentY = e.clientY - activeItem.initialY;

          activeItem.xOffset = activeItem.currentX;
          activeItem.yOffset = activeItem.currentY;

          setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
        }
      }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    document.addEventListener("DOMContentLoaded", function (event) {
      setTimeout(retrievePositions, 0);
    });
  