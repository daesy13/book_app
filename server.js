'use strict';

// Dependencies
const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
let ejs = require('ejs');
app.set('view engine', 'ejs');

require('dotenv').config();

app.get('/', (req,res) => {

  res.render('pages/index')
}) 

function Book(author){
  this.title = items.title;
  this.author = items.author;
}

app.post('/searches', (req, res) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author+inauthor:${req.body.author}`).then(data=> {

    const books =  data.body.items.map(book => ({name: book.volumeInfo.title}));

    console.log(books);

    res.render('book-results', {books:books});
  })
})


app.listen(3000, () => {console.log('3000 is connected');});