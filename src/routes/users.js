'use strict';

import express from 'express';
import {showMe, get, update, updateStatus, remove, getById} from '../controllers/users';
import { COURSIER_ROLE} from '../models/user';
import { authorize } from '../services/authentification/passport';
import { updateValidator, statusValidator } from '../validators';
const router = express.Router();

router.get('/', authorize(), (req, res) => get(req, res));
router.get('/me', authorize(),(req, res) => showMe(req, res));
router.post('/status', statusValidator(), authorize({roles: [COURSIER_ROLE]}),(req, res) => updateStatus(req, res));
router.get('/:id', authorize(), (req, res) => getById(req, res));
router.put('/:id', updateValidator(), authorize(), (req, res) => update(req, res));
router.delete('/:id', authorize(), (req, res) => remove(req, res));

export default router;