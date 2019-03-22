'use strict';

import express from 'express';
import { middleware as body } from 'bodymen'
import {showMe, get, update, updateStatus, remove, getById, getRoutes} from '../controllers/users';
import { schema ,COURSIER_ROLE} from '../models/user';
import { authorize } from '../services/authentification/passport';

const router = express.Router();

const  {fullname, phone, email, image} = schema.tree;

router.get('/', authorize(), (req, res) => get(req, res));
router.get('/me', authorize(),(req, res) => showMe(req, res));
router.get('/status', authorize({roles: [COURSIER_ROLE]}),(req, res) => updateStatus(req, res));
router.get('/:id', authorize(), (req, res) => getById(req, res));
router.put('/:id', body({ email, fullname, image, phone }), authorize(), (req, res) => update(req, res));
router.delete('/:id', authorize(), (req, res) => remove(req, res));
router.get('/routes',authorize({roles: [COURSIER_ROLE]}),(req, res) => getRoutes(req, res));

export default router;