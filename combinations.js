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
    let randomCombinationPoint = Math.floor(
      Math.random() * combinations.length
    );
    points.push(randomCombinationPoint);
    // let randomPoint =
    //   combinations[randomCombinationPoint][
    //     Math.floor(Math.random() * combinations[randomCombinationPoint].length)
    //   ];
    // points.push(randomPoint);
    // for (let i = 0; i < combinations[randomCombinationPoint].length; i++) {
    //   if (combinations[randomCombinationPoint][i] === randomPoint) {
    //     combinations[randomCombinationPoint].splice(i, 1);
    //   }
    // }
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
  for (let i = 0; i < linePoints.length; i++) {
    let currCombination = combinations[linePoints[i]];
    let nextLinePoint =
      i === linePoints.length - 1 ? linePoints[0] : linePoints[i + 1];
    let prevLinePoint =
      i === 0 ? linePoints[linePoints.length - 1] : linePoints[i - 1];
    if (prevLinePoint !== nextLinePoint) {
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
    } else {
      break;
    }
  }
  //   console.log(combinations);
  return score;
};
// let many = [
//   [2, 2, 4, 2, 3, 0, 1, 1, 4],
//   [0, 4, 4, 4, 2, 0, 2, 4, 1],
//   [4, 3, 2, 4, 0, 4, 0, 4, 4],
// ];
// for (let i = 0; i < many.length; i++) {
//   let arrObj = [];
//   for (j = 0; j < many[i].length - 1; j++) {
//     arrObj[j] = [many[i][j], many[i][j + 1]];
//   }
//   console.log(arrObj);
// }
let a = [1, 2],
  b = [2, 1];
console.log(arrayEquals(a, b));

// for (let i = 0; i < 4; i++) {
//   let linePoints = generateLinePoints();
//   console.log(linePoints, calculateFitness(linePoints));
// }
