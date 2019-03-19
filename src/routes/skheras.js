'use strict';

import express from 'express';
import SkherasController from '../controllers/skheras';
import Skhera from '../models/skhera';
import { authorize } from '../services/authentification/passport';
import {COURSIER_ROLE, CUSTOMER_ROLE} from '../models/user';

const router = express.Router();
const skheraController = new SkherasController(Skhera);

router.get('/:id', authorize(),(req, res) => skheraController.getById(req, res));
router.post('/', authorize({roles: [CUSTOMER_ROLE]}),(req, res) => skheraController.create(req, res));
router.delete('/:id', authorize({roles: [CUSTOMER_ROLE]}) ,(req, res) => skheraController.remove(req, res));
router.post('/accept',authorize({roles: [COURSIER_ROLE]}),(req, res) => skheraController.accept(req, res));

export default router;