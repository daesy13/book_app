'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// Middleware to handle PUT and DELETE
app.use(
  methodOverride(req => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

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

app.post('/add_book_form', showAddForm);

app.post('/edit_book_form', showEditForm);

app.post('/', addBook);

app.get('/books/:book_id', getABook);

//UPDATE..
app.put('/update/:book_id', updateBook);
// app.get('/update/:book_id', updateBook);

app.delete('/delete/:book_id', removeBook);

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

// Helper function that renders to the form page
function showAddForm(req, res) {
  console.log('**showAddForm');
  return res.render('pages/books/addForm', {book: req.body});
}
function showEditForm(req, res) {
  console.log('**showEditForm');
  return res.render('pages/books/editForm', {book: req.body});
}

// CRUD: Create a book
function addBook(req, res) {
  console.log('**addBook');
  console.log(req.body);
  let {title, author, isbn, description, image_url} = req.body;
  // return res.render('pages/books/detail', {book: req.body});

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
  console.log('req.body :', req.body);
  let {title, author, isbn, description, image_url} = req.body;

  let SQL = 'UPDATE books SET title=$1, author=$2, isbn=$3, description=$4, image_url=$5 WHERE id=$6;';
  let values = [title, author, isbn, description, image_url, req.params.book_id];
  return client.query(SQL, values)
    .then(res.redirect(`/books/${req.params.book_id}`))
    // .then(res.redirect('/'))
    .catch(error => {
      res.render('pages/error', { error });
    });
}

// CRUD: DELETE a book
function removeBook(req, res) {
  console.log('**removeBook');
  console.log(req.body);
  console.log(req.params.book_id)
  client.query('DELETE FROM books WHERE id=$1', [req.params.book_id]).then(() => {
    res.redirect('/');
  });
}


app.listen(PORT, ()=> {
  console.log('**--------------------**');
  console.log(`** Listening on: ${PORT} **`);
  console.log('**--------------------**');
});
