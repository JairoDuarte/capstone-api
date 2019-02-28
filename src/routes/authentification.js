'use strict';

import express from 'express';

import AuthentificationController from '../controllers/authentification';
import { facebook } from '../services/authentification/passport';

const router = express.Router();
const authController = new AuthentificationController();

router.post('/facebook',
  facebook(), (req, res, next) =>
  authController.login(req, res, next));

export default router;