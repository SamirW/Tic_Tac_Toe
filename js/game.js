//Event modes
var play = 0;
var playerTurn = 1;
var hotspots = [[0.05520833333, 0.444791667, 0.78148148148, 0.92407407407], [0.48643256185155626, 0.6412609736632083, 0.07234042553191489, 0.3432624113475177, 0], [0.6428571428571429, 0.809656823623304, 0.07375886524822695, 0.3446808510638298, 0], [0.8112529928172386, 0.9652833200319234, 0.07375886524822695, 0.3404255319148936, 0], [0.48643256185155626, 0.6412609736632083, 0.34609929078014184, 0.6468085106382979, 0], [0.6444533120510774, 0.809656823623304, 0.34609929078014184, 0.6468085106382979, 0], [0.809656823623304, 0.9652833200319234, 0.34609929078014184, 0.6468085106382979, 0], [0.48643256185155626, 0.6420590582601756, 0.649645390070922, 0.9219858156028369, 0], [0.6420590582601756, 0.8104549082202713, 0.649645390070922, 0.9219858156028369, 0], [0.8104549082202713, 0.9644852354349561, 0.649645390070922, 0.9219858156028369, 0]]
var boxElements = [];
var canvasElements = [];
var playValue = [0,0,0,0,0,0,0,0,0];


//Create canvas

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var container = document.getElementById('container');

//Resize the screen to match resolution

function resizeGame() {
    var aspectRatio = 16 / 9;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newAspectRatio = newWidth / newHeight;
    
    if (newAspectRatio > aspectRatio) {
        newWidth = newHeight * aspectRatio;
        container.style.height = newHeight + 'px';
        container.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / aspectRatio;
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
    }
    
    container.style.marginTop = (-newHeight / 2) + 'px';
    container.style.marginLeft = (-newWidth / 2) + 'px';
    
    canvas.width = newWidth;
    canvas.height = newHeight;
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

resizeGame();

//Load images

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = "images/bg.png";
bgImage.style.height = canvas.height;
bgImage.style.width = canvas.width;

var playersReady = false;
var playersImage = new Image();
playersImage.onload = function() {
	playersReady = true;
};
playersImage.src = "images/noPlayers.png";
playersImage.style.height = canvas.height;
playersImage.style.weight = canvas.weight;

var imagesReady = false;
window.onload = function() {
	for (b=1; b<10; b++) {
		var box = "box" + b;
		var boxElement = document.getElementById(box);
		var canvasElement = boxElement.getContext("2d");
		boxElements.push(boxElement);
		canvasElements.push(canvasElement);

		boxElement.addEventListener("click", mouseClickEvent, false);
	};
	imagesReady = true;
};

//Alert for click

canvas.addEventListener("click", mouseClickEvent, false);


function mouseClickEvent(e) {
	var pos = convertClick(e);
	// alert(pos.x + " " + pos.y);
	if (play == 1) {
		for (i=1; i<10; i++) {
			if (pos.x > hotspots[i][0] && pos.x < hotspots[i][1] && pos.y > hotspots[i][2] && pos.y < hotspots[i][3]) {
				assignImage(i);
			};
		};
	};

	if (pos.x > hotspots[0][0] && pos.x < hotspots[0][1] && pos.y > hotspots[0][2] && pos.y < hotspots[0][3]) {
		console.log("click");
		if (play == 0) {
			bgImage.src = "images/bgPlayGame.png";
			playersImage.src = "images/player1.png";
			play = 1;
		} else {
			bgImage.src = "images/bg.png";
			playersImage.src = "images/noPlayers.png";
			reset()
			play = 0;
			playerTurn = 1;
		};
	};
	checkWin();
}

//Assign image

function assignImage(newImage) {
	var s = newImage - 1;
	if (playValue[s] == 0) {
		if (playerTurn == 1) {
			playValue[s] = "x";
			playersImage.src = "images/player2.png";
			playerTurn = 2;
		} else {
			playValue[s] = "o";
			playersImage.src = "images/player1.png";
			playerTurn = 1;
		};
	}
}

//Get click location

function convertClick(e) {
	var xPos = 0;
	var yPos = 0;
	var leftMargin = (window.innerWidth - canvas.width)/2;
	var topMargin = (window.innerHeight - canvas.height)/2;

	xPos = (e.clientX - leftMargin) / (canvas.width);
	yPos = (e.clientY - topMargin) / (canvas.height);
	return { x: xPos, y: yPos }
}

//Convert back to pixels

function convertPixels(x, y) {
	var xPos = 0;
	var yPos = 0;
	var leftMargin = (window.innerWidth - canvas.width)/2;
	var topMargin = (window.innerHeight - canvas.height)/2;

	xPos = (x * canvas.width) + leftMargin;
	yPos = (y * canvas.height) + topMargin;
	return { x: xPos, y: yPos }
}

//Draw everything onto canvas

function render() {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	};
	if (playersReady) {
		ctx.drawImage(playersImage, 0, 0, canvas.width, canvas.height);
	};

	if (imagesReady) {
		for (i=0;i<canvasElements.length;i++) {
			var boxElement = boxElements[i];
			var finalBoxImage = new Image();

			finalBoxImage.style.height = boxElement.height;
			finalBoxImage.style.width = boxElement.width;
			finalBoxImage.src = "images/empty.png";

			if (playValue[i] == 0) {
				canvasElements[i].drawImage(finalBoxImage, 0, 0, boxElements[i].width, boxElements[i].height);
			} else if (playValue[i] == "x") {
				finalBoxImage.src = "images/x.png"
				canvasElements[i].drawImage(finalBoxImage, 0, 0, boxElements[i].width, boxElements[i].height);
			} else if (playValue[i] == "o") {
				finalBoxImage.src = "images/o.png";
				canvasElements[i].drawImage(finalBoxImage, 0, 0, boxElements[i].width, boxElements[i].height);
			}
		};
	};
}

function checkWin() {
	console.log(playValue);
	if (playValue[0] == playValue[1] && playValue[0] == playValue[2] && playValue[0] != 0 ||
		playValue[0] == playValue[3] && playValue[0] == playValue[6] && playValue[0] != 0 ||
		playValue[0] == playValue[4] && playValue[0] == playValue[8] && playValue[0] != 0 ||
		playValue[1] == playValue[4] && playValue[1] == playValue[7] && playValue[1] != 0 ||
		playValue[2] == playValue[5] && playValue[2] == playValue[8] && playValue[2] != 0 ||
		playValue[2] == playValue[4] && playValue[2] == playValue[6] && playValue[2] != 0 ||
		playValue[3] == playValue[4] && playValue[3] == playValue[5] && playValue[3] != 0 ||
		playValue[6] == playValue[7] && playValue[6] == playValue[8] && playValue[6] != 0) {
		winGame();
	} else if (playValue.indexOf(0) == -1) {
		drawGame();
	}
}

function winGame() {
	if (playerTurn == 1) {
		playersImage.src = "images/win2.png"
	} else {
		playersImage.src = "images/win1.png"
	}
	play = 2;
}

function drawGame() {
	playersImage.src = "images/drawGame.png"
	play = 2;
}

function main() {
	render();

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

function reset() {
	location.reload();
}

//Cross-browser support for requestAnimationFrame

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


//Run Game

main();













