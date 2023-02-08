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

    const continous = (edge) => {
      let firstPoint = edge[0],
        secondPoint = edge[1];
      if (continuity[firstPoint].includes(secondPoint)) {
        let secondPointIndex = continuity[firstPoint].indexOf(secondPoint);
        continuity[firstPoint].splice(secondPointIndex, 1);
        return true;
      }
      return false;
    };

    for (let i = 0; i < this.edges.length; i++) {
      // if (isDuplicate(this.edges[i])) {
      //   break;
      // } else {
      //   edgeSet.push(this.edges[i]);
      //   score++;
      if (continous(this.edges[i])) {
        console.log(i);
        edgeSet.push(this.edges[i]);
        score++;
      } else {
        break;
      }
      // }
    }
    return score;
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
        let rand = random(0, 8);
        this.edges[i] = lines[rand];
        //   generateRandomLine(rand);
      }
    }
  };
}

class Population {
  constructor(size, mutationRate) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;

    for (let i = 0; i < size; i++) {
      this.members.push(new Member());
    }
  }

  _selectMembersForMating = () => {
    let matingPool = [];
    this.members.forEach((m) => {
      // let f = Math.floor(m.fitness() * 100) || 1
      let f = m.fitness() || 1;
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
      // child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  };

  evolve = (generations) => {
    for (let i = 0; i < generations; i++) {
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }
  };
}

const generate = (populationSize, mutationRate, generations) => {
  const population = new Population(populationSize, mutationRate);
  population.evolve(generations);

  // let blah = population.members.map(m => m.points)
  // console.log(JSON.stringify(population.members));
  population.members.forEach((m) => {
    if (m.fitness() > 4) {
      console.log(m.fitness(), m.edges);
    }
  });
};

generate(5, 0.05, 200);

// https://geekyisawesome.blogspot.com/2013/06/fitness-function-for-multi-objective.html
