(function () {
  var buttons = document.querySelectorAll(".fx-btn");

  function createRipple(btn, x, y) {
    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement("span");
    ripple.className = "ripple";

    var left = x - rect.left;
    var top = y - rect.top;

    ripple.style.left = left + "px";
    ripple.style.top = top + "px";

    btn.appendChild(ripple);

    ripple.addEventListener("animationend", function () {
      ripple.parentNode.removeChild(ripple);
    });
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
      createRipple(this, e.clientX, e.clientY);
      var url = this.getAttribute("data-url");
      if (url) {
        window.open(url, "_blank");
      }
    });
  }
})();