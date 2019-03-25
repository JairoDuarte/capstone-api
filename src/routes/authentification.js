'use strict';

import express from 'express';

import login from '../controllers/authentification';
import { facebook } from '../services/authentification/passport';

const router = express.Router();

router.get('/signin',
  facebook(), (req, res, next) => login(req, res, next));

router.use((req, res, next) => {
  
  req.session.socketId = req.query.socketId;
  req.session.role = req.query.role;
  next()
})

router.get('/signup',
  facebook());


export default router;