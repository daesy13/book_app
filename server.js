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
  console.log('req.body :', req.body);
  if (req.body.searchName === 'author') {
    console.log('##############author!');
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author+inauthor:${req.body.author}`).then(data=> {
      const books =  data.body.items.map(book => ({name: book.volumeInfo.title}));
      console.log(books);
      res.render('pages/searches/show', {books:books});
    })
  }
  if (req.body.searchName === 'title') {
    console.log('##############title!');
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=title+intitle:${req.body.title}`).then(data=> {
      const books =  data.body.items.map(book => ({name: book.volumeInfo.title}));
      console.log(books);
      res.render('pages/searches/show', {books:books});
    })
  }
})

app.listen(PORT, ()=> {
  console.log(`listening on: ${PORT}`);
});
