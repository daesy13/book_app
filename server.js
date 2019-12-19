'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//setting up database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (e) => console.error(e));
client.connect();

app.get('/', (req,res) => {

  res.render('pages/index')
});

app.get('/error', (req, res) => {
  res.render('pages/error')
})

app.get('/books/:id', (req, res) => {
  const idFromRoute = req.params.id;
  client.query('SELECT * FROM books WHERE id=$1', [idFromRoute]).then(value => {
    res.send(value.rows[0]);
  });
});

app.post('/searches', createSearch);

function Book(info){
  this.title = info[0].name;
  this.author = info[0].author;
  this.description = info[0].description;
  this.image = info[0].image;
}

app.post('/book-saved', (req, res) => {
  client.query('INSERT INTO books (title, author, description, image)VALUES($1, $2, $3, $4)', Object.values(req.body));
  res.send(Object.values(req.body)).then(() => {
    res.redirect('/');
  });
});


function createSearch (req, res) {
  // console.log('req.body :', req.body);
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

    // console.log('books :', books);
    let book = new Book(books);

    // let SQL = `INSERT INTO books(title, author, description, image)VALUES($1, $2, $3, $4)`;
    // let values = [book.title, book.author, book.description, book.image];
    // console.log('!!!!!values :', values);
    // client.query(SQL, values);
    // console.log('client.query(SQL, values) :', client.query(SQL, values));
    res.render('pages/searches/show', {books:books});
  })
}

app.listen(PORT, ()=> {
  console.log(`listening on: ${PORT}`);
});
