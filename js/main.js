window.onload = function() {
  canvas = document.getElementById("pacman_canvas");
  canvasContext = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  setInterval(pacmanGame, 1000/16.67);
}

// Pacman position.
px = 25;
py = 25;

// Pacman direction. 0 -> none, 1 -> up, 2 -> right, 3 -> down, 4 -> left.
direction = 0;

// Pacman size.
pacmanSize = 30;
halfSize = 15;

// Position interval.
positionInterval = 10;

// Initialize walls.
walls = [
  [[0, 0], 600, 10],
  [[590, 0], 10, 600],
  [[0, 590], 600, 10],
  [[0, 0], 10, 600],
  [[0, 0], 10, 600],
  [[40, 0], 10, 300],
  [[40, 330], 300, 10],
  [[300, 0], 10, 300],
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
      py = py + positionInterval;
      break;
    case 2:
      px = px + positionInterval;
      break;
    case 3:
      py = py - positionInterval;
      break;
    case 4:
      px = px - positionInterval;
      break;
  }

  // Set pacman position.
  canvasContext.fillStyle = "yellow";
  canvasContext.fillRect(px - halfSize, py - halfSize, pacmanSize, pacmanSize);

  // Create walls.
  createWalls();

  // Detect wall collision.
  detectWallCollision();
}

// Create walls.
function createWalls() {
  if (wallContexts.length == 0) {
    for (var i = 0; i < walls.length; i++) {
      var canvasWall = document.createElement("canvas"),
      wallContext = canvasWall.getContext("2d");
      canvasWall.width = canvasWall.height = 600;

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

// Detect wall collision and stop pacman.
function detectWallCollision() {
  for (var i = 0; i < wallContexts.length; i++) {
    // Get if pacman is in path.
    if (direction != 0) {

      // Check different points based on direction.
      switch(direction) {
        case 1:
          if (wallContexts[i].isPointInPath(px + halfSize - 1, py + halfSize)
            || wallContexts[i].isPointInPath(px, py + halfSize)
            || wallContexts[i].isPointInPath(px - halfSize - 1, py + halfSize)) {
              direction = 0;
          }
          break;
        case 2:
          if (wallContexts[i].isPointInPath(px + halfSize, py)
            || wallContexts[i].isPointInPath(px + halfSize, py + halfSize - 1)
            || wallContexts[i].isPointInPath(px + halfSize, py - halfSize + 1)) {
              direction = 0;
          }
          break;
        case 3:
          if (wallContexts[i].isPointInPath(px, py - halfSize)
            || wallContexts[i].isPointInPath(px - halfSize + 1, py - halfSize)
            || wallContexts[i].isPointInPath(px + halfSize - 1, py - halfSize)) {
              direction = 0;
          }
          break;
        case 4:
          if (wallContexts[i].isPointInPath(px - halfSize, py - halfSize)
            || wallContexts[i].isPointInPath(px - halfSize, py)
            || wallContexts[i].isPointInPath(px - halfSize, py + halfSize)) {
              direction = 0;
          }
          break;
      }

      // Substruct based on direction to return to previous position.
      // switch(direction) {
      //   case 1:
      //     py = py - positionInterval;
      //     break;
      //   case 2:
      //     px = px - positionInterval;
      //     break;
      //   case 3:
      //     py = py + positionInterval;
      //     break;
      //   case 4:
      //     px = px + positionInterval;
      //     break;
      // }
    }
  }
}

// Change direction based on keystroke.
function keyPush(evt) {
  switch(evt.keyCode) {
    case 40:
      direction = 1;
      break;
    case 39:
      direction = 2;
      break;
    case 38:
      direction = 3;
      break;
    case 37:
      direction = 4;
      break;
  }
}
