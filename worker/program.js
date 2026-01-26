const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    // Split by spaces and convert to numbers
    const nums = line.split(' ').map(Number);
    
    // Sum all elements
    const sum = nums.reduce((acc, num) => acc + num, 0);
    
    // Output the result
    console.log(sum);
    rl.close();
});