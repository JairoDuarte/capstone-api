'use strict';

import express from 'express';

import login from '../controllers/authentification';
import { facebook } from '../services/authentification/passport';

const router = express.Router();

router.post('/facebook', facebook(), (req, res, next) => login(req, res, next));



export default router;