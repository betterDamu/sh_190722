// Promise.resolve().then(()=>{
//   console.log('Promise1')
//   setTimeout(()=>{
//     console.log('setTimeout2')
//   },0)
// })
// setTimeout(()=>{
//   console.log('setTimeout1')
//   Promise.resolve().then(()=>{
//     console.log('Promise2')
//   })
// },0)

const fs = require('fs')
setTimeout(() => {
  console.log('timeout1');
}, 0)

fs.readFile(__filename, () => {
    console.log("------")
  setTimeout(() => {
    console.log('timeout2');
  }, 0)
  setImmediate(() => {
    console.log('immediate1')
  });
})

setImmediate(() => {
  console.log('immediate2')
});
