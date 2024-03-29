window.Create2dArray = function(x) {
  var arr = new Array;
  for (var i=0;i<x;i++) {
     arr[i] = new Array;
  }

  return arr;
}

window.DocGet = function(x) {
  return document.getElementById(x)
}

window.Rand = function(x) {
  return Math.random() * x | 0
}

window.ShuffleArray = function(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

Array.prototype.rndElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, type) {
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  this.beginPath();
  this.moveTo(x + radius.tl, y);
  this.lineTo(x + width - radius.tr, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  this.lineTo(x + width, y + height - radius.br);
  this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  this.lineTo(x + radius.bl, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  this.lineTo(x, y + radius.tl);
  this.quadraticCurveTo(x, y, x + radius.tl, y);
  this.closePath();
  if (type == "stroke") {
    this.stroke();
  } else {
    this.fill();
  }

}
