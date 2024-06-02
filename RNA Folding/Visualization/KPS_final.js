document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const nextStepButton = document.getElementById('nextStepButton');
    const statusText = document.getElementById('statusText');
    let points = [];
    let points2=[];
    let lineDrawn = false; 
    let medianX;
    let count=0;
    const stepTexts = [
      "Initially, the Kirkpatrick-Seidel algorithm identifies the points possessing the minimum and maximum x-coordinates. These points are then connected by a line, exemplified by the black line depicted above. Points situated above this line contribute to the construction of the Upper Hull, while those below it contribute in Lower Hull.",
      "Now, we'll concentrate on building the Upper Bridge and Upper Hull. We'll highlight these points and fade away the rest to keep our focus clear",
      "Now, we'll identify the median of the x-coordinates for the highlighted points and illustrate this with the help of a red line on the canvas above.",
      "Now, we randomly pair the points and calculate the median slope from all these pairs. Next, we identify a supporting line with a slope equal to this median slope, which is depicted in orange in the visualization above. Additionally, points marked with an ' x ' in the figure above are determined not to contribute to the formation of the upper bridge, and therefore, will be pruned and excluded from further steps.",
      "Pruning points and clearing the pairs...",
      "Since there are no more points left to prune within the quadrilateral, we now have our first edge of the convex hull—the upper bridge, which is part of the upper hull. This is shown as a pink line in the visualization above. Points inside the quadrilateral are removed for clarity, as they cannot contribute to the formation of the convex hull",
      "Now, we can apply the same process to both the left and right sides of our current upper bridge, indicated by cyan lines, to complete our upper hull. Following this, we'll also construct the lower hull using a similar method. By combining the upper and lower hulls, we obtain our complete convex hull, as depicted above."
    ];
    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      points.push({x: x, y: y}); 
      drawCircle(ctx, x, y);
    });

    document.addEventListener('keydown', function(event) {
  if (event.key === 'r' || event.key === 'R') {
    const margin = 50;
    for (let i = 0; i < 10; i++) { 
      const x = Math.random() * (canvas.width - 2 * margin) + margin;
      const y = Math.random() * (canvas.height - 2 * margin) + margin;
      points.push({x: x, y: y}); 
      drawCircle(ctx, x, y);
    }
  }
});


    let stepcount = 0;
    let drawOrangeLine = false; 
    nextStepButton.addEventListener('click', function() {
      if (stepTexts[stepcount]) {
        updateStatusText(stepTexts[stepcount]);
      }      //stepcount++;

    });
    points2 = points;
    nextStepButton.addEventListener('click', function() {
    switch(stepcount) {
        case 0:
            drawLineBetweenExtremes();
            break;
        case 1:
            eraseAndRedraw();
            break;
        case 2:
            drawMedianLineAbove(); 
            break;
        case 3:
            drawRandomSegments();
            break;
        case 4:
            clearRandomSegments();
            stepcount = 2;
            break;
        case 5:
            prunePoints();
            break;
        case 6:
            let hull = convexHull(points, points.length);
            drawHull(hull, ctx); 
            break;

    }
    stepcount++;
});

    function drawCircle(ctx, x, y, color = 'blue') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawLine(ctx, startPoint, endPoint, color = 'black') {
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.strokeStyle = color; 
  ctx.lineWidth = 2;
  ctx.stroke();
}

    function drawLineBetweenExtremes() {
      if (points.length < 2) return; 

      const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
      const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
      drawLine(ctx, leftmost, rightmost);
      lineDrawn = true;
    }

    function eraseAndRedraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
    const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
    const m = (rightmost.y - leftmost.y) / (rightmost.x - leftmost.x);
    const b = leftmost.y - m * leftmost.x;

    points.forEach(point => {
        const isBelowLine = point.y > m * point.x + b;
        drawCircle(ctx, point.x, point.y, isBelowLine ? 'rgba(0, 0, 255, 0.2)' : 'blue'); // Faded color for points below the line
    });

    // Redraw the line
    drawLine(ctx, leftmost, rightmost);
}
function prunePoints() {
    const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
    const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
    const polygon = [leftmost, Upper_Bri[0], Upper_Bri[1], rightmost];

    points.forEach(point => {
        let isCornerPoint = false;

        polygon.forEach(cornerPoint => {
            if (cornerPoint.x === point.x && cornerPoint.y === point.y) {
                isCornerPoint = true;
            }
        });

        if (!isCornerPoint && point_in_polygon(point, polygon)) {
            clearPoint(ctx, point.x, point.y);
            count++;
            points = points.filter(point1 => !(point1.x === point.x && point1.y === point.y));
        }
    });
    //eraseAndRedraw();
  //console.log("Number of points pruned: ");
  //console.log(count);

}

function drawMedianLineAbove() {
    const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
    const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
    const m = (rightmost.y - leftmost.y) / (rightmost.x - leftmost.x);
    const b = leftmost.y - m * leftmost.x;
    
    const pointsAbove = points.filter(point => point.y <= m * point.x + b);

    if (pointsAbove.length > 0) {
        pointsAbove.sort((a, b) => a.x - b.x);
        const medianIndex = Math.floor(pointsAbove.length / 2);
        
        medianX = pointsAbove.length % 2 === 0 ? 
            (pointsAbove[medianIndex - 1].x + pointsAbove[medianIndex].x) / 2 : 
            pointsAbove[medianIndex].x;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach(point => {
            const isBelowLine = point.y > m * point.x + b;
            drawCircle(ctx, point.x, point.y, isBelowLine ? 'rgba(0, 0, 255, 0.2)' : 'blue');
        });

        // Redraw the initial line
        drawLine(ctx, leftmost, rightmost);

        ctx.beginPath();
        ctx.moveTo(medianX, 0);
        ctx.lineTo(medianX, canvas.height);
        ctx.strokeStyle = 'red'; // Different color to distinguish
        ctx.stroke();
    }
}

let pairs;
function pointsEqual(point1,point2) 
{
  return point1.x === point2.x && point1.y === point2.y;
}

function removeNonCandidates(points1, points2)
{
    const filteredPoints1 = points1.filter(point1 => !points2.some(point2 => pointsEqual(point1,point2)));
    return filteredPoints1;
}

function drawRandomSegments() {
  const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
  const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
  const m = (rightmost.y - leftmost.y) / (rightmost.x - leftmost.x);
  const b = leftmost.y - m * leftmost.x;

  let pointsAboveLine = points.filter(point => point.y <= m * point.x + b);
  pointsAboveLine = removeNonCandidates(pointsAboveLine,NON_CANDIDATES);

  pairs = UPPER_BRIDGE(pointsAboveLine); // Call UPPER_BRIDGE with filtered points

  pairs.forEach(pair => {
    drawLine(ctx, pair[0], pair[1], 'green');
  });
}

let Pk;
let Pm;
let CANDIDATES = [];
let NON_CANDIDATES = [];
let Upper_Bri = [];
// Function to shuffle an array randomly
function UPPER_BRIDGE(S) {

  CANDIDATES = [];
  Upper_Bri = [];
  let PAIRS = [];

  if (S.length === 2) {
    Upper_Bri.push(S[0]);
    Upper_Bri.push(S[1]);
    eraseAndRedraw();
    drawLine(ctx, S[0], S[1], 'pink');
    const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
  const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
  S.sort((a, b) => a.x - b.x);
  drawLine(ctx, leftmost, S[0], 'cyan');
  drawLine(ctx, rightmost, S[1], 'cyan');
  stepcount = 5;

    return (S[0].x < S[1].x) ? [S[0], S[1]] : [S[1], S[0]];
  }

  // Step 3: Shuffle the points randomly
  S = shuffleArray(S);

  // Pair up points of S into pairs (Pi, Pj)
  for (let i = 0; i < S.length - 1; i += 2) {
    const pair = [S[i], S[i + 1]];
    PAIRS.push(pair);
  }

  if (S.length % 2 !== 0) {
    CANDIDATES.push(S[S.length - 1]);
  }

  const slopes = [];
  PAIRS.forEach(pair => {
    const slope = (pair[1].y - pair[0].y) / (pair[1].x - pair[0].x);
    slopes.push(slope);
  });

  slopes.sort((a, b) => a - b);
  const medianSlope = slopes[Math.floor(slopes.length / 2)];

  let maxInterceptPoints = findMaxYInterceptPoints(S,medianSlope);
  drawLineThroughPoint(ctx,maxInterceptPoints[0],medianSlope,'orange');

const SMALL = [];
const EQUAL = [];
const LARGE = [];
const K = medianSlope; // Median slope calculated previously

PAIRS.forEach(pair => {
  const slope = (pair[1].y - pair[0].y) / (pair[1].x - pair[0].x);
  if (slope > K) {
    SMALL.push(pair);
  } else if (slope < K) {
    LARGE.push(pair);
  } else {
    EQUAL.push(pair);
  }
});
  console.log("SMALL:", SMALL.map(pair => `(${pair[0].x}, ${pair[0].y}), (${pair[1].x}, ${pair[1].y})`));
  console.log("EQUAL:", EQUAL.map(pair => `(${pair[0].x}, ${pair[0].y}), (${pair[1].x}, ${pair[1].y})`));
  console.log("LARGE:", LARGE.map(pair => `(${pair[0].x}, ${pair[0].y}), (${pair[1].x}, ${pair[1].y})`));



  let Pk = maxInterceptPoints.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
  let Pm = maxInterceptPoints.reduce((prev, curr) => prev.x > curr.x ? prev : curr);

  if (Pk.x <= medianX && Pm.x > medianX) {

    eraseAndRedraw();
    Upper_Bri.push(Pk);
    Upper_Bri.push(Pm);
    //drawCircle(ctx,Pk.x,Pk.y,'blue');
    //drawCircle(ctx,Pm.x,Pm.y,'blue');
    drawLine(ctx, Pk, Pm, 'pink');
    const leftmost = points.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
  const rightmost = points.reduce((prev, curr) => prev.x > curr.x ? prev : curr);
  if(Pk.x < Pm.x){
  drawLine(ctx, leftmost, Pk, 'cyan');
  drawLine(ctx, rightmost, Pm, 'cyan');
  }
  else
  {
    drawLine(ctx, leftmost, Pm, 'cyan');
  drawLine(ctx, rightmost, Pk, 'cyan');
  }

  stepcount = 5;
    return [Pk, Pm];
  }

  
if (Pm.x <= medianX) {
    LARGE.concat(EQUAL).forEach(pair => {
        pair.sort((a, b) => a.x - b.x);
        CANDIDATES.push(pair[1]);
    });
    SMALL.forEach(pair => {
        pair.sort((a, b) => a.x - b.x);
        CANDIDATES.push(pair[0]);
        CANDIDATES.push(pair[1]);
    });
}

if (Pk.x > medianX) {
    SMALL.concat(EQUAL).forEach(pair => {
        pair.sort((a, b) => a.x - b.x);
        CANDIDATES.push(pair[0]);
    });
    LARGE.forEach(pair => {
        pair.sort((a, b) => a.x - b.x);
        CANDIDATES.push(pair[0]);
        CANDIDATES.push(pair[1]);
    });
}


  console.log("CANDIDATES:", CANDIDATES.map(candidate => `(${candidate.x}, ${candidate.y})`));

  S.forEach(point => {
    const isCandidate = CANDIDATES.some(candidate => candidate.x === point.x && candidate.y === point.y);
    if (isCandidate) {
        drawCircle(ctx, point.x, point.y, 'blue');
    } else {
        clearCircle(ctx,point.x,point.y,5);
        drawCross(ctx, point.x, point.y, 10, 'red');
        NON_CANDIDATES.push(point);
    }
});


  return PAIRS;
}

function drawCross(ctx, x, y, size, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.moveTo(x + size / 2, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.stroke();
}

function clearCircle(ctx, x, y, radius) {
    const clearRadius = radius + 1;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, clearRadius, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
}

function findMaxYInterceptPoints(points, K) {
    let maxYIntercept = Infinity;
    let maxInterceptPoint = null;
    let maxInterceptPoints = [];

    points.forEach(point => {
        const yIntercept = point.y - K * point.x;
        if (yIntercept < maxYIntercept) {
            maxYIntercept = yIntercept;
            maxInterceptPoint = point;
        }
    });

    maxInterceptPoints.push(maxInterceptPoint);

    maxInterceptPoint = null;

    const epsilon = 1e-2;

    points.forEach(point => {
        const yIntercept = point.y - K * point.x;

        if (Math.abs(yIntercept - maxYIntercept) < epsilon) {
            maxInterceptPoints.push(point);
        }
    });

    return maxInterceptPoints;
}


function drawLineThroughPoint(ctx, point, slope, color) {
    const yIntercept = point.y - slope * point.x;

    const startX = 0;
    const startY = slope * startX + yIntercept;
    const endX = ctx.canvas.width;
    const endY = slope * endX + yIntercept;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function clearPoint(ctx, x, y, radius = 6) {
    ctx.clearRect(x - radius, y - radius, 2 * radius, 2 * radius);
}

function point_in_polygon(point, polygon) {
    const num_vertices = polygon.length;
    const x = point.x;
    const y = point.y;
    let inside = false;
 
    let p1 = polygon[0];
    let p2;
 
    for (let i = 1; i <= num_vertices; i++) {
        p2 = polygon[i % num_vertices];
 
        if (y > Math.min(p1.y, p2.y)) {
            if (y <= Math.max(p1.y, p2.y)) {
                if (x <= Math.max(p1.x, p2.x)) {
                    const x_intersection = ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;
 
                    if (p1.x === p2.x || x <= x_intersection) {
                        inside = !inside;
                    }
                }
            }
        }
 
        p1 = p2;
    }
 
    return inside;
}
function clearRandomSegments() {
  eraseAndRedraw();

  console.log(NON_CANDIDATES);

  NON_CANDIDATES.forEach(point => {
    clearPoint(ctx,point.x,point.y);
  });
  PAIRS = [];
}

function convexHull(points, n) {
  if (n < 3) return [];

  let hull = [];

  let l = 0;
  for (let i = 1; i < n; i++) {
    if (points[i].x < points[l].x) {
      l = i;
    }
  }

  let p = l, q;
  do {
    hull.push(points[p]);
    q = (p + 1) % n;
    for (let i = 0; i < n; i++) {

      if (orientation(points[p], points[i], points[q]) == 2) {
        q = i;
      }
    }
    p = q;
  } while (p != l); 

  return hull;
}

function orientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val == 0) return 0;  // Collinear
  return (val > 0) ? 1 : 2; 
}

function drawHull(hullPoints, ctx) {
    if (hullPoints.length < 3) return;

 
    let leftmost = hullPoints.reduce((min, p) => p.x < min.x ? p : min, hullPoints[0]);
    let rightmost = hullPoints.reduce((max, p) => p.x > max.x ? p : max, hullPoints[0]);
 
    let slope = (rightmost.y - leftmost.y) / (rightmost.x - leftmost.x);
    
    function isAbove(point) {
        let lineY = slope * (point.x - leftmost.x) + leftmost.y;
        return point.y < lineY;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  
    points2.forEach(point => {
        drawCircle(ctx, point.x, point.y, 'blue'); 
    });


    for (let i = 0; i < hullPoints.length; i++) {
        let startPoint = hullPoints[i];
        let endPoint = hullPoints[(i + 1) % hullPoints.length];

        ctx.strokeStyle = (isAbove(startPoint) || isAbove(endPoint)) ? 'RED' : 'GREEN';

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    }
  
    stroke('black'); 
    line(leftmost.x, leftmost.y, rightmost.x, rightmost.y);

}


function updateStatusText(text) {
  statusText.style.opacity = 0;
  setTimeout(() => {
    statusText.innerText = text; 
    statusText.style.opacity = 1;
  }, 250);
}

});

