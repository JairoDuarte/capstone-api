'use strict';

import '../config/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from '../config/database';

mongoose.connect(process.env.DB_CONNECTION);
mongoose.Promise = Promise;

const app = express();

app.use(cors({
    origin: process.env.FRONT_URL
  }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

module.exports = app;