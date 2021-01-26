    var dragItem = document.querySelector(".box");
    var container = document.querySelector(".container");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    document.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, dragItem);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.position = "absolute";
      el.style.left = xPos + "px";
      el.style.top = yPos + "px";
    }