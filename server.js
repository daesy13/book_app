'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

require('dotenv').config();

app.get('/', (req,res) => {

  res.render('pages/index')
});

app.get('/error', (req, res) => {
  res.render('pages/error')
})

function Book(author){
  this.title = items.title;
  this.author = items.author;
}

app.post('/searches', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author+inauthor:${req.body.author}`).then(data=> {

    const books =  data.body.items.map(book => ({name: book.volumeInfo.title}));

    console.log(books);

    res.render('pages/searches/show', {books:books});
  }).catch(err => {
    console.error(err);
    res.render('pages/error');
  })
})

app.listen(PORT, ()=> {
  console.log(`listening on: ${PORT}`);
});
