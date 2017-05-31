/**
 @todo,
 - Ghost collision (blue pill collision) -> done
 - Ghost AI
 - Ghost respawn in the first position
 - Win criteria -> done
 */
let gameLoop;
window.onload = function () {
    canvas = document.getElementById("pacman_canvas");
    canvasContext = canvas.getContext("2d");

    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);
    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);

    gameLoop = setInterval(pacmanGame, 1000 / 16.67);
}

// Key being pressed.
let keyState = {};

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
pillContext.fillStyle = 'yellow';
pillContext.fillRect(0, 0, pillSize, pillSize);
pillContext.stroke();

// Blue pill.
let canvasBluePill = document.createElement("canvas"),
    pillBlueContext = canvasBluePill.getContext("2d");
canvasBluePill.width = canvasBluePill.height = pillSize * 2;
pillBlueContext.fillStyle = 'yellow';
pillBlueContext.fillRect(0, 0, pillSize * 2, pillSize * 2);
pillBlueContext.stroke();

// True if the blue pill is active.
let bluePillIsActive = false;

// Ghosts position. x, y, direction, color.
let ghosts = [
    {x: 10 + pillDistance * 6, y: 10 + pillDistance * 6, direction: 4, color: "green", active: true, lastMoves: []},
    {x: 10 + pillDistance * 7, y: 10 + pillDistance * 6, direction: 1, color: "red", active: true, lastMoves: []},
    {x: 10 + pillDistance * 8, y: 10 + pillDistance * 6, direction: 2, color: "pink", active: true, lastMoves: []},
];

// Initialize walls.
const walls = window.walls(pillDistance);

// Initial value to create walls only once.
let wallsCreated = false;

// Wall canvas.
var canvasWall = document.createElement("canvas"),
    wallContext = canvasWall.getContext("2d");
canvasWall.width = canvasWall.height = 580;
wallContext.strokeStyle = '#0000FF';

function pacmanGame() {

    // Get key and change direction.
    setDirection();

    // Set background.
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

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

    // Detect ghost collision with pacman.
    detectGhostPacmanCollision();
}

function setDirection() {
    // Change direction based on keystate.
    if (keyState[38]) {
        if (detectObjectWallCollision(px, py - positionInterval) == false) {
            direction = 1;
        }
    }
    else if (keyState[39]) {
        if (detectObjectWallCollision(px + positionInterval, py) == false) {
            direction = 2;
        }
    }
    else if (keyState[40]) {
        if (detectObjectWallCollision(px, py + positionInterval) == false) {
            direction = 3;
        }
    }
    else if (keyState[37]) {
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
    }
    else {
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
    // Get if pacman is in path.
    if (direction !== 0) {
        switch (direction) {
            case 1:
                if (detectObjectWallCollision(px, py - positionInterval)) {
                    direction = 0;
                }
                break;
            case 2:
                if (detectObjectWallCollision(px + positionInterval, py)) {
                    direction = 0;
                }
                break;
            case 3:
                if (detectObjectWallCollision(px, py + positionInterval)) {
                    direction = 0;
                }
                break;
            case 4:
                if (detectObjectWallCollision(px - positionInterval, py)) {
                    direction = 0;
                }
                break;
        }
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
        // rect1.x < rect2.x + rect2.w &&
        // rect1.x + rect1.w > rect2.x &&
        // rect1.y < rect2.y + rect2.h &&
        // rect1.h + rect1.y > rect2.y
        if (x < walls[i][0][0] + walls[i][1] &&
            x + objectSize > walls[i][0][0] &&
            y < walls[i][0][1] + walls[i][2] &&
            objectSize + y > walls[i][0][1]) {

            return true;
        }
    }

    return false;
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
            pillCount++;

            // If it is blue pill set chase mode on.
            if (pills[i][2] == 1) {
                bluePillIsActive = true;
                setTimeout(function () {
                        bluePillIsActive = false;
                    },
                    Math.floor((Math.random() * 4000) + 3000));
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
            canvasContext.fillStyle = bluePillIsActive ? "cyan" : ghost.color;
            canvasContext.fillRect(ghost.x, ghost.y, objectSize, objectSize);
        }
    });
}

// Detect ghosts collision with Pacman.
function detectGhostPacmanCollision() {
    // If ghosts are not blue, the game is lost and it resets, if ghosts are blue,
    // the ghost is set inactive for some seconds.
    ghosts.forEach(ghost => {
        if (px < ghost.x + objectSize &&
            px + objectSize > ghost.x &&
            py < ghost.y + objectSize &&
            objectSize + py > ghost.y) {

            if (bluePillIsActive) {
                // Disable ghost.
                ghost.active = false;
                ghost.x = 10 + pillDistance * 7;
                ghost.y = 10 + pillDistance * 6;
                setTimeout(function () {
                    ghost.active = true;
                }, 6000);
            }
            else {
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
 * @todo clean up code. It can be simpler but I'm too sleepy right now.
 */
function setGhosts() {
    // "sudo-AI"
    ghosts.forEach(ghost => {
      if (ghost.active) {
        switch (ghost.direction) {
            case 1:
                if (!detectObjectWallCollision(ghost.x, ghost.y - positionInterval)) {
                    ghost.y -= positionInterval;
                } else {
                    // Find new direction.
                    ghost.direction = calculateNextDirectionBasedOnPacmanPosition(ghost.x, ghost.y, ghost.direction);
                }
                break;
            case 2:
                if (!detectObjectWallCollision(ghost.x + positionInterval, ghost.y)) {
                    ghost.x += positionInterval;
                } else {
                    // Find new direction.
                    ghost.direction = calculateNextDirectionBasedOnPacmanPosition(ghost.x, ghost.y, ghost.direction);
                }
                break;
            case 3:
                if (!detectObjectWallCollision(ghost.x, ghost.y + positionInterval)) {
                    ghost.y += positionInterval;
                } else {
                    // Find new direction.
                    ghost.direction = calculateNextDirectionBasedOnPacmanPosition(ghost.x, ghost.y, ghost.direction);
                }
                break;
            case 4:
                if (!detectObjectWallCollision(ghost.x - positionInterval, ghost.y)) {
                    ghost.x -= positionInterval;
                } else {
                    // Find new direction.
                    ghost.direction = calculateNextDirectionBasedOnPacmanPosition(ghost.x, ghost.y, ghost.direction);
                }
                break;
        }        
      }
    });
}

/**
 * Calculate next direction for a ghost based on Pacman current position.
 *
 * @param gx
 *  Ghost x point.
 * @param gy
 *  Ghost y point.
 */
function calculateNextDirectionBasedOnPacmanPosition(gx, gy) {
    const x = px - gx;
    const y = py - gy;

    // Check x position and if is blocked try x positions.
    if (Math.abs(x) >= Math.abs(y)) {
        let preferredDirection = x >= 0 ? 2 : 4;
        if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
            preferredDirection = x >= 0 ? 4 : 2;
            if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
                preferredDirection = 1;
                if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
                    preferredDirection = 3;
                }
            }
        }
        return preferredDirection;
    }

    // Check y position and if is blocked try x positions.
    if (Math.abs(x) <= Math.abs(y)) {
        let preferredDirection = y >= 0 ? 1 : 3;
        if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
            preferredDirection = y >= 0 ? 3 : 1;
            if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
                preferredDirection = 2;
                if (checkCollisionWithWalls(gx, gy, preferredDirection)) {
                    preferredDirection = 4;
                }
            }
        }
        return preferredDirection;
    }
}

/**
 * Check for collision.
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
function checkCollisionWithWalls(x, y, direction) {
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
