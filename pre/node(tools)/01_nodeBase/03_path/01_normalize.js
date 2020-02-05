//斜杠分正斜杠（forward slash'/'）和反斜杠（back slash'\'），
const {normalize} = require("path");
console.log(normalize("/a/b//c//d"));
console.log(normalize("/a/b/../c//d"));