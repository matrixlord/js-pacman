window.walls = function(pillDistance) {
  let levelWalls = [
    // Outer walls.
    [[0, 0], 570, 10],
    [[560, 0], 10, 570],
    [[0, 560], 570, 10],
    [[0, 0], 10, 570],
    [[0, 0], 10, 570],

    // Ghost wall.
    // [[pillDistance * 6, pillDistance * 6], 10 + pillDistance * 2, 10],
    [[pillDistance * 6, pillDistance * 7], 10 + pillDistance * 2, 10],

    [[pillDistance * 6, pillDistance * 6], 10, 10 + pillDistance * 1],
    [[pillDistance * 8, pillDistance * 6], 10, 10 + pillDistance],

    // Other walls.

    // Upper-left.
    [[pillDistance * 5, pillDistance], 10, 10 + pillDistance],
    [[pillDistance * 5, pillDistance * 3], 10, 10 + pillDistance * 4],
    [[pillDistance * 4, pillDistance], 10, 10 + pillDistance],
    [[pillDistance * 4, pillDistance * 5], 10, 10 + pillDistance],
    [[pillDistance * 1, pillDistance], 10 + pillDistance * 2, 10],
    [[pillDistance * 1, pillDistance * 2], 10 + pillDistance * 2, 10],
    [[pillDistance * 2, pillDistance * 3], 10 + pillDistance * 3, 10],
    [[pillDistance * 0, pillDistance * 3], 10 + pillDistance, 10],
    [[pillDistance * 3, pillDistance * 4], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 4], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 5], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 6], 10 + pillDistance * 2, 10],
    [[pillDistance * 3, pillDistance * 5], 10 + pillDistance, 10],
    [[pillDistance * 3, pillDistance * 7], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 7], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 8], 10 + pillDistance * 8, 10],

    [[pillDistance * 6, pillDistance * 2], 10 + pillDistance * 2, 10],
    [[pillDistance * 6, pillDistance * 5], 10 + pillDistance * 2, 10],
    [[pillDistance * 6, pillDistance * 3], 10 + pillDistance * 2, 10],
    [[pillDistance * 6, pillDistance * 4], 10 + pillDistance * 2, 10],
    [[pillDistance * 6, pillDistance * 1], 10 + pillDistance * 2, 10],

    // Upper-right.
    [[pillDistance * 9, pillDistance], 10, 10 + pillDistance],
    [[pillDistance * 9, pillDistance * 3], 10, 10 + pillDistance * 4],
    [[pillDistance * 10, pillDistance], 10, 10 + pillDistance],
    [[pillDistance * 10, pillDistance * 5], 10, 10 + pillDistance],
    [[pillDistance * 11, pillDistance], 10 + pillDistance * 2, 10],
    [[pillDistance * 11, pillDistance * 2], 10 + pillDistance * 2, 10],
    [[pillDistance * 9, pillDistance * 3], 10 + pillDistance * 3, 10],
    [[pillDistance * 13, pillDistance * 3], 10 + pillDistance, 10],
    [[pillDistance * 10, pillDistance * 4], 10 + pillDistance, 10],
    [[pillDistance * 12, pillDistance * 4], 10 + pillDistance, 10],
    [[pillDistance * 12, pillDistance * 5], 10 + pillDistance, 10],
    [[pillDistance * 11, pillDistance * 6], 10 + pillDistance * 2, 10],
    [[pillDistance * 10, pillDistance * 5], 10 + pillDistance, 10],
    [[pillDistance * 10, pillDistance * 7], 10 + pillDistance, 10],
    [[pillDistance * 12, pillDistance * 7], 10 + pillDistance, 10],
    [[pillDistance * 9, pillDistance * 8], 10 + pillDistance * 4, 10],

    // Lower left.
    [[pillDistance * 4, pillDistance * 9], 10, 10 + pillDistance * 3],
    [[pillDistance * 4, pillDistance * 13], 10 + pillDistance, 10],
    [[pillDistance * 3, pillDistance * 9], 10, 10 + pillDistance * 2],
    [[pillDistance * 3, pillDistance * 12], 10, 10 + pillDistance],
    [[pillDistance * 1, pillDistance * 9], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 10], 10 + pillDistance, 10],
    [[pillDistance * 1, pillDistance * 11], 10 + pillDistance, 10 + pillDistance],
    [[pillDistance * 1, pillDistance * 13], 10 + pillDistance, 10],
    [[pillDistance * 5, pillDistance * 9], 10 + pillDistance * 4, 10],
    [[pillDistance * 5, pillDistance * 10], 10 + pillDistance * 4, 10],
    [[pillDistance * 5, pillDistance * 11], 10 + pillDistance * 4, 10],
    [[pillDistance * 5, pillDistance * 12], 10 + pillDistance * 4, 10],

    // Lower right.
    [[pillDistance * 10, pillDistance * 9], 10, 10 + pillDistance * 3],
    [[pillDistance * 5, pillDistance * 13], 10 + pillDistance * 5, 10],
    [[pillDistance * 11, pillDistance * 9], 10, 10 + pillDistance * 2],
    [[pillDistance * 11, pillDistance * 12], 10, 10 + pillDistance],
    [[pillDistance * 12, pillDistance * 9], 10 + pillDistance, 10],
    [[pillDistance * 12, pillDistance * 10], 10 + pillDistance, 10],
    [[pillDistance * 12, pillDistance * 11], 10 + pillDistance, 10 + pillDistance],
    [[pillDistance * 12, pillDistance * 13], 10 + pillDistance, 10],
  ];

  // Random thoughts.
  // // Generate all walls.
  // for (var y = 0; y < 14; y++) {
  //   for (var x = 0; x < 8; x++) {
  //     // Top
  //     wall = [[pillDistance * x, pillDistance * y], 10 + pillDistance, 10];
  //     levelWalls.push(wall);
  //
  //     // Right.
  //     wall = [[pillDistance * x + pillDistance, pillDistance * y], 10, 10 + pillDistance];
  //     levelWalls.push(wall);
  //
  //     // Bottom.
  //     wall = [[pillDistance * x, pillDistance * y + pillDistance], 10 + pillDistance, 10];
  //     levelWalls.push(wall);
  //
  //     // Left.
  //     wall = [[pillDistance * x, pillDistance * y], 10, 10 + pillDistance];
  //     levelWalls.push(wall);
  //   }
  // }

  return levelWalls;
}