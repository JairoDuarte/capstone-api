'use strict';

import '../config/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { errorHandler } from 'bodymen';
import mongoose from '../config/database';
import routes from './routes';

mongoose.connect(process.env.DB_CONNECTION, {
  reconnectTries: Number.MAX_VALUE,
  socketTimeoutMS: 0,
  keepAlive: true
});

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', routes);
app.use(errorHandler());

module.exports = app;
