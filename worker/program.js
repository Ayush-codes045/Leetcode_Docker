     const fs = require("fs");
     const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
     if (data.length >= 2) {
       const [a, b] = data;
       console.log(a - b);
     }