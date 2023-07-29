const numbers = []
for (let i = 1; i <= 5 * 5; i++) {
    const max = (i * 3.75);
    var min = (max-5);
    if(min<=0) {
        min = 1
    }

    var num = Math.floor(Math.random() * (max - min) + min)
    while(numbers.includes(num)) {
        num = Math.floor(Math.random() * (max - min) + min)
    }
    if(num>90) {
        num = (90-num)+num-Math.floor(Math.random() * (5 - 0) + 0)
    }
    numbers.push(num)
}

console.log(numbers)