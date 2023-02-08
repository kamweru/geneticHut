function calculateFitness(vertices, edges) {
  let edgeSet = new Set();
  let visited = new Array(vertices.length).fill(false);
  let pathContinuous = true;
  let edgeCount = 0;

  let dfs = function (vertex) {
    visited[vertex] = true;
    for (let i = 0; i < vertices.length; i++) {
      if (edges[vertex][i]) {
        let edge = [vertex, i];
        let edgeReversed = [i, vertex];

        if (edgeSet.has(edge) || edgeSet.has(edgeReversed)) {
          pathContinuous = false;
          break;
        } else {
          edgeSet.add(edge);
          edgeCount++;
          if (!visited[i]) {
            dfs(i);
          }
        }
      }
    }
  };

  dfs(0);

  for (let i = 0; i < vertices.length; i++) {
    if (!visited[i]) {
      pathContinuous = false;
      break;
    }
  }

  return (pathContinuous ? 1 : 0) / (edgeCount + 1);
}
