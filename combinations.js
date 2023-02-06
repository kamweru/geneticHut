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
  for (let i = 0; i < duplicateChecker(linePoints); i++) {
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

for (let i = 0; i < 3; i++) {
  let linePoints = generateLinePoints();
  console.log(calculateFitness(linePoints), linePoints);
}

// console.log(generateLinePoints());
