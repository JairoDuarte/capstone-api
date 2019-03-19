'use strict';

import '../config/env';
import './services/authentification/passport';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import cors from 'cors';
import RedisSessions from 'redis-sessions';
import routes from './routes';
import mongoose from '../config/database';

mongoose.connect(process.env.DB_CONNECTION)
mongoose.Promise = Promise

const redis = new RedisSessions();
const app = express();

app.set('redis', redis);
redis.ping(function(err, resp) {
    console.log('Redis Cache connected', resp);  
}); 

app.use(cors({
    origin: 'http://localhost:3000'
  })) 

app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: true, 
    saveUninitialized: true
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
app.use('/api', routes);

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user


module.exports = app;