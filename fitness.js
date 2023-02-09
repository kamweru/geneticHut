const fs = require("fs");
let jsonData = require("./solutions.json");

let student = {
  name: "Mike",
  age: 23,
  gender: "Male",
  department: "English",
  car: "Honda",
};

jsonData["first"].push(student);

let data = JSON.stringify(jsonData, null, 2);

fs.writeFile("./solutions.json", data, (err) => {
  if (err) throw err;
  console.log("Data written to file");
});
