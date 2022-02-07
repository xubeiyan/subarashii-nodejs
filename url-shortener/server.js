const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ShortUrls = require('./models/shortUrl')

require('dotenv').config();
const port = process.env.PORT || 4000;

mongoose.connect('mongodb://127.0.0.1/urlShortener');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrls.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrls.create({ full: req.body.fullURL });
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrls.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks += 1;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

console.log(`Listening on port ${port}...`);
app.listen(port);