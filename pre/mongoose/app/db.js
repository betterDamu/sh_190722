//连接数据库
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/sh0722', {useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!")
});