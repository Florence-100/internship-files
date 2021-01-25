    let redbox = document.querySelector("#box");
    let greybox = document.querySelector(".container");

    greybox.addEventListener("click", checkparent, true);

    let tohide = false;

    //greybox.style.backgroundColor = 'blue';
    
    function checkparent(e){
      tohide = true;
      redbox.addEventListener("click", checkchild, true);
      hide(tohide);
    }

    function checkchild(e){
      tohide = false;
      redbox.style.opacity = 1;
    }

    function hide(test){
      if (test) {
        redbox.style.opacity = 0;
      }
    } 