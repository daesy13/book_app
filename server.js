'use strict';

// Dependencies
const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
let ejs = require('ejs');
app.set('view engine', 'ejs');

require('dotenv').config();

app.get('/hello', (req,res) => {
  res.render('pages/index')
}) 

// ************************
//   something goes here
// ************************

app.listen(3000, () => {console.log('3000 is connected');});