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

app.post('/searches', createSearch);

function Book(info){
  this.title = info[0].name;
  this.author = info[0].author;
  this.description = info[0].description;
  this.image = info[0].image;
}


function createSearch (req, res) {
  console.log('req.body :', req.body);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.searchName === 'title') { url += `+intitle:${req.body.name}`; }
  if (req.body.searchName === 'author') { url += `+inauthor:${req.body.name}`; }

  superagent.get(url).then(data => {
    const books = data.body.items.map(book => ({
      name: book.volumeInfo.title,
      author: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks.thumbnail
    }));
    console.log('books :', books);
    new Book(books);
    res.render('pages/searches/show', {books:books});
  })
}

app.listen(PORT, ()=> {
  console.log(`listening on: ${PORT}`);
});
