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
];

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
  canvasContext.fillRect(px - 15, py - 15, pacmanSize, pacmanSize);

  // Create walls.
  createWalls();

  // Detect wall collision.
  detectWallCollision();
}

// Create walls.
function createWalls() {
  for (var i = 0; i < walls.length; i++) {

    // Get line.
    x = walls[i][0][0];
    y = walls[i][0][1];
    width = walls[i][1];
    height = walls[i][2];

    // canvasContext.beginPath();
    // canvasContext.moveTo(x0, y0);
    // canvasContext.lineTo(x1, y1);
    // canvasContext.lineWidth = 10;
    // canvasContext.strokeStyle = '#0000FF';
    // canvasContext.stroke();

    // canvasContext.fillStyle = "blue";
    canvasContext.strokeStyle = '#0000FF';
    canvasContext.rect(x, y, width, height);
    canvasContext.stroke();

    // Get if pacman is in path.
    if (canvasContext.isPointInPath(px, py)) {
      // Substruct based on direction to return to previous position.
      switch(direction) {
        case 1:
          py = py - 2 * positionInterval;
          break;
        case 2:
          px = px - 2 * positionInterval;
          break;
        case 3:
          py = py + 2 * positionInterval;
          break;
        case 4:
          px = px + 2 * positionInterval;
          break;
      }

      // Stop movement.
      direction = 0;
    }
  }
}

// Detect wall collision and stop pacman.
function detectWallCollision() {
  for (var i = 0; i < walls.length; i++) {


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
