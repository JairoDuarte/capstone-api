'use strict';

/*eslint-disable-next-line*/
import Env from '../config/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes';
import mongoose from '../config/database'


mongoose.connect(process.env.DB_CONNECTION)
mongoose.Promise = Promise

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);


module.exports = app;