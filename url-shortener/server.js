const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
})

console.log(`Listening on port ${port}...`);
app.listen(port);