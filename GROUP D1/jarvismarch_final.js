let points = [];
let hull = [];
let index_select_point = -1;
let hullStep = 0;
let isVisualizing = false;
let currvertex;
let nextVertexIndex;
let currentlychecking;
let nextIndex;
let complete = false;
let frameCounter = 0;
let stepDelay = 8;
let lnvindex = -1;
let isbetterc = false;

function setup() {
  createCanvas(1200, 800);
    if (points.length > 2) {
    isVisualizing = true;
    startConvexHull();
  }
}

function draw() {
  background(240);
  drawPoints();
  drawHull();
  frameCounter++;

  if (isVisualizing && !complete) {
    if (frameCounter >= stepDelay) {
      visualizeStep();
      frameCounter = 0;
    }
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  index_select_point = findPoint(mouseX, mouseY);
  if (index_select_point === -1) {
    points.push(createVector(mouseX, mouseY));
    resetVisualization();
  }
}

function mouseDragged() {
  if (index_select_point !== -1) {
    points[index_select_point].set(mouseX, mouseY);
    resetVisualization();
  }
}

function mouseReleased() {
  index_select_point = -1;
}
function keyPressed() {
  if ((keyCode === DELETE || keyCode === BACKSPACE) && index_select_point !== -1) {
    points.splice(index_select_point, 1);
    resetVisualization();
    index_select_point = -1;
  } else if (keyCode === ENTER) {
    if (isVisualizing) {
      visualizeStep();
    } else if (points.length > 2) {
      resetVisualization();
      isVisualizing = true;
      startConvexHull();
    }
  } else if (key === 'r' || key === 'R') {
    for (let i = 0; i < 10; i++) {
      points.push(createVector(random(width), random(height)));
    }
    resetVisualization();
  }
}
function drawPoints() {
  fill('blue');
  stroke(0);
  points.forEach(point => {
    ellipse(point.x, point.y, 10, 10);
  });
}

function drawHull() {
  if (hull.length === 0) return;

  noFill();
  stroke('green');
  beginShape();
  for (let i = 0; i < hull.length; i++) {
    vertex(points[hull[i]].x, points[hull[i]].y);
    if (i === hull.length - 1 && complete) { 
      vertex(points[hull[0]].x, points[hull[0]].y);
    }
  }
  endShape();
}
function resetVisualization() {
  hull = [];
  hullStep = 0;
  isVisualizing = false;
  complete = false;
  currvertex = nextVertexIndex = currentlychecking = nextIndex = undefined;
  if (points.length > 2) {
    isVisualizing = true;
    startConvexHull();
  }
}

function startConvexHull() {
  let leftMostIndex = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x < points[leftMostIndex].x) {
      leftMostIndex = i;
    }
  }
  currvertex = leftMostIndex;
  hull.push(currvertex);
}
function visualizeStep() {
  if (currvertex === undefined || complete) {
    return;
  }

  if (nextVertexIndex === undefined) {
    nextVertexIndex = (currvertex + 1) % points.length;
  }

  if (currentlychecking === undefined) {
    currentlychecking = (nextVertexIndex + 1) % points.length;
  }

  background(240);
  drawPoints();
  drawHull();
  strokeWeight(3);
  stroke(0, 0, 255, 100); 
  line(points[currvertex].x, points[currvertex].y, points[currentlychecking].x, points[currentlychecking].y);
  
  stroke(255, 165, 0);
  line(points[currvertex].x, points[currvertex].y, points[nextVertexIndex].x, points[nextVertexIndex].y);

  
  strokeWeight(1);
  let a = points[currvertex], b = points[nextVertexIndex], c = points[currentlychecking];
  let orientationVal = orientation(a, b, c);

  if (orientationVal == 2) { 
    nextVertexIndex = currentlychecking;

    stroke(255, 0, 0, 100);

    line(points[currvertex].x, points[currvertex].y, points[nextVertexIndex].x, points[nextVertexIndex].y);
  }

  currentlychecking = (currentlychecking + 1) % points.length;

  if (currentlychecking == currvertex) {
    hull.push(nextVertexIndex);
    currvertex = nextVertexIndex;
    nextVertexIndex = undefined; 
    currentlychecking = undefined;
    if (currvertex == hull[0]) {
      complete = true; 
      isVisualizing = false;
    }
  }
}

function calculateDiffX(point1, point2) {
  return point2.x - point1.x;
}

function calculateDiffY(point1, point2) {
  return point2.y - point1.y;
}

function func(p, q, r) {
  let dxQp = calculateDiffX(q, p);
  let dyRp = calculateDiffY(r, p);
  let dyQp = calculateDiffY(q, p);
  let dxRp = calculateDiffX(r, p);
  return (dyQp * dxRp) - (dxQp * dyRp);
}

function orientation(p, q, r) {
  let val = func(p, q, r);
  if (val === 0) return 0;
  return (val > 0) ? 1 : 2;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isPointClose(x, y, targetX, targetY, threshold) {
  return distance(x, y, targetX, targetY) < threshold;
}

function findPoint(x, y) {
  for (let i = 0; i < points.length; i++) {
    if (isPointClose(x, y, points[i].x, points[i].y, 5)) {
      return i;
    }
  }
  return -1;
}

function createVector(x, y) {
  return {
    x: x,
    y: y,
    update: function(newX, newY) {
      this.x = newX;
      this.y = newY;
    }
  };
}
