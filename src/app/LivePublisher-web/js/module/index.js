require("babel-polyfill");
// function* fibonacci() {
//   let [prev, curr] = [0, 1];
//   for (;;) {
//     [prev, curr] = [curr, prev + curr];
//     yield curr;
//   }
// }

// for (let n of fibonacci()) {
//   if (n > 10) break;
//   console.log(n);
// }
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

console.log( numbers() ); // [1, 2]
let arr = [2,3];
var obj = {0: 1};
console.log(obj instanceof Array);