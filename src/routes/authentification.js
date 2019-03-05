'use strict';

import express from 'express';

import AuthentificationController from '../controllers/authentification';
import { facebook } from '../services/authentification/passport';

const router = express.Router();
const authController = new AuthentificationController();


router.get('/signup',
  facebook());

router.get('/signin',
  facebook(), (req, res, next) => authController.login(req, res, next));

export default router;