const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
};

const lines = [
  {
    firstPoint: 0,
    secondPoint: 1,
  },
  {
    firstPoint: 0,
    secondPoint: 4,
  },
  {
    firstPoint: 1,
    secondPoint: 2,
  },
  {
    firstPoint: 1,
    secondPoint: 4,
  },
  {
    firstPoint: 2,
    secondPoint: 3,
  },
  {
    firstPoint: 2,
    secondPoint: 4,
  },
  {
    firstPoint: 3,
    secondPoint: 1,
  },
  {
    firstPoint: 3,
    secondPoint: 4,
  },
];

const generateRandomLine = (lineIndex) => {
  let digits = ["firstPoint", "secondPoint"];
  let firstRandom = Math.floor(Math.random() * digits.length);
  let secondRandom = firstRandom === 0 ? 1 : 0;
  let randomLine = {
    firstPoint: lines[lineIndex][digits[firstRandom]],
    secondPoint: lines[lineIndex][digits[secondRandom]],
  };
  return randomLine;
};

const lineScore = (point) => {
  let score = 0;
  for (const [index, line] of lines.entries()) {
    if (
      line.firstPoint === point.firstPoint &&
      line.secondPoint === point.secondPoint
    ) {
      score++;
      break;
    }
    if (
      line.firstPoint === point.secondPoint &&
      line.secondPoint === point.firstPoint
    ) {
      point.firstPoint = line.firstPoint;
      point.secondPoint = line.secondPoint;
      score++;
      break;
    }
  }
  return score;
};

class Member {
  constructor() {
    this.points = [];
    let min = 0,
      max = 8;
    for (let i = min; i < max; i++) {
      let rand = random(min, max);
      this.points[i] = lines[rand];
      // generateRandomLine(rand);
    }
  }

  fitness = () => {
    let score = 0;
    // let lineScoreFitness = 0;
    for (const [index, point] of this.points.entries()) {
      let nextPoint =
        index === this.points.length - 1
          ? this.points[0]
          : this.points[index + 1];

      //   lineScoreFitness += lineScore(point);

      if (point.secondPoint === nextPoint.firstPoint) {
        score++;
      } else {
        break;
      }
    }
    // if(score > 2)
    // console.log(Math.min(score, lineScoreFitness))
    // console.log(Math.min(score, lineScoreFitness) / 16)
    return score;
    // / 8
    // this.points.length
  };

  crossover = (partner) => {
    let child = new Member();
    let midPoint = random(0, this.points.length);

    for (let i = 0; i < this.points.length; i++) {
      if (i > midPoint) {
        child.points[i] = this.points[i];
      } else {
        child.points[i] = partner.points[i];
      }
    }

    return child;
  };

  mutate = (mutationRate) => {
    for (let i = 0; i < this.points.length; i++) {
      if (Math.random() < mutationRate) {
        let rand = random(0, 8);
        this.points[i] = lines[rand];
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
      child.mutate(this.mutationRate);

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
  // console.log(JSON.stringify(population.members))
  population.members.forEach((m) => {
    if (m.fitness() > 4) {
      console.log(m.fitness(), m.points);
    }
  });
};

generate(10, 0.05, 200);

// https://geekyisawesome.blogspot.com/2013/06/fitness-function-for-multi-objective.html
