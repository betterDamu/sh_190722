const jwt = require("jsonwebtoken");
const token = jwt.sign({name:"damu"},"123");
console.log(token)
console.dir(jwt.verify(token,"123"))
console.dir(jwt.decode(token))