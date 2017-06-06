/**
 @todo,
 - Animation.
 - Sprite y positions: 0, 95, 191, 292, 396, 498.
 */
let gameLoop;
window.onload = function() {
  canvas = document.getElementById("pacman_canvas");
  canvasContext = canvas.getContext("2d");

  window.addEventListener(
    "keydown",
    function(e) {
      keyState[e.keyCode || e.which] = true;
    },
    true
  );
  window.addEventListener(
    "keyup",
    function(e) {
      keyState[e.keyCode || e.which] = false;
    },
    true
  );

  gameLoop = setInterval(pacmanGame, 1000 / 16.67);
};

// Pacman and ghost size.
const objectSize = 30;

// Key being pressed.
let keyState = {};

// Pacman position.
let px = 10;
let py = 10;

// Pacman direction. 0 -> none, 1 -> up, 2 -> right, 3 -> down, 4 -> left.
let direction = 0;

// Position interval.
const positionInterval = 10;

// Pills. Array of x, y, type. type: 1 -> blue pill, 0 -> normal pill.
let pills = [];

// Helper variable for win condition.
let pillCount = 0;

// Pill distance.
const pillDistance = 40;

// Pill size.
const pillSize = 4;

// Rendered pill.
let canvasPill = document.createElement("canvas"),
  pillContext = canvasPill.getContext("2d");
canvasPill.width = canvasPill.height = pillSize;
pillContext.arc(
  pillSize / 2,
  pillSize / 2,
  pillSize / 2,
  0,
  2 * Math.PI,
  false
);
pillContext.fillStyle = "yellow";
pillContext.fill();

// Blue pill.
let canvasBluePill = document.createElement("canvas"),
  pillBlueContext = canvasBluePill.getContext("2d");
canvasBluePill.width = canvasBluePill.height = pillSize * 2;
pillBlueContext.arc(pillSize, pillSize, pillSize, 0, 2 * Math.PI, false);
pillBlueContext.fillStyle = "yellow";
pillBlueContext.fill();

// True if the blue pill is active.
let bluePillIsActive = false;

// Ghosts position. x, y, direction, color.
// lastCollisions is an array with x, y, direction. It keeps the last 100.
let ghosts = [
  {
    x: 10 + pillDistance * 6,
    y: 10 + pillDistance * 6,
    direction: 4,
    color: "cyan",
    active: true,
    lastMoves: []
  },
  {
    x: 10 + pillDistance * 7,
    y: 10 + pillDistance * 6,
    direction: 1,
    color: "red",
    active: true,
    lastMoves: []
  },
  {
    x: 10 + pillDistance * 8,
    y: 10 + pillDistance * 6,
    direction: 2,
    color: "pink",
    active: true,
    lastMoves: []
  }
];

// Load image sprite and preload.
let imageObj = new Image();
imageObj.src = "images/sprite.png";

// Initialize walls.
const walls = window.walls(pillDistance);

// Initial value to create walls only once.
let wallsCreated = false;

// Wall canvas.
var canvasWall = document.createElement("canvas"),
  wallContext = canvasWall.getContext("2d");
canvasWall.width = canvasWall.height = 580;
wallContext.strokeStyle = "#0000FF";

function pacmanGame() {
  // Set background.
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Create walls.
  createWalls();

  // Create pills.
  createPills();

  // Get key and change direction.
  setDirection();

  // Render pacman.
  renderPacman();

  // Detect wall collision.
  detectPacmanWallCollision();

  // Detect pill collision.
  detectPillCollision();

  // Create ghosts.
  createGhosts();

  // Detect ghost collision with pacman.
  detectGhostPacmanCollision();
}

// Create walls.
function createWalls() {
  if (wallsCreated == false) {
    for (var i = 0; i < walls.length; i++) {
      // Get line.
      x = walls[i][0][0];
      y = walls[i][0][1];
      width = walls[i][1];
      height = walls[i][2];

      wallContext.fillStyle = "blue";
      wallContext.fillRect(x, y, width, height);
      wallContext.stroke();
    }
    wallsCreated = true;
  } else {
    canvasContext.drawImage(wallContext.canvas, 0, 0);
  }
}

// Create pills.
function createPills() {
  // Initialize.
  if (pills.length == 0) {
    // Get all x,y values.
    for (var x = 23; x <= 570; x = x + pillDistance) {
      for (var y = 23; y <= 570; y = y + pillDistance) {
        // Randomly generate blue pill.
        if (Math.floor(Math.random() * 100 + 1) > 94) {
          var pill = [x - 3, y - 3, 1];
        } else {
          var pill = [x, y, 0];
        }

        pills.push(pill);
      }
    }

    // Remove pills based on collision with walls.
    for (var i = 0; i < pills.length; i++) {
      for (var w = 0; w < walls.length; w++) {
        if (
          detectObjectsCollision(
            pills[i][0],
            pills[i][1],
            pillSize,
            pillSize,
            walls[w][0][0],
            walls[w][0][1],
            walls[w][1],
            walls[w][2]
          )
        ) {
          // Set to -1000 to keep length and remove from viewport.
          pills[i][0] = -1000;
        }
      }
    }
  } else {
    for (var i = 0; i < pills.length; i++) {
      if (pills[i][2] == 1) {
        canvasContext.drawImage(
          pillBlueContext.canvas,
          pills[i][0],
          pills[i][1]
        );
      } else {
        canvasContext.drawImage(pillContext.canvas, pills[i][0], pills[i][1]);
      }
    }
  }
}

function setDirection() {
  // Change direction based on keystate.
  if (keyState[38]) {
    if (detectObjectWallCollision(px, py - positionInterval) == false) {
      direction = 1;
    }
  } else if (keyState[39]) {
    if (detectObjectWallCollision(px + positionInterval, py) == false) {
      direction = 2;
    }
  } else if (keyState[40]) {
    if (detectObjectWallCollision(px, py + positionInterval) == false) {
      direction = 3;
    }
  } else if (keyState[37]) {
    if (detectObjectWallCollision(px - positionInterval, py) == false) {
      direction = 4;
    }
  }

  if (direction != 0) {
    // Set movement based on direction.
    switch (direction) {
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
  }
}

// Render pacman.
function renderPacman() {
  // Pacman canvas.
  let canvasPacman = document.createElement("canvas"),
    pacmanContext = canvasPacman.getContext("2d");
  canvasPacman.width = canvasPacman.height = objectSize;

  // Rotate based on direction.
  switch (direction) {
    case 1:
      pacmanContext.translate(0, 30);
      pacmanContext.rotate(-90 * Math.PI / 180);
      break;
    case 3:
      pacmanContext.translate(30, 0);
      pacmanContext.rotate(90 * Math.PI / 180);
      break;
    case 4:
      pacmanContext.translate(30, 30);
      pacmanContext.rotate(Math.PI);
      break;
  }

  // Get image of pacman to interchange between 30px intervals.
  clip = (px + py) % 30 == 10 ? 0 : 95;
  pacmanContext.drawImage(imageObj, 0, clip, 100, 96, 0, 0, 30, 30);

  canvasContext.drawImage(pacmanContext.canvas, px, py);
}

// Detect wall collision and stop pacman.
function detectPacmanWallCollision() {
  if (detectWallCollisionOnDirection(px, py, direction)) {
    direction = 0;
  }
}

// Detect pill collision.
function detectPillCollision() {
  for (var i = 0; i < pills.length; i++) {
    if (
      detectObjectsCollision(
        px,
        py,
        objectSize,
        objectSize,
        pills[i][0],
        pills[i][1],
        pillSize,
        pillSize
      )
    ) {
      // Set to -1000 to keep length and remove from viewport.
      pills[i][0] = -1000;
      pillCount++;

      // If it is blue pill set chase mode on.
      if (pills[i][2] == 1) {
        bluePillIsActive = true;
        setTimeout(function() {
          bluePillIsActive = false;
        }, Math.floor(Math.random() * 4000 + 3000));
      }
    }
  }

  // Check win criteria.
  allPillsAreGone = true;
  for (var i = 0; i < pills.length; i++) {
    if (pills[i][0] != -1000) {
      allPillsAreGone = false;
      break;
    }
  }
  if (allPillsAreGone) {
    canvasContext.font = "50px Arial";
    canvasContext.fillStyle = "red";
    canvasContext.fillText("You are awesome!", 65, 270);
    clearInterval(gameLoop);
  }
}

// Create ghosts.
function createGhosts() {
  // Set ghosts position.
  setGhosts();

  // Render ghosts.
  ghosts.forEach(ghost => {
    if (ghost.active) {
      let canvasGhost = document.createElement("canvas"),
        ghostContext = canvasGhost.getContext("2d");
      canvasGhost.width = canvasGhost.height = objectSize;

      if (bluePillIsActive) {
        ghostContext.drawImage(imageObj, 0, 498, 100, 100, 0, 0, 30, 30);
        canvasContext.drawImage(ghostContext.canvas, ghost.x, ghost.y);
      } else {
        // Get image of ghost from sprite.
        let clip = 0;
        switch (ghost.color) {
          case "pink":
            clip = 191;
            break;
          case "red":
            clip = 292;
            break;
          case "cyan":
            clip = 396;
            break;
        }
        ghostContext.drawImage(imageObj, 0, clip, 100, 100, 0, 0, 30, 30);
        canvasContext.drawImage(ghostContext.canvas, ghost.x, ghost.y);
      }
    }
  });
}

// Detect ghosts collision with Pacman.
function detectGhostPacmanCollision() {
  // If ghosts are not blue, the game is lost and it resets, if ghosts are blue,
  // the ghost is set inactive for some seconds.
  ghosts.forEach(ghost => {
    if (
      detectObjectsCollision(
        px,
        py,
        objectSize,
        objectSize,
        ghost.x,
        ghost.y,
        objectSize,
        objectSize
      )
    ) {
      if (bluePillIsActive) {
        // Disable ghost.
        ghost.active = false;
        ghost.x = 10 + pillDistance * 7;
        ghost.y = 10 + pillDistance * 6;
        setTimeout(function() {
          ghost.active = true;
        }, 6000);
      } else {
        canvasContext.font = "100px Arial";
        canvasContext.fillStyle = "red";
        canvasContext.fillText("You suck!", 70, 270);
        clearInterval(gameLoop);
      }
    }
  });
}

/**
 * Calculate ghost next direction.
 */
function setGhosts() {
  // "pseudo-AI"
  ghosts.forEach(ghost => {
    if (ghost.active) {
      if (!detectWallCollisionOnDirection(ghost.x, ghost.y, ghost.direction)) {
        switch (ghost.direction) {
          case 1:
            ghost.y -= positionInterval;
            break;
          case 2:
            ghost.x += positionInterval;
            break;
          case 3:
            ghost.y += positionInterval;
            break;
          case 4:
            ghost.x -= positionInterval;
            break;
        }
      } else {
        ghost.direction = calculateNextDirectionBasedOnPacmanPosition(ghost);
      }
    }
  });
}

/**
 * Calculate next direction for a ghost based on Pacman current position.
 *
 * @param ghost
 *  Ghost object.
 */
function calculateNextDirectionBasedOnPacmanPosition(ghost) {
  const dx = px - ghost.x;
  const dy = py - ghost.y;

  // The preferred axis will be x if true, y if false.
  preferredAxis = Math.abs(dx) >= Math.abs(dy);

  // Create an order of choices array. The first value is the choice based on
  // preferred axis and distance and the second is the direction, the ghost,
  // should choose.
  let choices = [
    [!preferredAxis && dx == 0, 1],
    [preferredAxis && dy == 0, 2],
    [!preferredAxis && dx == 0, 3],
    [preferredAxis && dy == 0, 4],
    [!preferredAxis && dy <= 0, 1],
    [preferredAxis && dx >= 0, 2],
    [!preferredAxis && dy >= 0, 3],
    [preferredAxis && dx <= 0, 4],
    [preferredAxis && dy <= 0, 1],
    [!preferredAxis && dx >= 0, 2],
    [preferredAxis && dy >= 0, 3],
    [preferredAxis && dx <= 0, 4]
  ];

  // Reverse array of choices if blue pill is active.
  choices = bluePillIsActive ? choices.reverse() : choices;

  for (var i = 0; i < choices.length; i++) {
    if (
      choices[i][0] &&
      !detectWallCollisionOnDirection(ghost.x, ghost.y, choices[i][1])
    ) {
      return choices[i][1];
    }
  }

  // If no choice found.
  return Math.floor(Math.random() * 4 + 1);
}

/**
 * Check for collision with walls for an object in its direction.
 *
 * @param x
 *  Object x.
 * @param y
 *  Object y.
 * @param direction
 *  Object direction.
 * @returns {boolean}
 *  Return true if collision exists, else false.
 */
function detectWallCollisionOnDirection(x, y, direction) {
  switch (direction) {
    case 1:
      return detectObjectWallCollision(x, y - positionInterval);
    case 2:
      return detectObjectWallCollision(x + positionInterval, y);
    case 3:
      return detectObjectWallCollision(x, y + positionInterval);
    case 4:
      return detectObjectWallCollision(x - positionInterval, y);
  }
}

/**
 * Detect object collision with walls.
 *
 * @param integer x
 *   x position.
 * @param integer y
 *   y position.
 *
 * @returns boolean
 *   True if there is collision.
 */
function detectObjectWallCollision(x, y) {
  for (var i = 0; i < walls.length; i++) {
    // Collision detection.
    if (
      detectObjectsCollision(
        x,
        y,
        objectSize,
        objectSize,
        walls[i][0][0],
        walls[i][0][1],
        walls[i][1],
        walls[i][2]
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Detect collision between generic objects.
 */
function detectObjectsCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Collision detection.
  // rect1.x < rect2.x + rect2.w &&
  // rect1.x + rect1.w > rect2.x &&
  // rect1.y < rect2.y + rect2.h &&
  // rect1.h + rect1.y > rect2.y
  if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
    return true;
  }

  return false;
}
