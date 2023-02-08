// let linePoints = [3, 2, 1, 0, 4, 1, 3, 4, 2];

const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

const generateLinePoints = () => {
  let combinations = [
    [1, 4],
    [0, 2, 3, 4],
    [1, 3, 4],
    [1, 2, 4],
    [0, 1, 2, 3],
  ];
  let points = [];
  let pointsArray = [];

  while (points.length < 9) {
    if (points.length === 0) {
      let randomCombinationPoint = Math.floor(
        Math.random() * combinations.length
      );
      points.push(randomCombinationPoint);
    } else {
      let prevPointArray = combinations[points[points.length - 1]];
      let randomInt = Math.floor(Math.random() * prevPointArray.length);
      let nextLinePoint = prevPointArray[randomInt];
      points.push(nextLinePoint);
      combinations[points[points.length - 1]].splice(randomInt, 1);
    }
  }
  // for (let j = 0; j < points.length - 1; j++) {
  //   pointsArray[j] = [points[j], points[j + 1]];
  // }
  return points;
};

const calculateFitness = (linePoints) => {
  let score = 0;
  let combinations = [
    [1, 4],
    [0, 2, 3, 4],
    [1, 3, 4],
    [1, 2, 4],
    [0, 1, 2, 3],
  ];
  for (let i = 0; i < linePoints.length; i++) {
    let currCombination = combinations[linePoints[i]];
    let nextLinePoint =
      i === linePoints.length - 1 ? linePoints[0] : linePoints[i + 1];
    if (currCombination.includes(nextLinePoint)) {
      for (let j = 0; j < currCombination.length; j++) {
        if (currCombination[j] === nextLinePoint) {
          currCombination.splice(j, 1);
          continue;
        }
      }
      score++;
    } else {
      break;
    }
  }
  return score;
};

const duplicateChecker = (linePoints) => {
  let arrObj = [];
  let score = 0;
  for (let j = 0; j < linePoints.length - 1; j++) {
    arrObj[j] = [linePoints[j], linePoints[j + 1]];
  }
  for (let k = 0; k < arrObj.length; k++) {
    let halt = false;
    for (let m = k + 1; m < arrObj.length; m++) {
      let nextReversed = arrObj[m].reverse();
      if (
        arrayEquals(arrObj[k], arrObj[m]) ||
        arrayEquals(arrObj[k], nextReversed)
      ) {
        halt = true;
        score = m;
        break;
      }
    }
    if (halt) break;
  }
  return score;
};

let vertices = [...Array(5).keys()];
let forbidden = [
  [0, 2],
  [0, 3],
];

let allowedEdges = [
  [0, 1],
  [0, 4],
  [1, 2],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 1],
  [3, 4],
];

// let linePoints = [3, 2, 1, 0, 4, 1, 3, 4, 2];

function evaluateFitness(linePoints, allowedEdges) {
  let continuousEdges = 0;
  for (let i = 0; i < linePoints.length - 1; i++) {
    let edge = [linePoints[i], linePoints[i + 1]];
    if (!isEdgeAllowed(edge, allowedEdges)) {
      break;
    }
    continuousEdges++;
  }
  return continuousEdges;
}

function isEdgeAllowed(edge, allowedEdges) {
  for (let i = 0; i < allowedEdges.length; i++) {
    let allowedEdge = allowedEdges[i];
    if (
      (edge[0] === allowedEdge[0] && edge[1] === allowedEdge[1]) ||
      (edge[0] === allowedEdge[1] && edge[1] === allowedEdge[0])
    ) {
      return true;
    }
  }
  return false;
}

let notAnotherOne = (linePoints) => {
  let continuity = [
    [1, 4],
    [0, 2, 3, 4],
    [1, 3, 4],
    [1, 2, 4],
    [0, 1, 2, 3],
  ];

  let edgeSet = [];
  let edgeCount = 0;

  const continous = (firstPoint, secondPoint) => {
    if (continuity[firstPoint].includes(secondPoint)) {
      let secondPointIndex = continuity[firstPoint].indexOf(secondPoint);
      continuity[firstPoint].splice(secondPointIndex, 1);
      return true;
    }
    return false;
  };

  const isDuplicate = (edge, edgeReversed) => {
    if (edgeSet.length) {
      for (let i = 0; i < edgeSet.length; i++) {
        if (
          arrayEquals(edgeSet[i], edge) ||
          arrayEquals(edgeSet[i], edgeReversed)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  for (let i = 0; i < linePoints.length - 1; i++) {
    let firstPoint = linePoints[i];
    let secondPoint = linePoints[i + 1];
    let edge = [firstPoint, secondPoint];
    let edgeReversed = [secondPoint, firstPoint];
    if (isDuplicate(edge, edgeReversed)) {
      break;
    } else {
      if (continous(firstPoint, secondPoint)) {
        edgeSet.push(edge);
        edgeCount++;
      } else {
        break;
      }
    }
  }
  return edgeCount;
};

for (let i = 0; i < 3; i++) {
  let linePoints = generateLinePoints();
  console.log(notAnotherOne(linePoints), linePoints);
}
