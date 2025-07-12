// ─── 1) Make canvasGrid a global (remove `var` inside createCanvasGrid) ───
// “canvasGrid” now lives at the top level so bfs() and the drawing loop can see it.
var canvasGrid = [];
const numRows = 11,
numCols = 11;

function switchClass(el) {
if (el.classList.contains("border")) {
    el.classList.remove("border");
    el.classList.add("walkable");
} else {
    el.classList.remove("walkable");
    el.classList.add("border");
}
}

function createCanvasGrid(alg) {
// 1a) Grab all canvases under #gridContainer
var allCanvases = document.querySelectorAll("#gridContainer canvas");
allCanvases = Array.from(allCanvases);

// 1b) Clear out the old grid
canvasGrid = [];

// 1c) Split into rows of 11 columns each.
for (var r = 0; r < numRows; r++) {
    var rowSlice = allCanvases.slice(r * numCols, r * numCols + numCols);
    canvasGrid.push(rowSlice);
}

// 2) Now run BFS from [0,1] to [4,10] (for example):
if(alg==="bfs"){
    var path = bfs([0, 1], [4, 10]);
    console.log(path)
}

if(alg==="dfs"){
    var path = []
    dfs([0, 1], [4, 10], path);
    console.log(path)
}


if (!path || path==[]) {
    alert("No path found");
    return;
}

// ─── 3) Draw the path ───
// Use “for (of)” so `element` is the actual [r,c] coordinate, not a string index.
for (let element of path) {
    var r = element[0],
    c = element[1];
    // Skip start/end if you like, or color them differently.
    if (
    !canvasGrid[r][c].classList.contains("start") &&
    !canvasGrid[r][c].classList.contains("end")
    ) {
    canvasGrid[r][c].classList.remove("walkable");
    canvasGrid[r][c].classList.add("solution");
    }
}
}

function dfs(node, goal, path) {
const row = node[0],
        col = node[1];

// 1) Check “are we at the goal?” by comparing values, not ===
if (row === goal[0] && col === goal[1]) {
    path.push([row, col]);
    return true;
}

// 2) Bounds‐check: invalid if row<0 or ≥ numRows, same for col
if (
    row < 0 || row >= numRows ||
    col < 0 || col >= numCols
) {
    return false;
}

const cell = canvasGrid[row][col];

// 3) Only proceed if it’s walkable and not already visited
if (
    !cell.classList.contains("walkable") ||
    cell.classList.contains("visited")
) {
    return false;
}

// 4) Mark this as visited so we don’t loop
cell.classList.add("visited");

// 5) Explore neighbors correctly with an array of [dr,dc] pairs
const directions = [
    [-1,  0],  // up
    [ 1,  0],  // down
    [ 0, -1],  // left
    [ 0,  1]   // right
];

for (let [dr, dc] of directions) {
    let nr = row + dr,
        nc = col + dc;

    // 6) Recurse and ALWAYS pass (childNode, goal, path)
    if (dfs([nr, nc], goal, path)) {
    // If that recursive call found the goal, we are on the path too
    path.push([row, col]);
    return true;
    }
}

// 7) If none of the neighbors led to the goal, backtrack:
return false;
}






function bfs(start_node, goal_node) {
// Queue holds [ [r,c], pathSoFarArray ]
var queue = [];
var visited = [];

// 1) Enqueue the start WITH its path = [ start_node ]
queue.push([start_node, [start_node.slice()]]);
visited.push(start_node[0] + "," + start_node[1]);

while (queue.length > 0) {
    // 2) Dequeue an item
    var item = queue.shift();
    var node = item[0]; // [r,c]
    var path = item[1]; // array of coords from start → node
    var r = node[0],
    c = node[1];

    // 3) If this is the goal, return the path right away
    if (r === goal_node[0] && c === goal_node[1]) {
    return path;
    }

    // 4) Otherwise, explore neighbors
    var neighbors = [
    [r, c + 1],
    [r, c - 1],
    [r - 1, c],
    [r + 1, c],
    ];
    for (var i = 0; i < neighbors.length; i++) {
    var nr = neighbors[i][0],
        nc = neighbors[i][1];

    // 4a) bounds‐check
    if (nr < 0 || nr > 10 || nc < 0 || nc > 10) continue;

    // 4b) must be “walkable” or it can be the goal cell
    var cell = canvasGrid[nr][nc];
    if (
        !cell.classList.contains("walkable") &&
        !(nr === goal_node[0] && nc === goal_node[1])
    ) {
        continue;
    }

    var nKey = nr + "," + nc;
    if (visited.indexOf(nKey) === -1) {
        visited.push(nKey);
        // 4c) build a new path array ending in [nr,nc]
        var newPath = path.concat([[nr, nc]]);
        queue.push([[nr, nc], newPath]);
    }
    }
}

// If we empty the queue without ever hitting goal:
return null;
}

function resetMaze(){
location.reload()
}

// Build the grid once on page load if you want,
// or leave it until the button is clicked. Either way, it’s global now.
//document.addEventListener("DOMContentLoaded", createCanvasGrid);