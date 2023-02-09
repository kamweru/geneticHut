const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
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

    const arrayEquals = (a, b) => {
      return (
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
      );
    };

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

  evolve = () => {
    const pool = this._selectMembersForMating();
    this._reproduce(pool);

    // decrease the number value
    const fitness = this._bestFitness();
    // console.log();
    if (fitness >= this.perfectFitness) {
      console.log(fitness, this.generation, this.bestMember);
    }
    this.generation++;

    // base case
    if (fitness < this.perfectFitness) {
      return this.evolve();
    }
  };
}

const generate = (populationSize, mutationRate, generations) => {
  const population = new Population(populationSize, mutationRate);
  population.evolve();
  // console.log(population.sum(populationSize));
  // let blah = population.members.map(m => m.points)
  // console.log(JSON.stringify(population.members));
  // population.members.forEach((m) => {
  //   // if (m.fitness() > 4) {
  //   console.log(m.fitness() * 8, m.edges);
  //   // }
  // });
};

generate(5, 0.05, 200);

// https://geekyisawesome.blogspot.com/2013/06/fitness-function-for-multi-objective.html
