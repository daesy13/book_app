'use strict';

// Dependencies
const express = require('express');
const cors = require('cors');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
app.use(cors());
require('dotenv').config();

app.listen(3000, () => {console.log('3000 is connected');});