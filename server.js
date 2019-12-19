'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

//setting up database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (e) => console.error(e));
client.connect();


// API Routes
app.get('/', getBooks);

app.get('/searches', (req,res) => {
  res.render('pages/searches/new');
});

app.post('/searches', createSearch);

app.post('/', addBook);

app.get('/books/:book_id', getABook);

app.put('/update/:book_id', updateBook);

app.get('/error', (req, res) => {
  res.render('pages/error');
})



// Book Constructor
function Book(bookObj){
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors;
  this.isbn = bookObj.volumeInfo.industryIdentifiers[0].identifier;
  this.description = bookObj.volumeInfo.description;
  this.image_url = bookObj.volumeInfo.imageLinks.thumbnail;
}

// CRUD: Read all books
function getBooks(req, res) {
  let SQL = 'SELECT * from books;';
  // console.log('results :', client.query(SQL));
  return client.query(SQL)
    .then(results => res.render('pages/index', {results: results.rows}))
    .catch(error => {
      res.render('pages/error', { error });
    });
}

function getABook(req, res) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [req.params.book_id];
  return client.query(SQL, values)
    .then(result => {
      console.log('single book :', result.rows[0]);
      return res.render('pages/books/detail', {book: result.rows[0]});
    })
    .catch(error => {
      res.render('pages/error', { error });
    });
}

function createSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body.searchName === 'title') { url += `+intitle:${req.body.name}`; }
  if (req.body.searchName === 'author') { url += `+inauthor:${req.body.name}`; }

  superagent.get(url).then(data => {
    const books = data.body.items.map(book => new Book(book));
    // console.log('books :', books);
    res.render('pages/searches/show', { books:books });
  }).catch(error => {
    res.render('pages/error', { error });
  });
}

// CRUD: Create a book
function addBook(req, res) {
  console.log('**addBook');
  console.log(req.body);
  let {title, author, isbn, description, image_url} = req.body;

  let SQL = 'INSERT INTO books(title, author, isbn, description, image_url) VALUES ($1, $2, $3, $4, $5);';
  let values = [title, author, isbn, description, image_url];
  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(error => {
      res.render('pages/error', { error });
    });
}

// CRUD: Update a book
function updateBook(req, res) {
  console.log('**updateBook');
  console.log(req.body);
  let {title, author, isbn, description, image_url} = req.body;

  let SQL = 'UPDATE books SET title=$1, author=$2, isbn=$3, description=$4 image_url=$5 WHERE id=$6';
  let values = [title, author, isbn, description, image_url, req.params.book_id];

  return client.query(SQL, values)
    .then(res.redirect(`/books/${req.params.book_id}`))
    .catch(error => {
      res.render('pages/error', { error });
    });
}


app.listen(PORT, ()=> {
  console.log('**--------------------**');
  console.log(`** Listening on: ${PORT} **`);
  console.log('**--------------------**');
});
