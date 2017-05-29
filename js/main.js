window.onload = function() {
  canvas = document.getElementById("pacman_canvas");
  canvasContext = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  setInterval(pacmanGame, 1000/16.67);
}

// Pacman position.
px = 10;
py = 10;

// Pacman direction. 0 -> none, 1 -> up, 2 -> right, 3 -> down, 4 -> left.
direction = 0;

// Pacman size.
pacmanSize = 30;

// Position interval.
positionInterval = 10;

// Pills.
pills = [];

// Pill distance.
pillDistance = 40;

// Pill size.
pillSize = 4;

// Rendered pill.
var canvasPill = document.createElement("canvas"),
pillContext = canvasPill.getContext("2d");
canvasPill.width = canvasPill.height = 5;
pillContext.strokeStyle = 'yellow';
pillContext.rect(0, 0, pillSize, pillSize);
pillContext.stroke();

// Initialize walls.
walls = [
  [[0, 0], 570, 10],
  [[560, 0], 10, 570],
  [[0, 560], 570, 10],
  [[0, 0], 10, 570],
  [[0, 0], 10, 570],
  [[40, 0], 10, 10 + pillDistance * 7],
  [[40, pillDistance * 3], 10 + pillDistance * 5, 10],
  [[pillDistance * 8, 0], 10, 10 + pillDistance * 8],
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
  canvasContext.fillRect(px, py, pacmanSize, pacmanSize);

  // Create walls.
  createWalls();

  // Create pills.
  createPills();

  // Detect wall collision.
  detectWallCollision();

  // Detect pill collision.
  detectPillCollision();
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
  }
}

// Create pills.
function createPills() {
  // Initialize.
  if (pills.length == 0) {
    // Get all x,y values.
    for (var x = 23; x <= 590; x = x + pillDistance) {
      for (var y = 23; y <= 590; y = y + pillDistance) {

        // Create pills where there are no walls.
        for (var i = 0; i < wallContexts.length; i++) {
          if ((x < walls[i][0][0] + walls[i][1] &&
            x + pillSize > walls[i][0][0] &&
            y < walls[i][0][1] + walls[i][2] &&
            pillSize + y > walls[i][0][1]) == false) {

            var pill = [x, y];
            pills.push(pill);
          }
        }
      }
    }
  }
  else {
    for (var i = 0; i < pills.length; i++) {
      canvasContext.drawImage(pillContext.canvas, pills[i][0], pills[i][1]);
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
         px + pacmanSize > walls[i][0][0] &&
         py < walls[i][0][1] + walls[i][2] &&
         pacmanSize + py > walls[i][0][1]) {

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
      px + pacmanSize > pills[i][0] &&
      py < pills[i][1] + pillSize &&
      pacmanSize + py > pills[i][1]) {

      // Set to -1000 to keep length and remove from viewport.
      pills[i][0] = -1000;
    }
  }
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
