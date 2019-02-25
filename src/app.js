'use strict';

/*eslint-disable-next-line*/
import Env from '../config/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import mongoose from '../config/database'


mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
mongoose.Promise = Promise

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})


module.exports = app;