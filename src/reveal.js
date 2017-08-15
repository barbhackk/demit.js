// Reveal.js
// MIT License
// Copyright (c) 2017 Sébastien Doutre

// CLASS DEFINITION
// =================
var Reveal = function(elem, opt){
	this.coords = [];
	this.element = elem;
	this.options = opt;
	this.init();
}

// VERSION
// =================
Reveal.VERSION = "1.0.0";

// CONFIGURATION
// =================
Reveal.CONFIG = {
	backgroundColor: "#FFFFFF",
	shadowColor: "#000000",
	shadowBlur: "30",
	lineCap: "round",
	persistence: 1E3
}

// Init()
// Initialisation du plugin
// =================
Reveal.prototype.init = function() {
	var that = this;
	var element = this.element;
	var options = this.options;
	
	var imgBackGround = document.createElement("div");
	imgBackGround.className = "bg-canvas";
	imgBackGround.style.position = "absolute";
	imgBackGround.style.top = 0;
	imgBackGround.style.left = 0;
	imgBackGround.style.right = 0;
	imgBackGround.style.bottom = 0;
	imgBackGround.style.filter = "blur(10px) contrast(175%)";
	imgBackGround.style.WebkitFilter = "blur(10px) contrast(175%)";
	imgBackGround.style.backgroundImage = "url('" + options.url + "')";
    imgBackGround.style.backgroundSize = "cover";
	imgBackGround.style.zIndex = "-9999";
	
	element.append(imgBackGround);
	
	var canvas = document.createElement("canvas");
	canvas.width = element.clientWidth;
	canvas.height = element.clientHeight;
	
	element.append(canvas);
	
	var canvasBlur = document.createElement("canvas");
	canvasBlur.width = element.clientWidth;
	canvasBlur.height = element.clientHeight;
	
	if ((ctx = canvas.getContext("2d"))) {
		backgroundImage = new Image();
		backgroundImage.src = options.url;
		backgroundImage.onload = function(){	
			that.draw(canvas, canvasBlur, backgroundImage);
		}
    }
	
	element.addEventListener("mousemove", function(e){
		that.coords.unshift({t: Date.now(), x: e.clientX, y: e.clientY});
	});
}

// draw()
// Dessine un chemin qui défloute l'image de fond en fonction des coordonnées 
// de la souris instanciées dans un tableau
// =================
Reveal.prototype.draw = function(canvas, canvasBlur, bg){

	// https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame
	// Notifie le navigateur d'exécuter une animation et demande que celui-ci exécute 
	// une fonction spécifique de mise à jour de l'animation, avant le prochain rafraîchissement du navigateur
	requestAnimationFrame(this.draw.bind(this, canvas, canvasBlur, bg));
	
	var ctx = canvas.getContext("2d");
	var ctxBlur = canvasBlur.getContext("2d");
	
	ctxBlur.lineCap = Reveal.CONFIG.lineCap;
	ctxBlur.shadowColor = Reveal.CONFIG.shadowColor;
	ctxBlur.shadowBlur = Reveal.CONFIG.shadowBlur;
	
	imageX = canvas.width;
	imageY = canvas.width / bg.naturalWidth * bg.naturalHeight;
	imageY < canvas.height && (imageY = canvas.height,
	imageX = canvas.height / bg.naturalHeight * bg.naturalWidth);	

	for(i = 0; i < this.coords.length;){
		Reveal.CONFIG.persistence < Date.now() - this.coords[i].t ? this.coords.length = i : i++;
	}
	
	ctxBlur.clearRect(0, 0, canvasBlur.width, canvasBlur.height);
	
	for(i = 1; i < this.coords.length; i++) {
		ctxBlur.strokeStyle = "rgba(0,0,0," + Math.max(1-(Date.now() - this.coords[i].t)/Reveal.CONFIG.persistence, 0) + ")";
		ctxBlur.lineWidth = 90;
		ctxBlur.beginPath();
		ctxBlur.moveTo(this.coords[i-1].x, this.coords[i-1].y);
        ctxBlur.lineTo(this.coords[i].x, this.coords[i].y);
		ctxBlur.stroke();
	}
	
	ctx.drawImage(bg, 0, 0, imageX, imageY);
	ctx.globalCompositeOperation = "destination-in";
	ctx.drawImage(canvasBlur, 0, 0);
	ctx.globalCompositeOperation = "source-over";
}

// REVEAL DATA-API
// =================
var elements = document.getElementsByClassName('canvas-background');
for(var i = 0; i < elements.length; i++){
	new Reveal(elements[i], elements[i].dataset);
}