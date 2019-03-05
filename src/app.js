'use strict';

import '../config/env';
import './services/authentification/passport';
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
app.use('/api', routes);


module.exports = app;