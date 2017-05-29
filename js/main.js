window.onload = function() {
  canvas = document.getElementById("pacman_canvas");
  canvasContext = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  setInterval(pacmanGame, 1000/16.67);
}

// Pacman position.
let px = 10;
let py = 10;

// Pacman direction. 0 -> none, 1 -> up, 2 -> right, 3 -> down, 4 -> left.
let direction = 0;

// Pacman size.
const objectSize = 30;

// Position interval.
const positionInterval = 10;

// Pills. Array of x, y, type. type: 1 -> blue pill, 0 -> normal pill.
let pills = [];

// Pill distance.
const pillDistance = 40;

// Pill size.
const pillSize = 4;

// Rendered pill.
let canvasPill = document.createElement("canvas"),
pillContext = canvasPill.getContext("2d");
canvasPill.width = canvasPill.height = pillSize;
pillContext.fillStyle = 'yellow';
pillContext.fillRect(0, 0, pillSize, pillSize);
pillContext.stroke();

// Blue pill.
let canvasBluePill = document.createElement("canvas"),
pillBlueContext = canvasBluePill.getContext("2d");
canvasBluePill.width = canvasBluePill.height = pillSize * 2;
pillBlueContext.fillStyle = 'blue';
pillBlueContext.fillRect(0, 0, pillSize * 2, pillSize * 2);
pillBlueContext.stroke();

// True if the blue pill is active.
let bluePillIsActive = false;

// Ghosts position.
let ghostsPosition = [
  {x: 10 + pillDistance * 6, y: 10 + pillDistance * 6},
  {x: 10 + pillDistance * 7, y: 10 + pillDistance * 6},
  {x: 10 + pillDistance * 8, y: 10 + pillDistance * 6},
];

// Wall that ghosts can pass through. [x, y], width, height.
let canvasGhostGate = document.createElement("canvas"),
ghostGateContext = canvasGhostGate.getContext("2d");
canvasGhostGate.width = 10 + pillDistance;
canvasGhostGate.height = 2;
ghostGateContext.fillStyle = 'yellow';
ghostGateContext.fillRect(0, 0, 10 + pillDistance, 2);
ghostGateContext.stroke();

// Helper constant for ghosts to get out.
const ghostGate = [[pillDistance * 7, pillDistance * 6], 10 + pillDistance, 2];

// Initialize walls.
const walls = [
  // Outer walls.
  [[0, 0], 570, 10],
  [[560, 0], 10, 570],
  [[0, 560], 570, 10],
  [[0, 0], 10, 570],
  [[0, 0], 10, 570],
  // Ghost wall.
  [[pillDistance * 6, pillDistance * 6], 10 + pillDistance * 3, 10 + pillDistance],
  // Other walls.
  [[40, 0], 10, 10 + pillDistance * 7],
  [[40, pillDistance * 3], 10 + pillDistance * 5, 10],
  [[pillDistance * 8, 0], 10, 10 + pillDistance * 5],
];

// Rendered walls.
wallContexts = [];

function pacmanGame() {
  // Set background.
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Set movement based on direction.
  switch(direction) {
    case 1:
      py = py - positionInterval;
      break;
    case 2:
      px = px + positionInterval;
      break;
    case 3:
      py = py + positionInterval;
      break;
    case 4:
      px = px - positionInterval;
      break;
  }

  // Set pacman position.
  canvasContext.fillStyle = "yellow";
  canvasContext.fillRect(px, py, objectSize, objectSize);

  // Create walls.
  createWalls();

  // Create pills.
  createPills();

  // Detect wall collision.
  detectWallCollision();

  // Detect pill collision.
  detectPillCollision();

  // Create ghosts.
  createGhosts();
}

// Create walls.
function createWalls() {
  if (wallContexts.length == 0) {
    for (var i = 0; i < walls.length; i++) {
      var canvasWall = document.createElement("canvas"),
      wallContext = canvasWall.getContext("2d");
      canvasWall.width = canvasWall.height = 580;

      // Get line.
      x = walls[i][0][0];
      y = walls[i][0][1];
      width = walls[i][1];
      height = walls[i][2];

      wallContext.strokeStyle = '#0000FF';
      wallContext.rect(x, y, width, height);
      wallContext.stroke();

      wallContexts.push(wallContext);
    }
  }
  else {
    for (var i = 0; i < wallContexts.length; i++) {
      canvasContext.drawImage(wallContexts[i].canvas, 0, 0);
    }

    // Create ghost gate.
    canvasContext.drawImage(ghostGateContext.canvas, ghostGate[0][0], ghostGate[0][1]);
  }
}

// Create pills.
function createPills() {
  // Initialize.
  if (pills.length == 0) {
    // Get all x,y values.
    for (var x = 23; x <= 590; x = x + pillDistance) {
      for (var y = 23; y <= 590; y = y + pillDistance) {

        // Create pills everywhere at the begining.

        // Randomly generate blue pill.
        if (Math.floor((Math.random() * 100) + 1) > 94) {
          var pill = [x - 3, y - 3, 1];
        }
        else {
          var pill = [x, y, 0];
        }

        pills.push(pill);
      }
    }

    // Remove pills based on collision with walls.
    for (var i = 0; i < pills.length; i++) {
      for (var w = 0; w < walls.length; w++) {
        if (pills[i][0] < walls[w][0][0] + walls[w][1] &&
          pills[i][0] + pillSize > walls[w][0][0] &&
          pills[i][1] < walls[w][0][1] + walls[w][2] &&
          pillSize + pills[i][1] > walls[w][0][1]) {

          // Set to -1000 to keep length and remove from viewport.
          pills[i][0] = -1000;
        }
      }
    }
  }
  else {
    for (var i = 0; i < pills.length; i++) {
      if (pills[i][2] == 1) {
        canvasContext.drawImage(pillBlueContext.canvas, pills[i][0], pills[i][1]);
      }
      else {
        canvasContext.drawImage(pillContext.canvas, pills[i][0], pills[i][1]);
      }
    }
  }
}

// Detect wall collision and stop pacman.
function detectWallCollision() {
  for (var i = 0; i < wallContexts.length; i++) {
    // Get if pacman is in path.
    if (direction != 0) {

      // Collision detection.
      // rect1.x < rect2.x + rect2.w &&
      // rect1.x + rect1.w > rect2.x &&
      // rect1.y < rect2.y + rect2.h &&
      // rect1.h + rect1.y > rect2.y
      if (px < walls[i][0][0] + walls[i][1] &&
         px + objectSize > walls[i][0][0] &&
         py < walls[i][0][1] + walls[i][2] &&
         objectSize + py > walls[i][0][1]) {

           // Substruct based on direction to return to previous position.
           switch(direction) {
             case 1:
               py = py + positionInterval;
               break;
             case 2:
               px = px - positionInterval;
               break;
             case 3:
               py = py - positionInterval;
               break;
             case 4:
               px = px + positionInterval;
               break;
           }

           direction = 0;
      }
    }
  }
}

// Detect pill collision.
function detectPillCollision() {

  for (var i = 0; i < pills.length; i++) {
    if (px < pills[i][0] + pillSize &&
      px + objectSize > pills[i][0] &&
      py < pills[i][1] + pillSize &&
      objectSize + py > pills[i][1]) {

      // Set to -1000 to keep length and remove from viewport.
      pills[i][0] = -1000;

      // If it is blue pill set chase mode on.
      if (pills[i][2] == 1) {
        bluePillIsActive = true;
        setTimeout(function(){ bluePillIsActive = false; },
          Math.floor((Math.random() * 3000) + 3000));
      }
    }
  }
}

// Create ghosts.
function createGhosts() {
  // Set ghosts position.
  setGhostsPosition();

  // Render ghost gate.

  // Render ghosts.
  canvasContext.fillStyle = "blue";
  canvasContext.fillRect(ghostsPosition[0].x, ghostsPosition[0].y, 30, 30);
  canvasContext.fillRect(ghostsPosition[1].x, ghostsPosition[1].y, 30, 30);
  canvasContext.fillRect(ghostsPosition[2].x, ghostsPosition[2].y, 30, 30);
}

// Set ghosts potition.
function setGhostsPosition() {

}

// Change direction based on keystroke.
function keyPush(evt) {
  switch(evt.keyCode) {
    case 38:
      direction = 1;
      break;
    case 39:
      direction = 2;
      break;
    case 40:
      direction = 3;
      break;
    case 37:
      direction = 4;
      break;
  }
}
