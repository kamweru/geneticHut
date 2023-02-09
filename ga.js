const fs = require("fs");
let jsonData = require("./solutions.json");

const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
};
let solutions = jsonData.first;
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

const isDuplicateSolution = (currGenerations, currSolution) => {
  let duplicateEdgesArray = [];

  solutions.forEach(({ generations, solution }) => {
    let duplicateEdges = 0;
    solution.forEach((solutionItem) => {
      currSolution.forEach((currSolutionItem) => {
        if (arrayEquals(solutionItem, currSolutionItem)) {
          duplicateEdges++;
        }
        // if (
        //   arrayEquals(currSolutionItem, [
        //     solution[solution.length - 1 - index][1],
        //     solution[solution.length - 1 - index][0],
        //   ])
        // ) {
        //   duplicateEdges++;
        // }
      });
    });
    duplicateEdgesArray.push(duplicateEdges);
  });
  let maxDuplicateEdges = Math.max(...duplicateEdgesArray);
  if (maxDuplicateEdges === 8) {
    let duplicateIndex = duplicateEdgesArray.indexOf(maxDuplicateEdges);
    solutions[duplicateIndex].generations.push(currGenerations);
    return true;
  }
  return;
};

const generateEdge = () => {
  let allowedEdges = [
    [1, 4],
    [0, 2, 3, 4],
    [1, 3, 4],
    [1, 2, 4],
    [0, 1, 2, 3],
  ];
  let firstPoint = Math.floor(Math.random() * allowedEdges.length);
  shuffleArray(allowedEdges[firstPoint]);
  let secondPoint =
    allowedEdges[firstPoint][
      Math.floor(Math.random() * allowedEdges[firstPoint].length)
    ];
  return [firstPoint, secondPoint];
};

class Member {
  constructor() {
    this.edges = [];
    let min = 0,
      max = 8;
    for (let i = min; i < max; i++) {
      this.edges[i] = generateEdge();
    }
  }

  fitness = () => {
    let score = 0;
    let edgeSet = [];
    let continuity = [
      [1, 4],
      [0, 2, 3, 4],
      [1, 3, 4],
      [1, 2, 4],
      [0, 1, 2, 3],
    ];

    const isDuplicate = (edge) => {
      if (edgeSet.length) {
        let edgeReversed = [edge[1], edge[0]];
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

    const continous = (first, prevEdge, currEdge) => {
      if (first) {
        if (continuity[currEdge[0]].includes(currEdge[1])) {
          let spliceIndex = continuity[currEdge[0]].indexOf(currEdge[1]);
          continuity[currEdge[0]].splice(spliceIndex, 1);
          return true;
        }
      } else {
        if (
          continuity[currEdge[0]].includes(currEdge[1]) &&
          prevEdge[1] === currEdge[0]
        ) {
          let spliceIndex = continuity[currEdge[0]].indexOf(currEdge[1]);
          continuity[currEdge[0]].splice(spliceIndex, 1);
          return true;
        }
      }
      return false;
    };

    for (let i = 0; i < this.edges.length; i++) {
      if (isDuplicate(this.edges[i])) {
        break;
      } else {
        let first = i === 0 ? true : false;
        let currEdge = this.edges[i];
        let prevEdge = i === 0 ? currEdge : this.edges[i - 1];
        if (continous(first, prevEdge, currEdge)) {
          edgeSet.push(this.edges[i]);
          score++;
        } else {
          break;
        }
      }
    }
    return score / 8;
  };

  crossover = (partner) => {
    let child = new Member();
    let midPoint = random(0, this.edges.length);

    for (let i = 0; i < this.edges.length; i++) {
      if (i > midPoint) {
        child.edges[i] = this.edges[i];
      } else {
        child.edges[i] = partner.edges[i];
      }
    }
    return child;
  };

  mutate = (mutationRate) => {
    for (let i = 0; i < this.edges.length; i++) {
      if (Math.random() < mutationRate) {
        let allowedEdges = [
          [1, 4],
          [0, 2, 3, 4],
          [1, 3, 4],
          [1, 2, 4],
          [0, 1, 2, 3],
        ];
        let firstPoint = Math.floor(Math.random() * allowedEdges.length);
        shuffleArray(allowedEdges[firstPoint]);
        let secondPoint =
          allowedEdges[firstPoint][
            Math.floor(Math.random() * allowedEdges[firstPoint].length)
          ];
        this.edges[i] = [firstPoint, secondPoint];
      }
    }
  };
}

class Population {
  constructor(size, mutationRate) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;
    this.generation = 0;
    this.perfectFitness = 6;
    this.bestMember = null;

    for (let i = 0; i < size; i++) {
      this.members.push(new Member());
    }
  }

  _selectMembersForMating = () => {
    let matingPool = [];
    this.members.forEach((m) => {
      let f = Math.floor(m.fitness() * 100) || 1;
      for (let i = 0; i < f; i++) {
        matingPool.push(m);
      }
    });
    return matingPool;
  };

  _reproduce = (matingPool) => {
    for (let i = 0; i < this.members.length; i++) {
      let parentA = matingPool[random(0, matingPool.length)];
      let parentB = matingPool[random(0, matingPool.length)];

      // Perform crossover
      const child = parentA.crossover(parentB);

      // Perform mutation
      child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  };

  _bestFitness = () => {
    let bestFitness = 0;

    this.members.forEach((m) => {
      if (m.fitness() * 8 > bestFitness) {
        bestFitness = m.fitness() * 8;
        this.bestMember = m.edges;
      }
    });
    return bestFitness;
  };

  getGeneration = () => this.generation;

  evolve = () => {
    while (true) {
      const fitness = this._bestFitness();
      if (fitness === this.perfectFitness) {
        // console.log(fitness, this.generation, this.bestMember);
        if (!isDuplicateSolution(this.generation, this.bestMember)) {
          solutions.push({
            generations: [this.generation],
            solution: this.bestMember,
          });
          break;
        }
      }
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
      this.generation++;
    }
  };
}

const generate = (populationSize, mutationRate) => {
  while (true) {
    if (solutions.length === 15) break;
    console.log(solutions.length);
    const population = new Population(populationSize, mutationRate);
    population.evolve();
  }

  let data = JSON.stringify(jsonData, null, 2);

  fs.writeFile("./solutions.json", data, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
};

generate(200, 0.05);
console.log(JSON.stringify(solutions));
// https://geekyisawesome.blogspot.com/2013/06/fitness-function-for-multi-objective.html
